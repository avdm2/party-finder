package ru.partyfinder.config;

public interface UserContextFillingService {

    UserRequest fillUserRequest(String username, String token);
}
