package ru.partyfinder.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import ru.partyfinder.model.dto.ChatDTO;
import ru.partyfinder.entity.Chat;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ChatParticipantMapper.class, MessageMapper.class})
public interface ChatMapper {
    ChatMapper INSTANCE = Mappers.getMapper(ChatMapper.class);

    @Mapping(target = "participants", source = "participants")
    @Mapping(target = "messages", source = "messages")
    ChatDTO toDto(Chat chat);

    List<ChatDTO> toDtoList(List<Chat> chats);
}