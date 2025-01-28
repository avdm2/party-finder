package ru.partyfinder.entity.keys;

import jakarta.persistence.Embeddable;
import lombok.*;
import jakarta.persistence.Column;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@EqualsAndHashCode
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class ChannelClientPK implements Serializable {

    @Column(name = "channel_id")
    private Long channelId;

    @Column(name = "client_id")
    private UUID clientId;
}
