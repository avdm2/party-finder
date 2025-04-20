package ru.partyfinder.config.security;

public interface UserContextFillingService {

    UserRequest fillUserRequest(String request);
}
