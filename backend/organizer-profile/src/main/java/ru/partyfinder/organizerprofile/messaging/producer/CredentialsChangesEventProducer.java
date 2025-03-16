package ru.partyfinder.organizerprofile.messaging.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import ru.partyfinder.organizerprofile.messaging.event.CredentialsChangesEvent;

@Service
@RequiredArgsConstructor
@Slf4j
public class CredentialsChangesEventProducer {

    @Value("${kafka.topics.credentials-changes}")
    private String topic;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @SneakyThrows
    public void produce(CredentialsChangesEvent payload) {
        String message = objectMapper.writeValueAsString(payload);
        kafkaTemplate.send(topic, message);
        log.info("CredentialsChangesEventProducer::produce {}", message);
    }
}
