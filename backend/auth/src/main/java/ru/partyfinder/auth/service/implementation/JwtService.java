package ru.partyfinder.auth.service.implementation;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${token.jwt.signing-key}")
    private String jwtSigningKey;

    @Value("${token.jwt.duration-minutes}")
    private long tokenDurationMinutes;

    // TODO: controller, service.implementations, configuration
}
