package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.entity.PrizeEntity;
import ru.partyfinder.service.PrizeService;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/loyalty/prize")
public class PrizeController {

    // todo

    private final PrizeService prizeService;

    @PostMapping("/add")
    public ResponseEntity<PrizeEntity> add(@RequestBody PrizeEntity prizeEntity) {

    }

    @GetMapping("/get/{uuid}")
    public ResponseEntity<PrizeEntity> get(@PathVariable UUID uuid) {

    }

    @PostMapping("/deliver")
    public ResponseEntity<Void> deliver(@RequestBody PrizeEntity prizeEntity) {

    }
}
