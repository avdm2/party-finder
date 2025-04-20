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

    @Query("SELECT c FROM Chat c JOIN c.participants cp WHERE cp.profile IN :profiles GROUP BY c HAVING COUNT(DISTINCT cp.profile) = :size")
    List<Chat> findByParticipants(List<Profile> profiles, int size);
}