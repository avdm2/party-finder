package ru.partyfinder.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "promocodes", schema = "loyalty")
public class PromocodeEntity {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "owner_uuid")
    private UUID ownerUUID;

    @Column(name = "bonus_amount")
    private Integer bonusAmount;

    @Column(name = "number_of_usage")
    private Integer numberOfUsage;

    @Column(name = "value")
    private String value;
}
