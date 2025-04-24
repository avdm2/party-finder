package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.partyfinder.entity.*;
import ru.partyfinder.model.dto.MessageDTO;
import ru.partyfinder.model.dto.ProfileDTO;
import ru.partyfinder.service.*;

import java.security.Principal;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Controller
@AllArgsConstructor
public class ChatWebSocketHandler {

    private final MessageService messageService;
    private final ProfileService profileService;
    private final ChatService chatService;
    private final EncryptionService encryptionService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{chatId}")
    public void handleMessage(
            @Payload MessageDTO messageDTO,
            @DestinationVariable UUID chatId) {

        try {
            if (messageDTO.getContent() == null || messageDTO.getContent().trim().isEmpty()) {
                throw new IllegalArgumentException("Message content cannot be empty");
            }
            if (messageDTO.getSenderUsername() == null || messageDTO.getReceiverUsername() == null) {
                throw new IllegalArgumentException("Sender or receiver not specified");
            }

            Profile sender = profileService.findByUsername(messageDTO.getSenderUsername());
            Profile receiver = profileService.findByUsername(messageDTO.getReceiverUsername());
            if (sender == null || receiver == null) {
                throw new IllegalArgumentException("Sender or receiver not found");
            }

            Chat chat = chatService.getChatById(chatId);
            if (chat == null) {
                throw new IllegalArgumentException("Chat not found");
            }

            if (!chatId.equals(messageDTO.getChatId())) {
                throw new SecurityException("Chat ID mismatch");
            }

            if (!chatService.areParticipants(chat, sender, receiver)) {
                throw new SecurityException("Users are not participants of this chat");
            }

            Message message = new Message();
            message.setChat(chat);
            message.setSender(sender);
            message.setReceiver(receiver);
            message.setContent(messageDTO.getContent());
            message.setSentTime(Instant.now());

            if (encryptionService != null) {
                String encryptedContent = encryptionService.encryptMessage(
                        messageDTO.getContent(),
                        sender,
                        receiver
                );
                message.setEncryptedContent(encryptedContent);
            }

            Message savedMessage = messageService.saveMessage(message);

            MessageDTO responseDTO = new MessageDTO();
            responseDTO.setId(savedMessage.getId());
            responseDTO.setChatId(chatId);
            responseDTO.setContent(savedMessage.getContent());
            responseDTO.setEncryptedContent(savedMessage.getEncryptedContent());
            responseDTO.setSentTime(savedMessage.getSentTime());
            responseDTO.setSender(convertToProfileDTO(sender));
            responseDTO.setReceiver(convertToProfileDTO(receiver));
            responseDTO.setTempId(messageDTO.getTempId());

            messagingTemplate.convertAndSend(
                    "/topic/messages/" + chatId,
                    responseDTO
            );

        } catch (Exception e) {
            log.error("Error processing message: ", e);
            if (messageDTO.getSenderUsername() != null) {
                messagingTemplate.convertAndSendToUser(
                        messageDTO.getSenderUsername(),
                        "/queue/errors",
                        "Error: " + e.getMessage()
                );
            }
        }
    }
    /*private MessageDTO convertToMessageDTO(Message message, Profile sender, Profile receiver) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setChatId(message.getChat().getId());
        dto.setContent(message.getContent());
        dto.setEncryptedContent(message.getEncryptedContent());
        dto.setSentTime(message.getSentTime());
        dto.setSender(convertToProfileDTO(sender));
        dto.setReceiver(convertToProfileDTO(receiver));
        dto.setReceiverUsername(receiver.getUsername());
        return dto;
    }*/

    private ProfileDTO convertToProfileDTO(Profile profile) {
        ProfileDTO dto = new ProfileDTO();
        dto.setId(profile.getId());
        dto.setUsername(profile.getUsername());
        dto.setName(profile.getName());
        dto.setSurname(profile.getSurname());
        return dto;
    }
}