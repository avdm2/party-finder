package ru.partyfinder.config.kafka;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import ru.partyfinder.model.entity.EmailCodesEntity;
import ru.partyfinder.repository.EmailCodesRepository;
import ru.partyfinder.service.CodeGenerator;
import ru.partyfinder.service.EmailService;

@Slf4j
@Component
@AllArgsConstructor
public class KafkaConsumer {

    private EmailService emailService;
    private EmailCodesRepository emailCodesRepository;


    @KafkaListener(topics = "email-message", groupId = "my-group")
    public void listen(ConfirmationRequest emailMessage) {
        String emailReceiver = emailMessage.getEmail();
        String subject = "Email Confiramtion";
        String code = CodeGenerator.generateConfirmationCode();
        EmailCodesEntity emailCodes = new EmailCodesEntity();
        emailCodes.setEmail(emailReceiver);
        emailCodes.setCode(code);
        emailCodes.setUsername(emailMessage.getUsername());
        log.info(emailMessage.toString());
        try {
            log.info("УСТАНАВЛИВАЕМ -> " + emailMessage.getUsername() + " " + code);
            EmailCodesEntity emailCodes1 = emailCodesRepository.findByUsernameAndCodeIgnoreCase(emailMessage.getUsername(), code);
            if (emailCodes1 == null) {
                emailCodesRepository.save(emailCodes);
            } else {
                emailCodes.setId(emailCodes1.getId());
                emailCodesRepository.save(emailCodes);
            }
            emailService.sendSimpleMessage(emailReceiver, subject, code);
            System.out.println("Received message: " + emailMessage);
        } catch (Exception e ) {
            e.printStackTrace();
            emailCodesRepository.delete(emailCodes);
            throw new RuntimeException("Не получилось отправить код на почту");
        }

    }
}
