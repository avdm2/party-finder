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
import org.springframework.web.multipart.MultipartFile;
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
    public ResponseEntity<PrizeEntity> add(
            @RequestBody PrizeEntity prizeEntity,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(prizeService.add(prizeEntity.withFileData(file.getBytes())));
    }

    // Отредактировать приз (для организатора)
    @PostMapping("/modify")
    @SneakyThrows
    public ResponseEntity<PrizeEntity> modify(
            @RequestBody PrizeEntity prizeEntity,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        return ResponseEntity.ok(prizeService.modify(prizeEntity.withFileData(file.getBytes())));
    }

    // Просмотреть приз
    @GetMapping("/items/{prizeUuid}")
    public ResponseEntity<PrizeEntity> get(@PathVariable UUID prizeUuid) {
        return ResponseEntity.ok(prizeService.get(prizeUuid));
    }

    // Просмотреть все призы
    @GetMapping("/items/{organizerUuid}")
    public ResponseEntity<List<PrizeEntity>> getAll(@PathVariable UUID organizerUuid) {
        return ResponseEntity.ok(prizeService.getAll(organizerUuid));
    }

    // Заказать приз для отправки (для клиента)
    @GetMapping("/order/{prizeUuid}")
    public ResponseEntity<PrizeEntity> order(@PathVariable UUID prizeUuid, @RequestParam String username) {
        return ResponseEntity.ok(prizeService.order(prizeUuid, username));
    }
}
