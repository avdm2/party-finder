package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.entity.PrizeEntity;
import ru.partyfinder.service.PrizeService;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/loyalty/prize")
public class PrizeController {

    private final PrizeService prizeService;

    // Добавить приз (для организатора)
    @SneakyThrows
    @PostMapping("/add")
    public ResponseEntity<PrizeEntity> add(@RequestBody PrizeEntity prizeEntity) {
        return ResponseEntity.ok(prizeService.add(prizeEntity));
    }

    // Переключить показ приза (для организатора)
    @PostMapping("/changeVision/{prizeUuid}")
    @SneakyThrows
    public ResponseEntity<PrizeEntity> turnOff(@PathVariable UUID prizeUuid, @RequestParam Boolean vision) {
        return ResponseEntity.ok(prizeService.modify(prizeService.get(prizeUuid).withNeedToShow(vision)));
    }

    // Просмотреть все призы
    @GetMapping("/items/{organizerUuid}")
    public ResponseEntity<List<PrizeEntity>> getAll(@PathVariable UUID organizerUuid, @RequestParam(required = false) Boolean onlyOff) {

        if (onlyOff == null) {
            return ResponseEntity.ok(prizeService.getAll(organizerUuid));
        }

        return ResponseEntity.ok(prizeService.getAll(organizerUuid)
                .stream()
                .filter(prizeEntity -> prizeEntity.getNeedToShow().equals(!onlyOff)).toList());
    }

    // Заказать приз для отправки (для клиента)
    @GetMapping("/order/{prizeUuid}")
    public ResponseEntity<PrizeEntity> order(@PathVariable UUID prizeUuid, @RequestParam String username) {
        return ResponseEntity.ok(prizeService.order(prizeUuid, username));
    }
}
