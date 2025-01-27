package ru.partyfinder.controller;

import org.springframework.web.bind.annotation.*;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.dto.ChannelRequest;
import ru.partyfinder.entity.dto.GetChannelDTO;
import ru.partyfinder.service.ChannelService;

@RestController
@RequestMapping("/api/v1/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @PostMapping("/create")
    public Channel createChannel(@RequestBody ChannelRequest request) {
        return channelService.createChannel(request.getName());
    }

    @GetMapping("/getChannel")
    public Channel getChannel(@RequestParam GetChannelDTO getChannelDTO) {
        if (getChannelDTO.getChannelUUID() != null) {
            return channelService.getChannel(getChannelDTO.getChannelUUID());
        }
        return null;
    }
}
