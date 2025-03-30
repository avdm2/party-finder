package ru.partyfinder.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class EventFilterDTO {
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String address;
    private String status;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer minCapacity;
    private Integer maxCapacity;
    private Integer minAge;
    private Integer maxAge;

    @Override
    public String toString() {
        return "EventFilterDTO{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", address='" + address + '\'' +
                ", status='" + status + '\'' +
                ", minPrice=" + minPrice +
                ", maxPrice=" + maxPrice +
                ", minCapacity=" + minCapacity +
                ", maxCapacity=" + maxCapacity +
                ", minAge=" + minAge +
                ", maxAge=" + maxAge +
                '}';
    }
}