package ru.partyfinder.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import ru.partyfinder.entity.Message;

import java.util.List;
import java.util.UUID;

@Mapper
public interface MessageMapper {

    @Insert("INSERT INTO channels.messages (id, channel_id, content) VALUES (#{id}, #{channelId}, #{content})")
    void sendMessage(Message message);

    @Select("SELECT * FROM channels.messages WHERE channel_id = #{channelId} ORDER BY created_at ASC")
    List<Message> findMessagesByChannel(UUID channelId);
}
