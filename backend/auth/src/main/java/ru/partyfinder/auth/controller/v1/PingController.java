package ru.partyfinder.auth.controller.v1;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth/ping")
@RequiredArgsConstructor
public class PingController {

    @GetMapping("/organizer")
    public ResponseEntity<String> pingOrganizer() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/participant")
    public ResponseEntity<String> pingParticipant() {
        return ResponseEntity.ok().build();
    }
}
