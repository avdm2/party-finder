package ru.partyfinder.organizerprofile.entity;

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
@Table(name = "rating", schema = "organizer")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RatingEntity {

    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "organizer_id")
    private UUID organizerId;

    @Column(name = "rating")
    private Integer rating;
}
