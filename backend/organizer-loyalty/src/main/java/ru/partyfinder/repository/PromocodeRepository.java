package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.partyfinder.entity.PromocodeEntity;

import java.util.Optional;

public interface PromocodeRepository extends JpaRepository<PromocodeEntity, Long> {

    Optional<PromocodeEntity> findByValue(String value);

    @Modifying
    @Query("""
            update PromocodeEntity promocodeEntity
            set promocodeEntity.numberOfUsage = promocodeEntity.numberOfUsage - 1
            where promocodeEntity.value = :promocode and promocodeEntity.numberOfUsage != 0
            """)
    int redeemPromocode(String promocode);
}
