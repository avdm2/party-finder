package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.entity.Channel;

import java.util.Optional;
import java.util.UUID;

public interface ChannelRepository extends JpaRepository<Channel, Long> {

    Optional<Channel> findChannelByUuid(UUID uuid);
}
