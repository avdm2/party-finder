package ru.partyfinder.organizerprofile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.organizerprofile.entity.DataEntity;

import java.util.List;
import java.util.UUID;

public interface DataRepository extends JpaRepository<DataEntity, UUID> {

    List<DataEntity> findAllByEventId(UUID eventId);
}
