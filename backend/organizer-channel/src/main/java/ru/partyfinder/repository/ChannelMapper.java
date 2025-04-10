package ru.partyfinder.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import ru.partyfinder.entity.Channel;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ChannelMapper {

    @Insert("INSERT INTO channels.channels (id, name, owner_username) VALUES (#{id}, #{name}. #{ownerUsername})")
    void createChannel(Channel channel);

    @Select("SELECT * FROM channels.channels WHERE owner_username = #{ownerUsername}")
    Channel findByOwnerUsername(String ownerUsername);

    @Select("""
            select c.id, c.name, c.owner_username
            from channels.channels c
            left join channels.subscribers s on s.channel_id = c.id where s.cid = #{cid}
            """)
    List<Channel> findAllForSubscriber(UUID subscriberId);
}
