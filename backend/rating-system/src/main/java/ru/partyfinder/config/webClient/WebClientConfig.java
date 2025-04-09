package ru.partyfinder.config.webClient;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Qualifier("clientWebClient")
    @Bean
    public WebClient clientWebClient() {
        return WebClient.builder()
                .baseUrl("https://localhost:8724/api/v1/client-service/profile")
                .build();
    }

    @Qualifier("organizerWebClient")
    @Bean
    public WebClient organizerWebClient() {
        return WebClient.builder()
                .baseUrl("https://localhost:8722/api/v1/organizer")
                .build();
    }

    @Qualifier("eventWebClient")
    @Bean
    public WebClient eventWebClient() {
        return WebClient.builder()
                .baseUrl("https://localhost:8723/api/v1/event")
                .build();
    }
}
