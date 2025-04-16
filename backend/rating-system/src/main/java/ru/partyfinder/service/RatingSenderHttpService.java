package ru.partyfinder.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.model.dto.EventDTO;
import ru.partyfinder.model.dto.OrganizerDTO;
import ru.partyfinder.model.dto.ProfileDTO;
import ru.partyfinder.model.dto.PutNewRatingDto;
import ru.partyfinder.model.enums.EntityTypes;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
public class RatingSenderHttpService {

    private final WebClient clientWebClient;

    private final WebClient organizerWebClient;

    private final WebClient eventWebClient;

    private final String token = "SYSTEM_USER";

    public RatingSenderHttpService(@Qualifier("clientWebClient") WebClient clientWebClient,
                                   @Qualifier("organizerWebClient") WebClient organizerWebClient,
                                   @Qualifier("eventWebClient") WebClient eventWebClient) {
        this.clientWebClient = clientWebClient;
        this.organizerWebClient = organizerWebClient;
        this.eventWebClient = eventWebClient;
    }


    public BigDecimal getRating(UUID id, EntityTypes entityType) {
        String token = UserContextHolder.getContext().getToken();
        ProfileDTO profileDTO = null;
        OrganizerDTO organizerDTO = null;
        EventDTO eventDTO = null;
        switch (entityType.name()) {
            case "PARTICIPANT" -> profileDTO = clientWebClient.get().uri("/by-id/" + id)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(ProfileDTO.class).block();
            case "ORGANIZER" -> organizerDTO = organizerWebClient.get().uri("/id/" + id)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(OrganizerDTO.class).block();
            case "EVENT" -> eventDTO = eventWebClient.get().uri("/id/" + id)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(EventDTO.class).block();
            default -> throw new RuntimeException("Не нашлось варианта дял поиска рейтинга");
        };
        if (profileDTO != null) {
            return profileDTO.getRating();
        }
        if (organizerDTO != null) {
            return organizerDTO.getRating();
        }
        return eventDTO.getRating();
    }

    public void putRating(PutNewRatingDto putNewRatingDto) {
        log.info(putNewRatingDto.toString());
        log.info(token);
        switch (putNewRatingDto.getEntityType()) {
            case "PARTICIPANT" -> clientWebClient.post().uri("/putNewRating")
                    .bodyValue(putNewRatingDto)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .toBodilessEntity().block();
            case "ORGANIZER" -> organizerWebClient.post().uri("/putNewRating")
                    .bodyValue(putNewRatingDto)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .toBodilessEntity().block();
            case "EVENT" -> eventWebClient.post().uri("/putNewRating")
                    .bodyValue(putNewRatingDto)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .toBodilessEntity().block();
            default -> throw new RuntimeException("Не нашлось варианта для поиска сущности для проставки рейтинга");
        }
    }

        public boolean isEntityExist(UUID id, String entityType) {
        ProfileDTO profileDTO = null;
        OrganizerDTO organizerDTO = null;
        EventDTO eventDTO = null;
        String token = UserContextHolder.getContext().getToken();
        switch (entityType) {
            case "PARTICIPANT" -> profileDTO =  clientWebClient.get().uri("/by-id/" + id)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(ProfileDTO.class).block();
            case "ORGANIZER" -> organizerDTO = organizerWebClient.get().uri("/id/" + id)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(OrganizerDTO.class).block();
            case "EVENT" -> eventDTO = eventWebClient.get().uri("/id/" + id)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(EventDTO.class).block();
            default -> throw new RuntimeException("Не нашлось варианта для поиска сущности для проставки рейтинга");
        }
        return profileDTO != null || organizerDTO != null || eventDTO != null;
    }

    public UUID getEntityIdRequest(String username, String entityType) {
        ProfileDTO profileDTO = null;
        OrganizerDTO organizerDTO = null;
        String token = UserContextHolder.getContext().getToken();
        switch (entityType) {
            case "PARTICIPANT" -> profileDTO = clientWebClient.get().uri("/by-username/" + username)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(ProfileDTO.class).block();
            case "ORGANIZER" -> organizerDTO = organizerWebClient.get().uri("/username/" + username)
                    .header("Authorization", "Bearer " + token)
                    .retrieve()
                    .bodyToMono(OrganizerDTO.class).block();
            default -> throw new RuntimeException("Не нашлось варианта для поиска сущности отправителя рейтинга");
        }
        if (profileDTO != null) {
            return profileDTO.getId();
        }
        return organizerDTO.getId();
    }
}
