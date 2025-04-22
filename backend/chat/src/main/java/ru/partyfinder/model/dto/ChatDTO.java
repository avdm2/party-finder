package ru.partyfinder.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ChatDTO {
    private UUID id;
    private List<ChatParticipantDTO> participants;
    private List<MessageDTO> messages;
}
