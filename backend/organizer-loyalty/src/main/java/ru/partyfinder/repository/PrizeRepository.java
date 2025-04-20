package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.partyfinder.entity.PrizeEntity;

import java.util.List;
import java.util.UUID;

public interface PrizeRepository extends JpaRepository<PrizeEntity, UUID> {

    List<PrizeEntity> findAllByOwnerUUID(UUID organizerUuid);

    @Modifying
    @Query("""
            update PrizeEntity e
            set e.amount = e.amount - 1
            where e.id = :prizeUuid
            """)
    int reduceAmount(UUID prizeUuid);

}
