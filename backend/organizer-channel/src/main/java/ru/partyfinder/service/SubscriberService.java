package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.ChannelClient;
import ru.partyfinder.entity.Client;
import ru.partyfinder.entity.keys.ChannelClientPK;
import ru.partyfinder.repository.ChannelClientRepository;
import ru.partyfinder.repository.ClientRepository;

import java.util.UUID;

@Service
@AllArgsConstructor
public class SubscriberService {

    private final ClientRepository clientRepository;
    private final ChannelClientRepository channelClientRepository;


    public void subscribeToChannel(Channel channel,String userUUID) {
        ChannelClientPK channelClientPK = new ChannelClientPK(channel.getId(), UUID.fromString(userUUID));
        Client client = clientRepository.getReferenceById(UUID.fromString(userUUID));
        ChannelClient channelClient = new ChannelClient(channelClientPK, channel, client);
        channelClientRepository.save(channelClient);
    }

    public void unsubscribeFromChannel(Channel channel, String userUUID) {
        ChannelClientPK channelClientPK = new ChannelClientPK(channel.getId(), UUID.fromString(userUUID));
        channelClientRepository.deleteById(channelClientPK);
    }
}
