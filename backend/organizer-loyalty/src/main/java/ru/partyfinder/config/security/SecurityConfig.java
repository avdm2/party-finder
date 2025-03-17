package ru.partyfinder.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(
                                        "/api/v1/loyalty/prize/add",
                                        "/api/v1/loyalty/prize/modify",
                                        "/api/v1/loyalty/promocode/add",
                                        "/api/v1/loyalty/prize/history/**"
                                )
                                .hasRole("ORGANIZER")
                                .requestMatchers(
                                        "/api/v1/loyalty/balance",
                                        "/api/v1/loyalty/prize/order/**",
                                        "/api/v1/loyalty/promocode/redeem/**"
                                )
                                .hasRole("PARTICIPANT")
                                .requestMatchers(
                                        "/api/v1/loyalty/prize/items/**"
                                )
                                .authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(new JwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

