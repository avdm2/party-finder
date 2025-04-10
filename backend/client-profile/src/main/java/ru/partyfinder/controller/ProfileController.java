package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import ru.partyfinder.config.UserContextHolder;
import ru.partyfinder.models.dto.ClientDTO;
import ru.partyfinder.models.dto.ProfileDTO;
import ru.partyfinder.service.ProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
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

    @GetMapping("/by-username/{username}")
    public ProfileDTO getProfile(@PathVariable String username) {
        return profileService.getProfile(username);
    }

    @GetMapping("/by-id/{id}")
    public ProfileDTO getProfile(@PathVariable UUID id) {
        return profileService.getProfileId(id);
    }

    @GetMapping("/search")
    public Page<ProfileDTO> searchProfilesByUsername(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        log.info("Controller -> username -> " + username);

        Pageable pageable = PageRequest.of(page, size);

        return profileService.findProfilesByUsername(username, pageable);
    }
}
