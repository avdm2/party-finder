package ru.partyfinder.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.BonusBalanceEntity;
import ru.partyfinder.model.exception.IllegalBonusBalance;
import ru.partyfinder.repository.BonusBalanceRepository;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BonusBalanceService {

    private final BonusBalanceRepository bonusBalanceRepository;

    public BonusBalanceEntity createBonusBalance(BonusBalanceEntity bonusBalanceEntity) {
        return bonusBalanceRepository.save(bonusBalanceEntity);
    }

    public BonusBalanceEntity addBonuses(String username, UUID organizerUUID, Integer amount) {

        if (bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).isEmpty()) {
            return createBonusBalance(BonusBalanceEntity.builder()
                    .participantUsername(username)
                    .organizerUUID(organizerUUID)
                    .bonusAmount(amount)
                    .build());
        } else {
            bonusBalanceRepository.addBonuses(username, organizerUUID, amount);
            return bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).get();
        }
    }

    @Transactional
    public BonusBalanceEntity removeBonuses(String username, UUID organizerUUID, Integer amount) {
        if (bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).isEmpty()) {
            throw new IllegalBonusBalance("No loyalty account found for username");
        }

        Integer bonusBalance = bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).get().getBonusAmount();

        if (bonusBalance < amount) {
            throw new IllegalBonusBalance("Illegal bonus balance");
        }

        bonusBalanceRepository.removeBonuses(username, organizerUUID, amount);
        return bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).get();
    }

    public BonusBalanceEntity getBonusBalance(String username, UUID organizerUUID) {

        Optional<BonusBalanceEntity> optionalBonusBalance = bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID);

        log.info("BonusBalance found for username? = {}", optionalBonusBalance.isPresent());

        return optionalBonusBalance.orElseGet(() -> createBonusBalance(BonusBalanceEntity.builder()
                .participantUsername(username)
                .organizerUUID(organizerUUID)
                .bonusAmount(0)
                .build()));
    }
}
