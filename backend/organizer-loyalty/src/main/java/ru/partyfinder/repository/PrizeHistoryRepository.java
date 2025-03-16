package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.partyfinder.entity.PrizeHistoryEntity;

import java.util.List;
import java.util.UUID;

public interface PrizeHistoryRepository extends JpaRepository<PrizeHistoryEntity, UUID> {

    @Query("""
            select p
            from PrizeHistoryEntity p
            where p.organizerUuid = :ownerUUID and p.delivered = false
            """)
    List<PrizeHistoryEntity> findAllUndeliveredByOrganizerUuid(UUID ownerUUID);

    @Modifying
    @Query("""
            update PrizeHistoryEntity p
            set p.delivered = true
            where p.organizerUuid = :organizerUuid
            and p.participantUsername = :participantUsername
            and p.prizeUuid = :prizeUUID
            """)
    int deliverPrize(UUID organizerUuid, String participantUsername, UUID prizeUUID);
}
