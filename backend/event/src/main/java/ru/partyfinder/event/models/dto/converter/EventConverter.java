package ru.partyfinder.event.models.dto.converter;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import ru.partyfinder.event.models.dto.EventDTO;
import ru.partyfinder.event.entity.EventEntity;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface EventConverter {

    EventDTO toDto(EventEntity event);
    EventEntity toEntity(EventDTO dto);
}
