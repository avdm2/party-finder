package ru.partyfinder.model.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import ru.partyfinder.model.dto.MessageDTO;
import ru.partyfinder.entity.Message;

import java.util.List;

@Mapper(uses = ProfileMapper.class,componentModel = "spring")
public interface MessageMapper {
    MessageMapper INSTANCE = Mappers.getMapper(MessageMapper.class);

    @Mapping(target = "chatId", source = "chat.id")
    @Mapping(target = "sender", source = "sender")
    @Mapping(target = "receiver", source = "receiver")
    MessageDTO toDto(Message message);

    List<MessageDTO> toDtoList(List<Message> messages);
}
