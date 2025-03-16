package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.PrizeHistoryEntity;
import ru.partyfinder.repository.PrizeHistoryRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PrizeHistoryService {

    private final PrizeHistoryRepository prizeHistoryRepository;

    public PrizeHistoryEntity save(PrizeHistoryEntity prizeHistoryEntity) {
        return prizeHistoryRepository.save(prizeHistoryEntity);
    }

    public List<PrizeHistoryEntity> findAllUndeliveredByOrganizerUuid(UUID uuid) {
        return prizeHistoryRepository.findAllUndeliveredByOrganizerUuid(uuid);
    }

    public int deliver(UUID organizer, String username, UUID prizeUuid) {
        return prizeHistoryRepository.deliverPrize(organizer, username, prizeUuid);
    }
}
