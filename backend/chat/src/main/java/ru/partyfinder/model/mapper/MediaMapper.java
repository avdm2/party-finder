package ru.partyfinder.model.mapper;



import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import ru.partyfinder.model.dto.MediaDTO;
import ru.partyfinder.entity.Media;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface MediaMapper {

    @Mapping(target = "fileData", source = "fileData", qualifiedByName = "byteArrayToBase64")
    MediaDTO toDto(Media media);

    @Mapping(target = "fileData", source = "fileData", qualifiedByName = "base64ToByteArray")
    Media toEntity(MediaDTO mediaDTO);

    @Named("byteArrayToBase64")
    default String byteArrayToBase64(byte[] fileData) {
        return fileData != null ? Base64.getEncoder().encodeToString(fileData) : null;
    }

    @Named("base64ToByteArray")
    default byte[] base64ToByteArray(String fileData) {
        return fileData != null ? Base64.getDecoder().decode(fileData) : null;
    }
}