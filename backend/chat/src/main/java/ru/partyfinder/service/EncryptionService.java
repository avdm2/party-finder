package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.EncryptionKey;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.EncryptionKeyRepository;
import ru.partyfinder.util.AESEncryptionUtil;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Service
@AllArgsConstructor
public class EncryptionService {

    private final EncryptionKeyRepository encryptionKeyRepository;
    private final AESEncryptionUtil encryptionUtil;

    public String encryptMessage(String content, Profile sender, Profile receiver) {
        try {
            EncryptionKey key = getOrCreateKey(sender, receiver);
            SecretKey secretKey = new SecretKeySpec(
                    Base64.getDecoder().decode(key.getKey()),
                    "AES"
            );
            return encryptionUtil.encrypt(content, secretKey);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt message", e);
        }
    }

    public String decryptMessage(String encryptedContent, Profile sender, Profile receiver) {
        try {
            EncryptionKey key = encryptionKeyRepository
                    .findBySenderAndReceiver(sender, receiver)
                    .orElseThrow(() -> new RuntimeException("Encryption key not found"));

            SecretKey secretKey = new SecretKeySpec(
                    Base64.getDecoder().decode(key.getKey()),
                    "AES"
            );
            return encryptionUtil.decrypt(encryptedContent, secretKey);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt message", e);
        }
    }

    private EncryptionKey getOrCreateKey(Profile sender, Profile receiver) {
        return encryptionKeyRepository
                .findBySenderAndReceiver(sender, receiver)
                .orElseGet(() -> {
                    try {
                        return createNewKey(sender, receiver);
                    } catch (NoSuchAlgorithmException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private EncryptionKey createNewKey(Profile sender, Profile receiver) throws NoSuchAlgorithmException {
        String key = Base64.getEncoder().encodeToString(
                encryptionUtil.generateKey().getEncoded()
        );

        EncryptionKey encryptionKey = new EncryptionKey();
        encryptionKey.setSender(sender);
        encryptionKey.setReceiver(receiver);
        encryptionKey.setKey(key);

        return encryptionKeyRepository.save(encryptionKey);
    }
}