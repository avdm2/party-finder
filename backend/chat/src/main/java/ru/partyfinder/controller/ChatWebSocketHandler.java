package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.partyfinder.entity.Chat;
import ru.partyfinder.entity.Message;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.model.dto.MessageDTO;
import ru.partyfinder.service.ChatService;
import ru.partyfinder.service.MessageService;
import ru.partyfinder.service.ProfileService;

import java.security.Principal;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class ChatWebSocketHandler {

    private final MessageService messageService;
    private final ProfileService profileService;
    private final ChatService chatService;
    private final SimpMessagingTemplate template;

    @MessageMapping("/chat/{chatId}")
    public void handleMessage(@Payload MessageDTO messageDTO, @DestinationVariable UUID chatId, Principal principal) throws Exception {
        Profile sender = profileService.findByUsername(principal.getName());
        Profile receiver = profileService.findByUsername(messageDTO.getReceiverUsername());
        Chat chat = chatService.getChatById(chatId);

        Message message = messageService.sendMessage(chat, sender, receiver, messageDTO.getContent());
        String decryptedContent = messageService.encryptionService.decryptMessage(message.getEncryptedContent(), sender, receiver);
        message.setContent(decryptedContent);

        template.convertAndSend("/topic/messages/" + chatId, message);
    }
}