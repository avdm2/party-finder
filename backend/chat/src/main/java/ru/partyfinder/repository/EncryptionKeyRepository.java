package ru.partyfinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.partyfinder.entity.EncryptionKey;
import ru.partyfinder.entity.Profile;

import java.util.UUID;

@Repository
public interface EncryptionKeyRepository extends JpaRepository<EncryptionKey, UUID> {
    EncryptionKey findBySenderAndReceiver(Profile sender, Profile receiver);
}