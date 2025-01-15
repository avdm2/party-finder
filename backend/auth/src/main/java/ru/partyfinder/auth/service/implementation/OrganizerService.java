package ru.partyfinder.auth.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import ru.partyfinder.auth.repository.OrganizerRepository;
import ru.partyfinder.auth.service.UserService;

@Service
@RequiredArgsConstructor
public class OrganizerService implements UserService {

    private final OrganizerRepository organizerRepository;

    @Override
    public UserDetailsService getUserDetailsService() {
        return username -> organizerRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Organizer with username %s does not exist"
                        .formatted(username)));
    }
}
