package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.BonusBalanceEntity;
import ru.partyfinder.entity.PromocodeEntity;
import ru.partyfinder.model.exception.IllegalPromocodeException;
import ru.partyfinder.repository.PromocodeRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PromocodeService {

    private final PromocodeRepository promocodeRepository;
    private final BonusBalanceService bonusBalanceService;

    public PromocodeEntity addPromocode(PromocodeEntity promocodeEntity) {
        return promocodeRepository.save(promocodeEntity);
    }

    public PromocodeEntity getByValue(String value) {
        return promocodeRepository.getByValue(value);
    }

    public BonusBalanceEntity redeemPromocode(String participantUsername, String promocode) {
        if (promocodeRepository.findByValue(promocode).isEmpty()
                || promocodeRepository.findByValue(promocode).get().getNumberOfUsage() == 0
                || !promocodeRepository.findByValue(promocode).get().getIsActive()) {
            throw new IllegalPromocodeException("Illegal promocode");
        }

        PromocodeEntity promocodeEntity = promocodeRepository.findByValue(promocode).get();
        promocodeRepository.save(promocodeEntity.withNumberOfUsage(promocodeEntity.getNumberOfUsage() - 1));
        return bonusBalanceService.addBonuses(participantUsername, promocodeEntity.getOwnerUUID(), promocodeEntity.getBonusAmount());
    }

    public List<PromocodeEntity> getAllByOrganizer(UUID id) {
        return promocodeRepository.findAllByOwnerUUID(id);
    }
}
