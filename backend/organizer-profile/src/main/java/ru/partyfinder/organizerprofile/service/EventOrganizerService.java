package ru.partyfinder.organizerprofile.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.entity.EventEntity;
import ru.partyfinder.organizerprofile.model.enums.EventStatus;
import ru.partyfinder.organizerprofile.repository.EventRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventOrganizerService {

    private final EventRepository eventRepository;

    public UUID createEvent(EventEntity event) {
        event.setDateOfEvent(event.getDateOfEvent().plusHours(3));
        return eventRepository.save(event).getId();
    }

    public List<EventEntity> getAll(UUID id) {
        return eventRepository.findAll().stream().filter(event -> event.getOrganizerId().equals(id)).collect(Collectors.toList());
    }

    public EventEntity getEvent(UUID id) {
        return eventRepository.findById(id).orElseThrow();
    }

    public int endEvent(UUID id) {
        return eventRepository.updStatus(id, EventStatus.CANCELLED.getValue());
    }

    public int completeEvent(UUID id) {
        return eventRepository.updStatus(id, EventStatus.COMPLETED.getValue());
    }

    public EventEntity updateEvent(UUID id, EventEntity event) {
        eventRepository.updateEvent(id, event.getAddress(), event.getAge(), event.getCapacity(),
                event.getDateOfEvent().plusHours(3), event.getDescription(), event.getPrice(), event.getStatus(), event.getTitle());
        return getEvent(id);
    }
}
