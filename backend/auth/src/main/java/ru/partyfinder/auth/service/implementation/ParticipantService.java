package ru.partyfinder.auth.service.implementation;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import ru.partyfinder.auth.repository.ParticipantRepository;
import ru.partyfinder.auth.service.UserService;

@Service
@RequiredArgsConstructor
public class ParticipantService implements UserService {

    private final ParticipantRepository participantRepository;

    @Override
    public UserDetailsService getUserDetailsService() {
        return username -> participantRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Participant with username %s does not exist"
                        .formatted(username)));
    }
}
