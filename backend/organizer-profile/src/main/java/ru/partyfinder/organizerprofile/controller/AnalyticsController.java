package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.organizerprofile.entity.DataEntity;
import ru.partyfinder.organizerprofile.model.dto.DataResponse;
import ru.partyfinder.organizerprofile.service.DataService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizers/analytics")
@RequiredArgsConstructor
@Slf4j
public class AnalyticsController {

    private final DataService dataService;

    @PostMapping("/add-data")
    public ResponseEntity<DataEntity> addData(@RequestBody DataEntity data) {
        return ResponseEntity.ok(dataService.save(data));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<DataResponse> getData(@PathVariable UUID eventId) {
        return ResponseEntity.ok(dataService.getAvg(eventId));
    }

    @GetMapping("/rating/{eventId}")
    public ResponseEntity<Double> getRating(@PathVariable UUID eventId) {
        return ResponseEntity.ok(dataService.getAvg(eventId).getRate());
    }

    @GetMapping("/data/all/{eventId}")
    public ResponseEntity<List<DataEntity>> getAllData(@PathVariable UUID eventId) {
        return ResponseEntity.ok(dataService.getAllByEventId(eventId));
    }
}
