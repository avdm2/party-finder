package ru.partyfinder.organizerprofile.config.security.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import ru.partyfinder.organizerprofile.config.security.UserContextFillingService;
import ru.partyfinder.organizerprofile.config.security.UserRequest;

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
