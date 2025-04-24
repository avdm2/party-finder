package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.PrizeEntity;
import ru.partyfinder.entity.PrizeHistoryEntity;
import ru.partyfinder.repository.PrizeRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrizeService {

    private final BonusBalanceService bonusBalanceService;
    private final PrizeHistoryService prizeHistoryService;
    private final PrizeRepository prizeRepository;

    public List<PrizeEntity> getAll(UUID organizerUuid) {
        return prizeRepository.findAllByOwnerUUID(organizerUuid)
                .stream()
                .filter(prizeEntity -> prizeEntity.getAmount() >= 1)
                .collect(Collectors.toList());
    }

    public PrizeEntity order(UUID prizeUuid, String username) {
        PrizeEntity prizeEntity = prizeRepository.findById(prizeUuid).get();
        bonusBalanceService.removeBonuses(username, prizeEntity.getOwnerUUID(), prizeEntity.getBonusCost());
        prizeHistoryService.save(PrizeHistoryEntity.builder()
                .delivered(false)
                .participantUsername(username)
                .prizeUuid(prizeUuid)
                .organizerUuid(prizeEntity.getOwnerUUID())
                .prizeTitle(prizeEntity.getTitle())
                .orderTimestamp(LocalDateTime.now())
                .build());
        prizeRepository.reduceAmount(prizeUuid);
        return prizeRepository.findById(prizeUuid).get();
    }

    public PrizeEntity modify(PrizeEntity prizeEntity) {
        prizeRepository.save(prizeEntity);
        return prizeRepository.findById(prizeEntity.getId()).get();
    }

    public PrizeEntity get(UUID prizeUuid) {
        return prizeRepository.findById(prizeUuid).get();
    }

    public PrizeEntity add(PrizeEntity prizeEntity) {
        return prizeRepository.save(prizeEntity);
    }
}
