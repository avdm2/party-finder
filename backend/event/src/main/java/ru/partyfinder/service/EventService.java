package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import ru.partyfinder.model.dto.EventFilterDTO;
import ru.partyfinder.entity.EventEntity;
import ru.partyfinder.model.dto.PutNewRatingDto;
import ru.partyfinder.repository.EventRepository;
import ru.partyfinder.specification.EventSpecification;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class EventService {

    private EventRepository eventRepository;

    public Page<EventEntity> filterEvents(EventFilterDTO filterDTO, Pageable pageable) {
        log.info("Service -> filterDTO -> " + filterDTO.toString());
        Specification<EventEntity> spec = Specification.where(null);

        spec = addOptional(spec, filterDTO.getTitle(), EventSpecification::byTitleContains);
        spec = addOptional(spec, filterDTO.getDescription(), EventSpecification::byDescriptionContains);
        spec = addOptional(spec, filterDTO.getStartDate(), filterDTO.getEndDate(), EventSpecification::byDateBetween);
        spec = addOptional(spec, filterDTO.getAddress(), EventSpecification::byAddressContains);
        spec = addOptional(spec, filterDTO.getStatus(), EventSpecification::byStatusEquals);
        spec = addOptional(spec, filterDTO.getMinPrice(), filterDTO.getMaxPrice(), EventSpecification::byPriceRange);
        spec = addOptional(spec, filterDTO.getMinCapacity(), filterDTO.getMaxCapacity(), EventSpecification::byCapacityRange);
        spec = addOptional(spec, filterDTO.getMinAge(), filterDTO.getMaxAge(), EventSpecification::byAgeRestrictionRange);

        Page<EventEntity> page = eventRepository.findAll(spec, pageable);
        log.info("Service -> ListDTOs -> " + page.get().toList());
        log.info("Service ->  getTotalElements -> " + page.getTotalElements());
        log.info("Service -> getTotalPages -> " + page.getTotalPages());

        return page;
    }

    private <T> Specification<EventEntity> addOptional(Specification<EventEntity> spec, T value, java.util.function.Function<T, Specification<EventEntity>> func) {
        return Optional.ofNullable(value).filter(v -> !v.toString().isEmpty()).map(func).orElse(spec);
    }

    private <T1, T2> Specification<EventEntity> addOptional(Specification<EventEntity> spec, T1 value1, T2 value2, java.util.function.BiFunction<T1, T2, Specification<EventEntity>> func) {
        if ((value1 != null && !value1.toString().isEmpty()) || (value2 != null && !value2.toString().isEmpty())) {
            return spec.and(func.apply(value1, value2));
        }
        return spec;
    }

    public EventEntity getEvent(@PathVariable UUID eventId) {
        return eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Нет такого ивента"));
    }

    public void putNewRating(PutNewRatingDto putNewRatingDto) {
        EventEntity event = eventRepository.findById(putNewRatingDto.getEntityId()).orElseThrow(RuntimeException::new);
        event.setRating(putNewRatingDto.getRating());
        eventRepository.save(event);
    }
}