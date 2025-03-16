package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.BonusBalanceEntity;
import ru.partyfinder.model.exception.IllegalBonusBalance;
import ru.partyfinder.repository.BonusBalanceRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
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

    public BonusBalanceEntity removeBonuses(String username, UUID organizerUUID, Integer amount) {
        if (bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).isEmpty()) {
            throw new IllegalBonusBalance("No loyalty account found for username");
        }

        if (bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).get().getBonusAmount().compareTo(amount) > 0) {
            throw new IllegalBonusBalance("Illegal bonus balance");
        }

        bonusBalanceRepository.removeBonuses(username, organizerUUID, amount);
        return bonusBalanceRepository.findByParticipantUsernameAndOrganizerUUID(username, organizerUUID).get();
    }
}
