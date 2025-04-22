package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.Chat;
import ru.partyfinder.entity.ChatParticipant;
import ru.partyfinder.entity.Profile;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, UUID> {
    List<ChatParticipant> findByProfile(Profile profile);

    boolean existsByChatAndProfile(Chat chat, Profile profile);

}