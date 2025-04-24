package ru.partyfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "participant_username")
    private String participantUsername;

    @Column(name = "organizer_uuid")
    private UUID organizerUuid;

    @Column(name = "prize_uuid")
    private UUID prizeUuid;

    @Column(name = "prize_title")
    private String prizeTitle;

    @Column(name = "delivered")
    private Boolean delivered;

    @Column(name = "delivered_timestamp")
    private LocalDateTime deliveredTimestamp;

    @Column(name = "order_timestamp")
    private LocalDateTime orderTimestamp;

}
