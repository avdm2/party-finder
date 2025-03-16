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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "bonus_balance", schema = "loyalty")
public class BonusBalanceEntity {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "participant_username")
    private String participantUsername;

    @Column(name = "organizer_uuid")
    private UUID organizerUUID;

    @Column(name = "bonus_amount")
    private Integer bonusAmount;
}
