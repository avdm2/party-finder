package ru.partyfinder.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import ru.partyfinder.entity.Message;

@Controller
public class ChannelWebSocketController {

    @MessageMapping("/channel/{channelId}/send")
    @SendTo("/topic/channel/{channelId}")
    public Message sendMessage(@DestinationVariable String channelId, Message message) {
        return message;
    }
}
