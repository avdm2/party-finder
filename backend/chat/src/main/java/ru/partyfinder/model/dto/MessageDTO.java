package ru.partyfinder.model.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
public class MessageDTO {
    private UUID id;
    private UUID chatId;
    private String senderUsername;
    private String receiverUsername;
    private ProfileDTO sender;
    private ProfileDTO receiver;
    private String content;
    private String encryptedContent;
    private Instant sentTime;
    private Long tempId;
}