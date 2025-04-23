package ru.partyfinder.organizerprofile.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "analytics_data", schema = "organizer")
public class DataEntity {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "event_id")
    private UUID eventId;

    @Column(name = "avg_bill")
    private Integer avgBill;

    @Column(name = "avg_age")
    private Integer avgAge;

    @Column(name = "avg_travel_time_in_minutes")
    private Integer avgTravelTimeInMinutes;

    @Column(name = "rate")
    private Integer rate;

    @Column(name = "people_in_group")
    private Integer peopleInGroup;

    @Column(name = "avg_spent_time_in_minutes")
    private Integer avgSpentTimeInMinutes;
}
