package ru.partyfinder.service;

import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.repository.ChannelRepository;

import java.util.UUID;

@Service
public class ChannelService {
    private final ChannelRepository channelRepository;

    public ChannelService(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    public Channel createChannel(String name) {
        Channel channel = new Channel();
        channel.setName(name);
        return channelRepository.save(channel);
    }
    public Channel getChannel(UUID uuid) {
        return channelRepository.findChannelByUuid(uuid).orElseThrow();
    }
}
