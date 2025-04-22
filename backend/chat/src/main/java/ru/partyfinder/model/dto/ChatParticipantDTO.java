package ru.partyfinder.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ChatParticipantDTO {
    private UUID id;
    private UUID chatId;
    private ProfileDTO profile;
}
