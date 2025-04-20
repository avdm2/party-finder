package ru.partyfinder.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.partyfinder.entity.PromocodeEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PromocodeRepository extends JpaRepository<PromocodeEntity, Long> {

    Optional<PromocodeEntity> findByValue(String value);

    @Modifying
    @Transactional
    @Query("""
            update PromocodeEntity promocodeEntity
            set promocodeEntity.numberOfUsage = promocodeEntity.numberOfUsage - 1
            where promocodeEntity.value = :promocode and promocodeEntity.numberOfUsage != 0
            """)
    int redeemPromocode(String promocode);

    List<PromocodeEntity> findAllByOwnerUUID(UUID ownerUUID);

    PromocodeEntity getByValue(String value);
}
