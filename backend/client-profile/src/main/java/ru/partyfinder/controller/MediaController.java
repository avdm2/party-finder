package ru.partyfinder.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.partyfinder.entity.Media;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.service.MediaService;

import java.io.IOException;

@RestController
@RequestMapping("/api/v3/media/user")
@RequiredArgsConstructor
@Slf4j
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/getPhoto/{username}")
    public ResponseEntity<byte[]> getPhotoByUser(@PathVariable String username) {
        log.info("qqqqqq");

        try {
            Media media = mediaService.getMediaByUser(username);
            if (media == null) {
                return ResponseEntity.notFound().build();
            }
            log.info("qqqqqq");
            return ResponseEntity.ok()
                    .header("Content-Type", media.getMimeType())
                    .body(media.getFileData());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/uploadPhoto")
    public ResponseEntity<String> setPhotoByUser(@RequestParam("file") MultipartFile file,
                                                 @RequestParam("username") String username) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Файл не может быть пустым");
            }
            mediaService.saveFileForUser(file, username);
            return ResponseEntity.ok("Фото успешно загружено для пользователя: " + username);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при загрузке файла: " + e.getMessage());
        }
    }

}