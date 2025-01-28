package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.Message;
import ru.partyfinder.repository.ChannelRepository;

import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
public class ChannelService {

    private final ChannelRepository channelRepository;

    private final SubscriberService subscriberService;

    private SimpMessagingTemplate messagingTemplate;

    private final ChannelService channelService;

    public Channel createChannel(String name) {
        Channel channel = new Channel();
        channel.setName(name);
        return channelRepository.save(channel);
    }

    public Channel getChannel(UUID uuid) {
        return channelRepository.findChannelByUuid(uuid).orElseThrow();
    }

    public void subscribeToChannel(String channelGUID, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userUUID = authentication.getName();
        if (userUUID != null) {
            Channel channel = channelService.getChannel(UUID.fromString(channelGUID));
            subscriberService.subscribeToChannel(channel, userUUID);
            if (sessionId != null) {
                messagingTemplate.convertAndSendToUser(sessionId, "/queue/subscriptions", "Subscribed to channel: " + channelGUID);
            } else  {
                log.warn("ID СЕССИИ НЕТ");
            }
        } else {
            log.warn("ID ЮЗЕРА НЕТ");
        }
    }

    public void unsubscribeFromChannel(String channelUUID, SimpMessageHeaderAccessor headerAccessor) {
        String sessionId = headerAccessor.getSessionId();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userUUID = authentication.getName();
        Channel channel = channelService.getChannel(UUID.fromString(channelUUID));
        subscriberService.unsubscribeFromChannel(channel, userUUID);
        if (sessionId != null) {
            messagingTemplate.convertAndSendToUser(sessionId, "/queue/subscriptions", "Unsubscribed from channel: " + channelUUID);
        }
    }
    public void sendMessage(String channelId, Message message) {
        messagingTemplate.convertAndSend("/topic/channel/" + channelId, message);
    }
}
