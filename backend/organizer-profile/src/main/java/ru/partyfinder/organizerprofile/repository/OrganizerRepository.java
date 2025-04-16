package ru.partyfinder.organizerprofile.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;

import java.util.Optional;
import java.util.UUID;

public interface OrganizerRepository extends JpaRepository<OrganizerEntity, UUID> {

    Optional<OrganizerEntity> findByUsername(String username);
    @Query("SELECT p FROM OrganizerEntity p WHERE LOWER(p.username) LIKE LOWER(:username)")
    Page<OrganizerEntity> findByUsernameContainingIgnoreCase(@Param("username") String username, Pageable pageable);

}
