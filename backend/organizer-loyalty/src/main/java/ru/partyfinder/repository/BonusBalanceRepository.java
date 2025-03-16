package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import ru.partyfinder.entity.BonusBalanceEntity;

import java.util.Optional;
import java.util.UUID;

public interface BonusBalanceRepository extends JpaRepository<BonusBalanceEntity, Long> {

    @Modifying
    @Query("""
            update BonusBalanceEntity bonusBalanceEntity
            set bonusBalanceEntity.bonusAmount = bonusBalanceEntity.bonusAmount + :amount
            where bonusBalanceEntity.participantUsername = :participantUsername and bonusBalanceEntity.organizerUUID = :organizerUUID
            """)
    int addBonuses(String participantUsername, UUID organizerUUID, Integer amount);

    @Modifying
    @Query("""
            update BonusBalanceEntity bonusBalanceEntity
            set bonusBalanceEntity.bonusAmount = bonusBalanceEntity.bonusAmount - :amount
            where bonusBalanceEntity.participantUsername = :participantUsername and bonusBalanceEntity.organizerUUID = :organizerUUID
            """)
    int removeBonuses(String participantUsername, UUID organizerUUID, Integer amount);

    Optional<BonusBalanceEntity> findByParticipantUsernameAndOrganizerUUID(String username, UUID organizerUUID);
}
