package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.Channel;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChannelMapper extends JpaRepository<Channel, UUID> {

    Channel findByOwnerUsername(String ownerUsername);

    @Query("""
                SELECT c
                FROM Channel c
                LEFT JOIN Subscriber s ON s.channel.id = c.id
                WHERE s.subscriberId = :subscriberId
            """)
    List<Channel> findAllForSubscriber(@Param("subscriberId") UUID subscriberId);
}
