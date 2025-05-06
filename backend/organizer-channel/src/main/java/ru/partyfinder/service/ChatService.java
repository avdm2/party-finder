package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.Message;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.entity.Subscriber;
import ru.partyfinder.model.MessageDTO;
import ru.partyfinder.model.request.SubscriberDTO;
import ru.partyfinder.repository.ChannelMapper;
import ru.partyfinder.repository.MessageMapper;
import ru.partyfinder.repository.ProfileRepository;
import ru.partyfinder.repository.SubscriberMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChannelMapper channelMapper;
    private final MessageMapper messageMapper;
    private final SubscriberMapper subscriberMapper;
    private final ProfileRepository profileRepository;

    public Channel createChannel(Channel channel) {
        return channelMapper.save(Channel.builder()
                .id(UUID.randomUUID())
                .name(channel.getName())
                .ownerUsername(channel.getOwnerUsername())
                .build());
    }

    public Channel findByOwnerUsername(String ownerUsername) {
        return channelMapper.findByOwnerUsername(ownerUsername);
    }

    public List<Channel> findAllForSubscriber(String subscriberUsername) {
        Optional<Profile> profileOpt = profileRepository.findByUsername(subscriberUsername);
        if (profileOpt.isPresent()) {
            return channelMapper.findAllForSubscriber(profileOpt.get().getId());
        } else {
            throw new RuntimeException("Нет такого профиля");
        }
    }

    public Message sendMessage(MessageDTO message) {
        Channel channel = channelMapper.findById(message.getChannelId())
                .orElseThrow(() -> new IllegalArgumentException("Канал не найден"));

        return messageMapper.save(Message.builder()
                .id(UUID.randomUUID())
                .channel(channel)
                .content(message.getContent())
                .createdAt(LocalDateTime.now())
                .build());
    }

    public List<Message> findMessagesByChannel(UUID channelId) {
        return messageMapper.findMessagesByChannel_IdOrderByCreatedAtAsc(channelId);
    }

    public void subscribe(SubscriberDTO subscriber) {
        Optional<Profile> profileOpt = profileRepository.findByUsername(subscriber.getSubscriberUsername());
        if (profileOpt.isPresent()) {
            Optional<Channel> channelOpt = channelMapper.findById(subscriber.getChannelId());
            if (channelOpt.isPresent()) {
                subscriberMapper.save(Subscriber.builder()
                        .id(UUID.randomUUID())
                        .subscriberId(profileOpt.get().getId())
                        .channel(channelOpt.get())
                        .build());
            } else {
                throw new RuntimeException("Нет такого канала");
            }
        } else {
            throw new RuntimeException("Нет такого профиля");
        }

    }

    public void unsubscribe(SubscriberDTO subscriber) {
        Optional<Profile> profileOpt = profileRepository.findByUsername(subscriber.getSubscriberUsername());
        if (profileOpt.isPresent()) {
            Optional<Channel> channelOpt = channelMapper.findById(subscriber.getChannelId());
            if (channelOpt.isPresent()) {
                subscriberMapper.deleteByChannelIdAndSubscriberId(channelOpt.get().getId(), profileOpt.get().getId());
            } else {
                throw new RuntimeException("Нет такого канала");
            }
        } else {
            throw new RuntimeException("Нет такого профиля");
        }
    }

    public boolean isSubscribed(UUID channelId, String subscriberUsername) {
        Optional<Profile> profileOpt = profileRepository.findByUsername(subscriberUsername);
        if (profileOpt.isPresent()) {
            return subscriberMapper.existsByChannelIdAndSubscriberId(channelId, profileOpt.get().getId());
        } else {
            throw new RuntimeException("Нет такого профиля");
        }
    }

    public List<Subscriber> findSubscribersByChannel(UUID channelId) {
        return subscriberMapper.findSubscribersByChannel(channelMapper.findById(channelId).get());
    }
}