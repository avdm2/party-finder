package ru.partyfinder.specification;

import org.springframework.data.jpa.domain.Specification;
import ru.partyfinder.entity.EventEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventSpecification {

    public static Specification<EventEntity> byTitleContains(String title) {
        return (root, query, criteriaBuilder) ->
                title == null ? null : criteriaBuilder.like(root.get("title"), "%" + title + "%");
    }

    public static Specification<EventEntity> byDescriptionContains(String description) {
        return (root, query, criteriaBuilder) ->
                description == null ? null : criteriaBuilder.like(root.get("description"), "%" + description + "%");
    }

    public static Specification<EventEntity> byDateBetween(LocalDateTime start, LocalDateTime end) {
        return (root, query, criteriaBuilder) -> {
            if (start == null && end == null) return null;
            if (start != null && end != null) {
                return criteriaBuilder.between(root.get("dateOfEvent"), start, end);
            }
            if (start != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("dateOfEvent"), start);
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("dateOfEvent"), end);
        };
    }

    public static Specification<EventEntity> byAddressContains(String address) {
        return (root, query, criteriaBuilder) ->
                address == null ? null : criteriaBuilder.like(root.get("address"), "%" + address + "%");
    }

    public static Specification<EventEntity> byStatusEquals(String status) {
        return (root, query, criteriaBuilder) ->
                status == null ? null : criteriaBuilder.equal(root.get("status"), status);
    }

    public static Specification<EventEntity> byPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null) {
                return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
            }
            if (minPrice != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<EventEntity> byCapacityRange(Integer minCapacity, Integer maxCapacity) {
        return (root, query, criteriaBuilder) -> {
            if (minCapacity == null && maxCapacity == null) return null;
            if (minCapacity != null && maxCapacity != null) {
                return criteriaBuilder.between(root.get("capacity"), minCapacity, maxCapacity);
            }
            if (minCapacity != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("capacity"), minCapacity);
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("capacity"), maxCapacity);
        };
    }

    public static Specification<EventEntity> byAgeRestrictionRange(Integer minAge, Integer maxAge) {
        return (root, query, criteriaBuilder) -> {
            if (minAge == null && maxAge == null) return null;
            if (minAge != null && maxAge != null) {
                return criteriaBuilder.between(root.get("age"), minAge, maxAge);
            }
            if (minAge != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("age"), minAge);
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("age"), maxAge);
        };
    }
}