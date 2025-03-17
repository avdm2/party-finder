package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.entity.BonusBalanceEntity;
import ru.partyfinder.service.BonusBalanceService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/loyalty/balance")
@RequiredArgsConstructor
public class BonusBalanceController {

    private final BonusBalanceService bonusBalanceService;

    // Получить бонусный баланс у организатора (для клиента)
    @GetMapping("/{organizerUUID}")
    public ResponseEntity<BonusBalanceEntity> getBonusBalance(@PathVariable UUID organizerUUID, @RequestParam String username) {
        return ResponseEntity.ok(bonusBalanceService.getBonusBalance(username, organizerUUID));
    }
}
