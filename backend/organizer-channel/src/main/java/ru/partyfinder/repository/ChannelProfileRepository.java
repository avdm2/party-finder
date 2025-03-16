package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.ChannelProfile;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChannelProfileRepository extends JpaRepository<ChannelProfile, Long> {

    Optional<ChannelProfile> findByChannelIdAndProfileId(Long channelId, UUID profileId);
}
