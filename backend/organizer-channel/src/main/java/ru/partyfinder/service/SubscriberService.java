package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.ChannelProfile;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.ChannelProfileRepository;
import ru.partyfinder.repository.ProfileRepository;

import java.util.UUID;

@Service
@AllArgsConstructor
public class SubscriberService {

    private final ProfileRepository profileRepository;
    private final ChannelProfileRepository channelProfileRepository;


    public void subscribeToChannel(Channel channel,String userUUID) {
        Profile profile = profileRepository.getReferenceById(UUID.fromString(userUUID));
        ChannelProfile channelProfile = new ChannelProfile(channel.getId(), profile.getId());
        channelProfileRepository.save(channelProfile);
    }

    public void unsubscribeFromChannel(Channel channel, String userUUID) {
        channelProfileRepository.deleteById(
                channelProfileRepository
                        .findByChannelIdAndProfileId(channel.getId(),
                                UUID.fromString(userUUID)).
                        orElseThrow(() -> new IllegalArgumentException("Нет такой связи между каналом и профилем")).getId()
        );
    }
}
