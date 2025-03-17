package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.entity.BonusBalanceEntity;
import ru.partyfinder.entity.PromocodeEntity;
import ru.partyfinder.service.PromocodeService;

@RequestMapping("/api/v1/loyalty/promocode")
@RestController
@RequiredArgsConstructor
public class PromocodeController {

    private final PromocodeService promocodeService;

    // Добавить промокод (для организатора)
    @PostMapping("/add")
    public ResponseEntity<PromocodeEntity> addPromocode(@RequestBody PromocodeEntity promocodeEntity) {
        return ResponseEntity.ok(promocodeService.addPromocode(promocodeEntity));
    }

    // Применить промокод (для клиента)
    @GetMapping("/redeem/{promocode}")
    public ResponseEntity<BonusBalanceEntity> redeemPromocode(@RequestParam String username, @PathVariable String promocode) {
        return ResponseEntity.ok(promocodeService.redeemPromocode(username, promocode));
    }
}
