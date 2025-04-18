package ru.partyfinder.models.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.partyfinder.entity.Media;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDTO {

    private UUID id;

    private String username;

    private String name;

    private String surname;

    private String email;

    private String phone;

    private String aboutMe;

    private LocalDate birthDate;

    private Media media;

    private BigDecimal rating;

    private Boolean isConfirmed;

    private Instant createdTime;

    private Instant updatedTime;

}
