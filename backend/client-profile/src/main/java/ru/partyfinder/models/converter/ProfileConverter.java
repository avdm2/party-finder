package ru.partyfinder.models.converter;

import ru.partyfinder.entity.Profile;
import ru.partyfinder.models.dto.ClientDTO;
import ru.partyfinder.models.dto.ProfileDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProfileConverter {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "surname", source = "surname")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "birthDate", source = "birthDate")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "aboutMe", source = "aboutMe")
    Profile toProfile(ClientDTO clientDTO);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "surname", source = "surname")
    @Mapping(target = "username", source = "username")
    @Mapping(target = "birthDate", source = "birthDate")
    @Mapping(target = "email", source = "email")
    @Mapping(target = "phone", source = "phone")
    @Mapping(target = "aboutMe", source = "aboutMe")
    @Mapping(target = "media", source = "media")
    @Mapping(target = "isConfirmed", source = "isConfirmed")
    @Mapping(target = "createdTime", source = "createdTime")
    @Mapping(target = "updatedTime", source = "updatedTime")
    ProfileDTO toProfileDTO(Profile profile);
}
