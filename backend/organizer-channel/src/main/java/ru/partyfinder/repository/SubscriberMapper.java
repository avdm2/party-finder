package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.Channel;
import ru.partyfinder.entity.Subscriber;

import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriberMapper extends JpaRepository<Subscriber, UUID> {

    List<Subscriber> findSubscribersByChannel(Channel channel);
}
