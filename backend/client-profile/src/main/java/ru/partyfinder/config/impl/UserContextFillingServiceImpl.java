package ru.partyfinder.config.impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import ru.partyfinder.config.UserContextFillingService;
import ru.partyfinder.config.UserRequest;

@Component
@Slf4j
public class UserContextFillingServiceImpl implements UserContextFillingService {
    @Override
    public UserRequest fillUserRequest(String username) {
        UserRequest userRequest = new UserRequest();
        userRequest.setUsername(username);

        return userRequest;
    }
}
