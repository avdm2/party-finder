package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.EncryptionKey;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.EncryptionKeyRepository;
import ru.partyfinder.util.EncryptionUtil;

@Service
@AllArgsConstructor
public class EncryptionService {

    private final EncryptionUtil encryptionUtil;
    private final EncryptionKeyRepository encryptionKeyRepository;

    public String encryptMessage(String content, Profile sender, Profile receiver) {
        EncryptionKey key = encryptionKeyRepository.findBySenderAndReceiver(sender, receiver);
        if (key == null) {
            key = generateAndSaveKey(sender, receiver);
        }
        return encryptionUtil.encrypt(content, key.getKey());
    }

    public String decryptMessage(String encryptedContent, Profile sender, Profile receiver) {
        EncryptionKey key = encryptionKeyRepository.findBySenderAndReceiver(sender, receiver);
        if (key == null) {
            throw new IllegalArgumentException("No encryption key found for this pair of users.");
        }
        return encryptionUtil.decrypt(encryptedContent, key.getKey());
    }

    private EncryptionKey generateAndSaveKey(Profile sender, Profile receiver) {
        String key = encryptionUtil.generateKey();
        EncryptionKey encryptionKey = new EncryptionKey();
        encryptionKey.setSender(sender);
        encryptionKey.setReceiver(receiver);
        encryptionKey.setKey(key);
        return encryptionKeyRepository.save(encryptionKey);
    }
}