package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.Message;
import ru.partyfinder.entity.Subscriber;
import ru.partyfinder.model.MessageDTO;
import ru.partyfinder.model.request.SubscriberDTO;
import ru.partyfinder.service.ChatService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/create")
    public ResponseEntity<Channel> createChannel(@RequestBody Channel channel) {
        return ResponseEntity.ok(chatService.createChannel(channel));
    }

    @GetMapping("/owner/{ownerUsername}")
    public ResponseEntity<Channel> findByOwnerUsername(@PathVariable String ownerUsername) {
        return ResponseEntity.ok(chatService.findByOwnerUsername(ownerUsername));
    }

    @GetMapping("/subscriber/{subscriberUsername}")
    public ResponseEntity<List<Channel>> findAllForSubscriber(@PathVariable String subscriberUsername) {
        return ResponseEntity.ok(chatService.findAllForSubscriber(subscriberUsername));
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageDTO message) {
        return ResponseEntity.ok(chatService.sendMessage(message));
    }

    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<Message>> findMessagesByChannel(@PathVariable UUID channelId) {
        return ResponseEntity.ok(chatService.findMessagesByChannel(channelId));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody SubscriberDTO subscriber) {
        chatService.subscribe(subscriber);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unsubscribe")
    @Transactional
    public ResponseEntity<Void> unsubscribe(@RequestBody SubscriberDTO subscriber) {
        chatService.unsubscribe(subscriber);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/channel/{channelId}/subscribers")
    public ResponseEntity<List<Subscriber>> findSubscribersByChannel(@PathVariable UUID channelId) {
        return ResponseEntity.ok(chatService.findSubscribersByChannel(channelId));
    }

    @GetMapping("/is-subscribed/{channelId}/{subscriberUsername}")
    public ResponseEntity<Boolean> isSubscribed(@PathVariable UUID channelId, @PathVariable String subscriberUsername) {
        return ResponseEntity.ok(chatService.isSubscribed(channelId, subscriberUsername));
    }
}