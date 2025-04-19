package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.partyfinder.config.kafka.ConfirmationRequest;
import ru.partyfinder.entity.Profile;

@Service
@AllArgsConstructor
public class KafkaProducerService {

    private KafkaTemplate<String, ConfirmationRequest> kafkaTemplate;

    public void sendMessage(ConfirmationRequest confirmationRequest) {
        kafkaTemplate.send("email-message", confirmationRequest);
        System.out.println("Sent message to Kafka: " + confirmationRequest);
    }
}
