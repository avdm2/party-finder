package ru.partyfinder.auth.service;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {

    String USER_NOT_EXISTS = "User with username %s does not exist";

    UserDetailsService getUserDetailsService();
}
