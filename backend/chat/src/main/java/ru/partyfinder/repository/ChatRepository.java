package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.Chat;
import ru.partyfinder.entity.Profile;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatRepository extends JpaRepository<Chat, UUID> {

    @Query("""
    SELECT c FROM Chat c
    JOIN ChatParticipant cp1 ON cp1.chat = c AND cp1.profile = :profile1
    JOIN ChatParticipant cp2 ON cp2.chat = c AND cp2.profile = :profile2
    WHERE (SELECT COUNT(cp) FROM ChatParticipant cp WHERE cp.chat = c) = 2
""")
    List<Chat> findByParticipants(Profile profile1, Profile profile2);
}