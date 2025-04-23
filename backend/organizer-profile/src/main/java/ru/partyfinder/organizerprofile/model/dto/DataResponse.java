package ru.partyfinder.organizerprofile.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;

import java.util.UUID;

@Data
@With
@AllArgsConstructor
@NoArgsConstructor
public class DataResponse {

    private UUID eventId;
    private Double avgBill;
    private Double avgAge;
    private Double avgTravelTimeInMinutes;
    private Double rate;
    private Double peopleInGroup;
    private Double avgSpentTimeInMinutes;
}
