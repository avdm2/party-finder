package ru.partyfinder.auth.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.partyfinder.auth.entity.User;
import ru.partyfinder.auth.models.dto.request.LoginRequest;
import ru.partyfinder.auth.models.dto.request.RegisterRequest;
import ru.partyfinder.auth.models.dto.response.LoginResponse;
import ru.partyfinder.auth.models.dto.response.RegisterResponse;
import ru.partyfinder.auth.repository.UserRepository;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final static String ADMIN_EMAIL = "nikitabysko123@gmail.com";
    private final static String REGISTRATION_COMPLETION_MESSAGE = "Регистрация завершена успешно.";
    private final static String USER_NOT_FOUND = "Пользователь с таким логином не найден.";
    private final static String USER_ALREADY_EXISTS = "Пользователь с таким логином уже существует.";

    private final static String USER_EMAIL_ALREADY_EXISTS = "Пользователь с такой почтой уже существует";
    private final static String REQUIRED_FIELDS_ARE_EMPTY = "Проверьте заполненность всех полей";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException(USER_ALREADY_EXISTS);
        }

        if (request.getEmail().equals(ADMIN_EMAIL) || userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException(USER_EMAIL_ALREADY_EXISTS);
        }

        validateFields(request);
        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .roles(new HashSet<>())
                .build();
        user.getRoles().add(request.getRole().getValue());
        userRepository.save(user);
        return RegisterResponse.builder().message(REGISTRATION_COMPLETION_MESSAGE).build();
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));
        return LoginResponse.builder().token(jwtService.generateToken(user)).build();
    }

    private void validateFields(RegisterRequest request) {
        if (ObjectUtils.anyNull(
                request.getEmail(),
                request.getPassword(),
                request.getFirstname(),
                request.getLastname(),
                request.getUsername(),
                request.getRole().getValue()
        )) {
            throw new IllegalArgumentException(REQUIRED_FIELDS_ARE_EMPTY);
        }
    }
}
