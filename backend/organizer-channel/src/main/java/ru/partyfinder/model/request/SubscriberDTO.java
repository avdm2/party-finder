package ru.partyfinder.model.request;

import lombok.Data;
import java.util.UUID;

@Data
public class SubscriberDTO {
    private UUID channelId;

    private String subscriberUsername;
}
