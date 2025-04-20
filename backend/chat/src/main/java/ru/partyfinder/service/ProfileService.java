package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.ProfileRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public Profile findByUsername(String username) {
        return profileRepository.findByUsername(username).orElseThrow(
                () -> new IllegalArgumentException("Нет такого профиля человека")
        );
    }


}
