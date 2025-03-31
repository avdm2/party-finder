package ru.partyfinder.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.partyfinder.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    Optional<Profile> findByUsername(String username);

    @Query("SELECT p FROM Profile p WHERE LOWER(p.username) LIKE LOWER(:username)")
    Page<Profile> findByUsernameContainingIgnoreCase(@Param("username") String username, Pageable pageable);

    boolean existsByUsername(String username);

}
