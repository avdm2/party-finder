package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.config.kafka.ConfirmationCodeRequest;
import ru.partyfinder.config.kafka.ConfirmationRequest;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.service.EmailService;
import ru.partyfinder.service.KafkaProducerService;
import ru.partyfinder.service.ProfileService;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/client-service/email")
public class EmailController {

    private KafkaProducerService kafkaProducerService;
    private ProfileService profileService;
    private EmailService emailService;

    @PostMapping("/send-confirmation-request-user")
    public ResponseEntity<String> sendConfirmationRequest() {
        try {
            String username = UserContextHolder.getContext().getUsername();
            Profile profile = profileService.getProfileByUsername(username);

            ConfirmationRequest confirmationRequest = new ConfirmationRequest();
            confirmationRequest.setUsername(username);
            confirmationRequest.setEmail(profile.getEmail());

            log.info("Для Username " + username + " отправлено сообщение");

            kafkaProducerService.sendMessage(confirmationRequest);

            return ResponseEntity.ok("Запрос на подтверждение отправлен.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Ошибка при отправке запроса на подтверждение: " + e.getMessage());
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<String> confirmProfile(@RequestBody ConfirmationCodeRequest confirmationCodeRequest) {
        log.info(confirmationCodeRequest.getCode());
        return ResponseEntity.ok(emailService.confirmProfile(confirmationCodeRequest));
    }

}
