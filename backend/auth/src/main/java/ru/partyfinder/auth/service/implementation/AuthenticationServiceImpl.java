package ru.partyfinder.auth.service.implementation;

import lombok.RequiredArgsConstructor;
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
import ru.partyfinder.auth.service.AuthenticationService;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()
                && userRepository.findByUsername(request.getUsername())
                .get().getRoles().contains(request.getRole().getValue())) {
            throw new IllegalArgumentException(USER_ALREADY_EXISTS);
        }

        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        user.getRoles().add(request.getRole().getValue());
        userRepository.save(user);
        return RegisterResponse.builder().message(REGISTRATION_COMPLETION_MESSAGE).build();
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND));
        return LoginResponse.builder().token(jwtService.generateToken(user)).build();
    }
}
