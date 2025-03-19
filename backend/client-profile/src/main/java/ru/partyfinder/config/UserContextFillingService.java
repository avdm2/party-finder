package ru.partyfinder.config;

import jakarta.servlet.http.HttpServletRequest;

public interface UserContextFillingService {

    UserRequest fillUserRequest(String request);
}
