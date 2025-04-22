package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.PrizeHistoryEntity;
import ru.partyfinder.repository.PrizeHistoryRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrizeHistoryService {

    private final PrizeHistoryRepository prizeHistoryRepository;

    public PrizeHistoryEntity save(PrizeHistoryEntity prizeHistoryEntity) {
        return prizeHistoryRepository.save(prizeHistoryEntity);
    }

    public List<PrizeHistoryEntity> findAllByOrganizerUuid(UUID uuid) {
        return prizeHistoryRepository.findAllByOrganizerUuid(uuid);
    }

    public int deliver(String username, UUID prizeUuid) {
        return prizeHistoryRepository.deliverPrize(username, prizeUuid, LocalDateTime.now());
    }
}
