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

    @Modifying
    @Query("""
            update PrizeEntity e
            set e.amount = case when :amount IS NOT NULL then :amount ELSE e.amount END,
                e.bonusCost = case when :bonusCost IS NOT NULL then :bonusCost ELSE e.bonusCost END,
                e.fileData = case when :fileData IS NOT NULL then :fileData ELSE e.fileData END
            where e.id = :id
            """)
    int updatePrize(PrizeEntity prizeEntity);
}
