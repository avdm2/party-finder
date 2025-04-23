package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import ru.partyfinder.entity.EventClientEntity;
import ru.partyfinder.entity.EventEntity;
import ru.partyfinder.models.dto.SubscribeEventDTO;
import ru.partyfinder.repository.EventClientRepository;
import ru.partyfinder.repository.EventRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventClientService {

    private final EventRepository eventRepository;

    private final EventClientRepository eventClientRepository;

    private final ProfileService profileService;


    public List<EventEntity> getEventsSubscribeByUsername(String username) {
        return eventRepository.getAllByUsername(username);
    }

    public void deleteEventSubscribeByClientIdSndEventId(String username, UUID eventId) {
        EventClientEntity eventClientEntity = getEventSubscribeByClientIdSndEventId(username, eventId);
        eventClientRepository.delete(eventClientEntity);
    }

    public EventClientEntity getEventSubscribeByClientIdSndEventId(String username, UUID eventId) {
        return eventClientRepository.findByUsernameAndEventId(username, eventId).orElseThrow(
                () -> new IllegalArgumentException("Такой подписки не существует")
        );
    }

    public UUID subscribeEvent(SubscribeEventDTO subscribeEventDTO) {
        log.info("В сервисе -> " + subscribeEventDTO.getEventId() + " " + subscribeEventDTO.getUsername());
        UUID newUUID = null;
        if (checkEventForExist(subscribeEventDTO.getEventId()) && checkProfileFotExist(subscribeEventDTO.getUsername())) {
            log.info("В if");
            EventClientEntity eventClientEntity = new EventClientEntity();
            eventClientEntity.setEventId(subscribeEventDTO.getEventId());
            eventClientEntity.setUsername(subscribeEventDTO.getUsername());
            log.info(eventClientEntity.toString());
            newUUID = eventClientRepository.save(eventClientEntity).getId();
        }
        if (newUUID == null) {
            throw new IllegalArgumentException("Ошибка во время подписки на мероприятие");
        }
        return newUUID;
    }

    public Boolean isAttend(SubscribeEventDTO subscribeEventDTO) {
        return eventClientRepository.findByUsernameAndEventId(subscribeEventDTO.getUsername(), subscribeEventDTO.getEventId()).isPresent();
    }



    private boolean checkEventForExist(UUID eventId) {
        return eventRepository.existsById(eventId);
    }

    private boolean checkProfileFotExist(String username) {
        return profileService.existByUsername(username);
    }

}
