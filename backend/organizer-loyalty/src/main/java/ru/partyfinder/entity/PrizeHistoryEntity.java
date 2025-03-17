package ru.partyfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "prize_history", schema = "loyalty")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrizeHistoryEntity {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "participant_username")
    private String participantUsername;

    @Column(name = "organizer_uuid")
    private UUID organizerUuid;

    @Column(name = "prize_uuid")
    private UUID prizeUuid;

    @Column(name = "delivered")
    private Boolean delivered;

}
