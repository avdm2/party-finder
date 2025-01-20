package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
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

    @PostMapping
    public UUID createProfile(@RequestBody ClientDTO clientDTO) {
        return profileService.createProfile(clientDTO);
    }

    @GetMapping("/{id}")
    public ProfileDTO getEvent(@PathVariable UUID id) {
        return profileService.getProfile(id);
    }
}
