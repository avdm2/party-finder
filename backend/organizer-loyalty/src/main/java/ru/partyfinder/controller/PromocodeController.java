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

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/loyalty/promocode")
@RestController
@RequiredArgsConstructor
public class PromocodeController {

    private final PromocodeService promocodeService;

    // Добавить промокод (для организатора)
    @PostMapping("/add")
    public ResponseEntity<PromocodeEntity> addPromocode(@RequestBody PromocodeEntity promocodeEntity) {
        return ResponseEntity.ok(promocodeService.addPromocode(promocodeEntity.withInitialNumberOfUsage(promocodeEntity.getNumberOfUsage())));
    }

    @GetMapping("/getAll/{organizerUuid}")
    public ResponseEntity<List<PromocodeEntity>> getPromocodes(@PathVariable("organizerUuid") UUID id,
                                                               @RequestParam(required = false) Boolean onlyOff) {

        if (onlyOff == null) {
            return ResponseEntity.ok(promocodeService.getAllByOrganizer(id));
        }

        return ResponseEntity.ok(promocodeService.getAllByOrganizer(id)
                .stream().filter(promo -> promo.getIsActive().equals(!onlyOff)).toList());
    }

    @PostMapping("/off/{promoValue}")
    public ResponseEntity<PromocodeEntity> off(@PathVariable("promoValue") String promoValue) {

        var modified = promocodeService.getByValue(promoValue).withIsActive(false);
        return ResponseEntity.ok(promocodeService.addPromocode(modified));
    }

    // Применить промокод (для клиента)
    @GetMapping("/redeem/{promocode}")
    public ResponseEntity<BonusBalanceEntity> redeemPromocode(@RequestParam String username, @PathVariable String promocode) {
        return ResponseEntity.ok(promocodeService.redeemPromocode(username, promocode));
    }
}
