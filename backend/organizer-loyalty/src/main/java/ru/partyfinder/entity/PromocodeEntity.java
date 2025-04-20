package ru.partyfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.With;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "promocodes", schema = "loyalty")
@With
@AllArgsConstructor
@NoArgsConstructor
public class PromocodeEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_uuid")
    private UUID ownerUUID;

    @Column(name = "bonus_amount")
    private Integer bonusAmount;

    @Column(name = "number_of_usage")
    private Integer numberOfUsage;

    @Column(name = "initial_number_of_usage")
    private Integer initialNumberOfUsage;

    @Column(name = "value", unique = true)
    private String value;

    @Column(name = "is_active")
    private Boolean isActive;
}
