package ru.partyfinder.auth.service;

import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {

    UserDetailsService getUserDetailsService();
}
