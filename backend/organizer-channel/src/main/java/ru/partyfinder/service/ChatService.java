package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.Message;
import ru.partyfinder.entity.Subscriber;
import ru.partyfinder.repository.ChannelMapper;
import ru.partyfinder.repository.MessageMapper;
import ru.partyfinder.repository.SubscriberMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChannelMapper channelMapper;
    private final MessageMapper messageMapper;
    private final SubscriberMapper subscriberMapper;

    public void createChannel(Channel channel) {
        channelMapper.createChannel(Channel.builder()
                .id(UUID.randomUUID())
                .name(channel.name())
                .ownerUsername(channel.ownerUsername())
                .build());
    }

    public Channel findByOwnerUsername(String ownerUsername) {
        return channelMapper.findByOwnerUsername(ownerUsername);
    }

    public List<Channel> findAllForSubscriber(UUID subscriberId) {
        return channelMapper.findAllForSubscriber(subscriberId);
    }

    public void sendMessage(Message message) {
        messageMapper.sendMessage(Message.builder()
                .id(UUID.randomUUID())
                .channelId(message.channelId())
                .content(message.content())
                .createdAt(LocalDateTime.now())
                .build());
    }

    public List<Message> findMessagesByChannel(UUID channelId) {
        return messageMapper.findMessagesByChannel(channelId);
    }

    public void subscribe(Subscriber subscriber) {
        subscriberMapper.subscribe(Subscriber.builder()
                .id(UUID.randomUUID())
                .subscriberId(subscriber.subscriberId())
                .channelId(subscriber.channelId())
                .build());
    }

    public List<Subscriber> findSubscribersByChannel(UUID channelId) {
        return subscriberMapper.findSubscribersByChannel(channelId);
    }
}
