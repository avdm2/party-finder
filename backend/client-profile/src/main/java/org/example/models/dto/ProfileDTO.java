package org.example.models.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDTO {

    private UUID id;

    private String name;

    private String surname;

    private LocalDate birth_date;

    private Boolean is_confirmed;

    private Instant created_time;

    private Instant updated_time;

}
