package ru.partyfinder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "channel_client", schema = "organizer")
public class ChannelProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "channel_id", nullable = false)
    private Long channelId;

    @Column(name = "profile_id", nullable = false)
    private UUID profileId;

    public ChannelProfile(Long channelId, UUID profileId) {
        this.channelId = channelId;
        this.profileId = profileId;
    }

}