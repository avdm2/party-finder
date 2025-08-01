package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.entity.PrizeHistoryEntity;
import ru.partyfinder.service.PrizeHistoryService;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/loyalty/prize/history")
public class PrizeHistoryController {

    private final PrizeHistoryService prizeHistoryService;

    // Получить все призы (для организатора)
    @GetMapping("/list/{organizerUuid}")
    public ResponseEntity<List<PrizeHistoryEntity>> findAllByOrganizerUuid(@PathVariable UUID organizerUuid) {
        return ResponseEntity.ok(prizeHistoryService.findAllByOrganizerUuid(organizerUuid));
    }

    // Отправить приз (согласиться на выдачу)
    @PostMapping("/deliver")
    public ResponseEntity<Integer> deliver(@RequestParam Integer id) {
        return ResponseEntity.ok(prizeHistoryService.deliver(id));
    }
}
