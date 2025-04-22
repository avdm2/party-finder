package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Chat;
import ru.partyfinder.entity.Message;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.MessageRepository;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    public final EncryptionService encryptionService;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getMessagesForChat(Chat chat) {
        return messageRepository.findByChat(chat);
    }
}