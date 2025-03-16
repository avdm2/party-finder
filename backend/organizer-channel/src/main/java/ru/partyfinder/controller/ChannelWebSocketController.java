package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.Message;
import ru.partyfinder.service.ChannelService;

import java.util.Optional;
import java.util.UUID;

@Controller
@AllArgsConstructor
public class ChannelWebSocketController {

    private final ChannelService channelService;

    @MessageMapping("/channel/{channelUUID}/subscribe")
    public void subscribeToChannel(@DestinationVariable String channelUUID, SimpMessageHeaderAccessor headerAccessor) {
        channelService.subscribeToChannel(channelUUID, headerAccessor);
    }

    @MessageMapping("/channel/{channelUUID}/unsubscribe")
    public void unsubscribeFromChannel(@DestinationVariable String channelUUID, SimpMessageHeaderAccessor headerAccessor) {
        channelService.unsubscribeFromChannel(channelUUID, headerAccessor);
    }

    @MessageMapping("/channel/{channelUUID}/send")
    @SendTo("/topic/channel/{channelUUID}")
    public void sendMessage(@DestinationVariable String channelUUID, Message message) {
        channelService.sendMessage(channelUUID, message);
    }


}
