package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.models.dto.ClientDTO;
import ru.partyfinder.models.dto.ProfileDTO;
import ru.partyfinder.service.ProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/client-service/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/create")
    public void createProfile(@RequestBody ClientDTO clientDTO) {
        profileService.createProfile(clientDTO);
    }

    @GetMapping("/me")
    public ProfileDTO getProfileMe() {
        String username = UserContextHolder.getContext().getUsername();
        return profileService.getProfile(username);
    }

    @GetMapping("/{username}")
    public ProfileDTO getProfile(@PathVariable String username) {
        return profileService.getProfile(username);
    }
}
