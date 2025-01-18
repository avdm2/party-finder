package org.example.models.converter;

import org.example.entity.Profile;
import org.example.models.dto.ClientDTO;
import org.example.models.dto.ProfileDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface ProfileConverter {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "client.name", source = "name")
    @Mapping(target = "client.surname", source = "surname")
    @Mapping(target = "client.birth_date", source = "birth_date")
    Profile toProfile(ClientDTO clientDTO);

    @Mapping(target = "id")
    @Mapping(target = "name", source = "client.name")
    @Mapping(target = "surname", source = "client.surname")
    @Mapping(target = "birth_date", source = "client.birth_date")
    @Mapping(target = "is_confirmed", source = "is_confirmed")
    @Mapping(target = "created_time", source = "created_time")
    @Mapping(target = "updated_time", source = "updated_time")
    ProfileDTO toProfileDTO(Profile profile);
}
