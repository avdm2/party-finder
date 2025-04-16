package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.Message;
import ru.partyfinder.entity.Subscriber;
import ru.partyfinder.service.ChatService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/create")
    public ResponseEntity<Void> createChannel(@RequestBody Channel channel) {
        chatService.createChannel(channel);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/owner/{ownerUsername}")
    public ResponseEntity<Channel> findByOwnerUsername(@PathVariable String ownerUsername) {
        return ResponseEntity.ok(chatService.findByOwnerUsername(ownerUsername));
    }

    @GetMapping("/subscriber/{subscriberId}")
    public ResponseEntity<List<Channel>> findAllForSubscriber(@PathVariable UUID subscriberId) {
        return ResponseEntity.ok(chatService.findAllForSubscriber(subscriberId));
    }

    @PostMapping("/send")
    public ResponseEntity<Void> sendMessage(@RequestBody Message message) {
        chatService.sendMessage(message);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<Message>> findMessagesByChannel(@PathVariable UUID channelId) {
        return ResponseEntity.ok(chatService.findMessagesByChannel(channelId));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody Subscriber subscriber) {
        chatService.subscribe(subscriber);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/channel/{channelId}/subscribers")
    public ResponseEntity<List<Subscriber>> findSubscribersByChannel(@PathVariable UUID channelId) {
        return ResponseEntity.ok(chatService.findSubscribersByChannel(channelId));
    }
}
