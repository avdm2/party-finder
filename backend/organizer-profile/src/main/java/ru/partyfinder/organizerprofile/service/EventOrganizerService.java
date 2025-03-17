package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.entity.EventEntity;
import ru.partyfinder.organizerprofile.model.enums.EventStatus;
import ru.partyfinder.organizerprofile.repository.EventRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventOrganizerService {

    private final EventRepository eventRepository;

    public UUID createEvent(EventEntity event) {
        return eventRepository.save(event).getId();
    }

    public EventEntity getEvent(UUID id) {
        return eventRepository.findById(id).orElseThrow();
    }

    public int endEvent(UUID id) {
        return eventRepository.endEvent(id, EventStatus.CANCELLED.getValue());
    }

    public EventEntity updateEvent(UUID id, EventEntity event) {
        eventRepository.updateEvent(id, event);
        return getEvent(id);
    }
}
