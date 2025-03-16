package ru.partyfinder.auth.messaging.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.partyfinder.auth.messaging.event.CredentialsChangesEvent;
import ru.partyfinder.auth.service.UserService;

@Service
@RequiredArgsConstructor
public class CredentialsChangesConsumer {

    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @SneakyThrows
    @KafkaListener(topics = "${kafka-topics.credentials-changes}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(String payload) {
        CredentialsChangesEvent event = objectMapper.readValue(payload, CredentialsChangesEvent.class);
        userService.updateUserCredentials(event.getUsername(),
                passwordEncoder.encode(event.getPassword()),
                event.getEmail());
    }
}
