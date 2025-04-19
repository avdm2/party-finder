package ru.partyfinder.config.kafka;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
@AllArgsConstructor
public class KafkaTopicManager {


    private AdminClient adminClient;

    private static final String TOPIC_NAME = "email-message";
    private static final int NUM_PARTITIONS = 1;
    private static final short REPLICATION_FACTOR = 1;

    @PostConstruct
    public void createTopic() {
        NewTopic topic = new NewTopic(TOPIC_NAME, NUM_PARTITIONS, REPLICATION_FACTOR);

        CreateTopicsResult result = adminClient.createTopics(Collections.singletonList(topic));

        try {
            result.all().get();
            log.info("Topic {} created successfully", TOPIC_NAME);
        } catch (InterruptedException | ExecutionException e) {
            log.error("Failed to create topic {}", TOPIC_NAME, e);
        }
    }
}