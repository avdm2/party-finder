package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.config.security.UserContextHolder;
import ru.partyfinder.entity.Chat;
import ru.partyfinder.entity.Message;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.service.ChatService;
import ru.partyfinder.service.MessageService;
import ru.partyfinder.service.ProfileService;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v3/chat")
public class ChatController {

    private final ChatService chatService;
    private final ProfileService profileService;
    private final MessageService messageService;

    @PostMapping
    public Chat createChat(@RequestBody List<String> usernames) {
        List<Profile> profiles = usernames.stream()
                .map(profileService::findByUsername)
                .toList();
        return chatService.createChat(profiles);
    }

    @GetMapping("/{chatId}")
    public Chat getChatById(@PathVariable UUID chatId) {
        return chatService.getChatById(chatId);
    }

    @GetMapping("/user")
    public List<Chat> getUserChats() {
        String username = UserContextHolder.getContext().getUsername();
        Profile profile = profileService.findByUsername(username);
        return chatService.getChatsForProfile(profile);
    }
    @GetMapping
    public List<Message> getMessagesByChatId(@RequestParam UUID chatId) {
        return messageService.getMessagesForChat(chatService.getChatById(chatId));
    }

}