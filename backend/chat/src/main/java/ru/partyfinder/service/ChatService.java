package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Chat;
import ru.partyfinder.entity.ChatParticipant;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.ChatParticipantRepository;
import ru.partyfinder.repository.ChatRepository;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatParticipantRepository chatParticipantRepository;


    public boolean areParticipants(Chat chat, Profile user1, Profile user2) {
        return chatParticipantRepository.existsByChatAndProfile(chat, user1) &&
                chatParticipantRepository.existsByChatAndProfile(chat, user2);
    }
    private Chat createChat(List<Profile> participants) {
        Chat chat = new Chat();
        chat = chatRepository.save(chat);

        for (Profile participant : participants) {
            ChatParticipant chatParticipant = new ChatParticipant();
            chatParticipant.setChat(chat);
            chatParticipant.setProfile(participant);
            chatParticipantRepository.save(chatParticipant);
        }

        return chat;
    }

    public Chat getChatById(UUID chatId) {
        return chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
    }

    public List<Chat> getChatsForProfile(Profile profile) {
        return chatParticipantRepository.findByProfile(profile).stream()
                .map(ChatParticipant::getChat)
                .toList();
    }

    public Chat findOrCreateChat(Profile profile1, Profile profile2) {
        List<Chat> chats = chatRepository.findByParticipants(profile1, profile2);
        if (!chats.isEmpty()) {
            return chats.get(0);
        }
        return createChat(List.of(profile1, profile2));
    }
}