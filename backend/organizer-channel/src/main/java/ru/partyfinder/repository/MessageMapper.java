package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.Message;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageMapper extends JpaRepository<Message, UUID> {

    List<Message> findMessagesByChannel_IdOrderByCreatedAtAsc(UUID channelId);
}
