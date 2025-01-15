package ru.partyfinder.event.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.event.models.dto.converter.EventConverter;
import ru.partyfinder.event.models.dto.EventDTO;
import ru.partyfinder.event.repository.EventRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventConverter eventConverter;
    private final EventRepository eventRepository;

    public UUID createEvent(EventDTO eventDTO) {
        return eventRepository.save(eventConverter.toEntity(eventDTO)).getId();
    }

    public EventDTO getEvent(UUID id) {
        return eventConverter.toDto(eventRepository.findById(id).orElseThrow());
    }
}
