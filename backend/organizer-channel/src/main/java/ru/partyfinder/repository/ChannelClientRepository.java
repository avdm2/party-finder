package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.ChannelClient;
import ru.partyfinder.entity.keys.ChannelClientPK;

@Repository
public interface ChannelClientRepository extends JpaRepository<ChannelClient, ChannelClientPK> {


}
