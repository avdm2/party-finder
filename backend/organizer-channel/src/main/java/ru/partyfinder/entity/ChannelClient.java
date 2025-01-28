package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.partyfinder.entity.keys.ChannelClientPK;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "channel_client", schema = "organizer")
public class ChannelClient {
    @EmbeddedId
    private ChannelClientPK id;

    @ManyToOne
    @MapsId("channelId")
    @JoinColumn(name = "channel_id", nullable = false)
    private Channel channel;

    @ManyToOne
    @MapsId("clientId")
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}
