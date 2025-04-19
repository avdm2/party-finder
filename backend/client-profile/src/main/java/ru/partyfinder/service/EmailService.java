package ru.partyfinder.service;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.config.kafka.ConfirmationCodeRequest;
import ru.partyfinder.repository.EmailCodesRepository;

@Slf4j
@Service
@AllArgsConstructor
public class EmailService {

    private final EmailCodesRepository emailCodesRepository;
    private final ProfileService profileService;

    private boolean validateConfirmationCode(String username, String code) {
        return emailCodesRepository.findByUsernameAndCodeIgnoreCase(username, code) != null;
    }

    public String confirmProfile(ConfirmationCodeRequest confirmationCodeRequest) {
        log.info("ПОДТВЕРЖДЕНИЕ");
        try {
            String username = UserContextHolder.getContext().getUsername();
            log.info(username);
            boolean isValidCode = validateConfirmationCode(username, confirmationCodeRequest.getCode());
            log.info(String.valueOf(isValidCode));
            if (isValidCode) {
                profileService.updateUserProfileToConfirmed(username);
                return "Профиль успешно подтвержден.";
            } else {
                throw new RuntimeException("Неверный код подтверждения.");
            }
        } catch (Exception e) {
            throw  new RuntimeException("Ошибка при подтверждении профиля: " + e.getMessage());
        }
    }

}
