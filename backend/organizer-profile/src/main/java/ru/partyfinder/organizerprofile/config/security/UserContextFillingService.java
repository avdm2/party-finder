package ru.partyfinder.organizerprofile.config.security;

public interface UserContextFillingService {

    UserRequest fillUserRequest(String request);
}
