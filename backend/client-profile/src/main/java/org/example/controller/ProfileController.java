package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.models.dto.ClientDTO;
import org.example.models.dto.ProfileDTO;
import org.example.service.ProfileService;
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
