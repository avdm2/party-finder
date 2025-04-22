package ru.partyfinder.model.mapper;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import ru.partyfinder.model.dto.ChatParticipantDTO;
import ru.partyfinder.entity.ChatParticipant;

@Mapper(uses = ProfileMapper.class,componentModel = "spring")
public interface ChatParticipantMapper {
    ChatParticipantMapper INSTANCE = Mappers.getMapper(ChatParticipantMapper.class);

    @Mapping(target = "chatId", source = "chat.id")
    @Mapping(target = "profile", source = "profile")
    ChatParticipantDTO toDto(ChatParticipant participant);
}