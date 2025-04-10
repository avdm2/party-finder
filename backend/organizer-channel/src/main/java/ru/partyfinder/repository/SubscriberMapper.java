package ru.partyfinder.repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import ru.partyfinder.entity.Subscriber;

import java.util.List;
import java.util.UUID;

@Mapper
public interface SubscriberMapper {

    @Insert("INSERT INTO channels.subscribers (id, channel_id, subscriber_id) VALUES (#{id}, #{channelId}, #{subscriberId})")
    void subscribe(Subscriber subscriber);

    @Select("SELECT * FROM channels.subscribers WHERE channel_id = #{channelId}")
    List<Subscriber> findSubscribersByChannel(UUID channelId);
}
