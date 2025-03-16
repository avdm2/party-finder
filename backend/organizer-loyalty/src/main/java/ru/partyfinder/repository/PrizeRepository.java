package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.partyfinder.entity.PrizeEntity;

import java.util.UUID;

public interface PrizeRepository extends JpaRepository<PrizeEntity, UUID> {
}
