package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ru.partyfinder.entity.EventEntity;
import ru.partyfinder.model.dto.EventFilterDTO;
import ru.partyfinder.service.EventService;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@AllArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/events/filter")
public class EventFilterController {

    private EventService eventService;

    @GetMapping("/")
    public Page<EventEntity> filterEvents(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) LocalDateTime startDate,
            @RequestParam(required = false) LocalDateTime endDate,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            Pageable pageable) {

        EventFilterDTO filterDTO = new EventFilterDTO();
        filterDTO.setTitle(title);
        filterDTO.setDescription(description);
        filterDTO.setStartDate(startDate);
        filterDTO.setEndDate(endDate);
        filterDTO.setAddress(address);
        filterDTO.setStatus(status);
        filterDTO.setMinPrice(minPrice);
        filterDTO.setMaxPrice(maxPrice);
        filterDTO.setMinCapacity(minCapacity);
        filterDTO.setMaxCapacity(maxCapacity);
        filterDTO.setMinAge(minAge);
        filterDTO.setMaxAge(maxAge);

        return eventService.filterEvents(filterDTO, pageable);
    }
}