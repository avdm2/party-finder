package ru.partyfinder.organizerprofile.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.organizerprofile.entity.MediaEntity;

@Repository
public interface MediaRepository extends JpaRepository<MediaEntity, Long> {
}
