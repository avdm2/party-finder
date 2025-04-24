package ru.partyfinder.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.partyfinder.entity.PrizeHistoryEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface PrizeHistoryRepository extends JpaRepository<PrizeHistoryEntity, UUID> {

    List<PrizeHistoryEntity> findAllByOrganizerUuid(UUID ownerUUID);

    @Modifying
    @Transactional
    @Query("""
            update PrizeHistoryEntity p
            set p.delivered = true, p.deliveredTimestamp = :deliveredTimestamp
            where p.id = :id
            """)
    int deliverPrize(Integer id, LocalDateTime deliveredTimestamp);
}
