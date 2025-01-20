package ru.partyfinder.auth.service;

import ru.partyfinder.auth.models.dto.request.LoginRequest;
import ru.partyfinder.auth.models.dto.request.RegisterRequest;
import ru.partyfinder.auth.models.dto.response.LoginResponse;
import ru.partyfinder.auth.models.dto.response.RegisterResponse;

public interface AuthenticationService {

    String REGISTRATION_COMPLETION_MESSAGE = "Регистрация завершена успешно.";
    String USER_NOT_FOUND = "Пользователь с таким логином не найден.";
    String USER_ALREADY_EXISTS = "Пользователь с таким логином уже существует.";

    RegisterResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
}
