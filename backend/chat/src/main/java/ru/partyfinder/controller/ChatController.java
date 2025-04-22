package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.config.security.UserContextHolder;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.model.dto.ChatDTO;
import ru.partyfinder.model.dto.MessageDTO;
import ru.partyfinder.model.mapper.ChatMapper;
import ru.partyfinder.model.mapper.MessageMapper;
import ru.partyfinder.service.ChatService;
import ru.partyfinder.service.MessageService;
import ru.partyfinder.service.ProfileService;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/v3/chat")
public class ChatController {

    private final ChatService chatService;
    private final ProfileService profileService;
    private final MessageService messageService;
    private final ChatMapper chatMapper;
    private final MessageMapper messageMapper;

    @PostMapping
    public ChatDTO createChat(@RequestBody List<String> usernames) {
        log.info(String.valueOf(usernames));
        List<Profile> profiles = usernames.stream()
                .map(profileService::findByUsername)
                .toList();
        return chatMapper.toDto(chatService.findOrCreateChat(profiles.get(0), profiles.get(1)));
    }

    @GetMapping("/{chatId}")
    public ChatDTO getChatById(@PathVariable UUID chatId) {
        return chatMapper.toDto(chatService.getChatById(chatId));
    }

    @GetMapping("/user")
    public List<ChatDTO> getUserChats() {
        String username = UserContextHolder.getContext().getUsername();
        Profile profile = profileService.findByUsername(username);
        return chatMapper.toDtoList(chatService.getChatsForProfile(profile));
    }

    @GetMapping
    public List<MessageDTO> getMessagesByChatId(@RequestParam UUID chatId) {
        return messageMapper.toDtoList(messageService.getMessagesForChat(chatService.getChatById(chatId)));
    }
}