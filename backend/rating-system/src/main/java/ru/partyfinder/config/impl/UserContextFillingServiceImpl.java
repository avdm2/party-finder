package ru.partyfinder.config.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import ru.partyfinder.config.UserContextFillingService;
import ru.partyfinder.config.UserRequest;

@Component
@Slf4j
public class UserContextFillingServiceImpl implements UserContextFillingService {
    @Override
    public UserRequest fillUserRequest(String username, String token) {
        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(username);
        userRequest.setToken(token);
        return userRequest;
    }
}
