package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.Media;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
}
