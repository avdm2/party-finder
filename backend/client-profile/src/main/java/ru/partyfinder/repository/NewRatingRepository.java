package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.NewRatingEntity;

@Repository
public interface NewRatingRepository extends JpaRepository<NewRatingEntity, Long> {}
