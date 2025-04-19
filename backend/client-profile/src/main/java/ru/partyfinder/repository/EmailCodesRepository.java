package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.EmailCodesEntity;

import java.util.UUID;

@Repository
public interface EmailCodesRepository extends JpaRepository<EmailCodesEntity, UUID> {

    EmailCodesEntity findByUsernameAndCodeIgnoreCase(String username, String code);
}
