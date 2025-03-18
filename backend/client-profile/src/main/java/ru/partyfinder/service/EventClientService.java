package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.EventClientEntity;
import ru.partyfinder.models.dto.SubscribeEventDTO;
import ru.partyfinder.repository.EventClientRepository;
import ru.partyfinder.repository.EventRepository;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventClientService {

    private final EventRepository eventRepository;

    private final EventClientRepository eventClientRepository;

    private final ProfileService profileService;


    /*public List<EventClientEntity> getEventsSubscribeByClientId(UUID id) {
        return eventClientRepository.getAllByClientId(id);
    }*/

    public void deleteEventSubscribeByClientIdSndEventId(UUID clientId, UUID eventId) {
        EventClientEntity eventClientEntity = getEventSubscribeByClientIdSndEventId(clientId, eventId);
        eventClientRepository.delete(eventClientEntity);
    }

    public EventClientEntity getEventSubscribeByClientIdSndEventId(UUID clientId, UUID eventId) {
        return eventClientRepository.findByClientIdAndEventId(clientId, eventId).orElseThrow(
                () -> new IllegalArgumentException("Такой подписки не существует")
        );
    }

    public UUID subscribeEvent(SubscribeEventDTO subscribeEventDTO) {
        UUID newUUID = null;
        if (checkEventForExist(subscribeEventDTO.getEventId()) && checkProfileFotExist(subscribeEventDTO.getUsername())) {       // TODO  + запрос к другому модулю для узнавания есть ли профиль клиента
            EventClientEntity eventClientEntity = new EventClientEntity();
            eventClientEntity.setEventId(subscribeEventDTO.getEventId());
            eventClientEntity.setUsername(subscribeEventDTO.getUsername());
            newUUID = eventClientRepository.save(eventClientEntity).getId();
        }
        if (newUUID == null) {
            throw new IllegalArgumentException("Ошибка во время подписки на мероприятие");
        }
        return newUUID;
    }


    private boolean checkEventForExist(UUID eventId) {
        return eventRepository.existsById(eventId);
    }

    private boolean checkProfileFotExist(String username) {
        return profileService.existByUsername(username);
    }

}
