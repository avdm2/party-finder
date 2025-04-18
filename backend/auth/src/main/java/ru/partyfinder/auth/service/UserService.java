package ru.partyfinder.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import ru.partyfinder.auth.entity.User;
import ru.partyfinder.auth.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    String USER_NOT_EXISTS = "User with username %s does not exist";

    private final UserRepository userRepository;

    public UserDetailsService getUserDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_EXISTS
                        .formatted(username)));
    }

    public int updateUserCredentials(String username, String password, String email) {
        return userRepository.updateUserCredentials(username, password, email);
    }


    public User getUserByNameAndSurname(String firstName, String lastName) {
        return userRepository.findByFirstnameAndLastname(firstName, lastName).orElseThrow(()
                -> new IllegalArgumentException(USER_NOT_EXISTS));
    }

}
