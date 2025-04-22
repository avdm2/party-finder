package ru.partyfinder.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ru.partyfinder.model.dto.ProfileDTO;
import ru.partyfinder.entity.Profile;

@Mapper(componentModel = "spring", uses = MediaMapper.class)
public interface ProfileMapper {
    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);

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
    ProfileDTO toDto(Profile profile);
}