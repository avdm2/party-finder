package ru.partyfinder.organizerprofile.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.partyfinder.organizerprofile.entity.MediaEntity;
import ru.partyfinder.organizerprofile.service.MediaService;

@RestController
@RequestMapping("/api/v1/organizer/media")
@RequiredArgsConstructor
@Slf4j
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/photo/{username}")
    public ResponseEntity<byte[]> getPhotoByUser(@PathVariable String username) {
        MediaEntity media = mediaService.getMediaByUser(username);
        if (media == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header("Content-Type", media.getMimeType())
                .body(media.getFileData());
    }

    @PostMapping("/uploadPhoto")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file,
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

    @PostMapping("/changePhoto")
    public ResponseEntity<String> changePhotoByUser(@RequestParam("file") MultipartFile file,
                                                    @RequestParam("username") String username) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Файл не может быть пустым");
            }
            mediaService.changeMediaByUser(file, username);
            return ResponseEntity.ok("Фото успешно обновлено для пользователя: " + username);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при загрузке файла: " + e.getMessage());
        }
    }

    @PostMapping("/deletePhoto")
    public ResponseEntity<String> deletePhotoByUser(@RequestParam("file") MultipartFile file,
                                                    @RequestParam("username") String username) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Файл не может быть пустым");
            }
            mediaService.deleteMediaByUser(username);
            return ResponseEntity.ok("Фото успешно удалено для пользователя: " + username);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при загрузке файла: " + e.getMessage());
        }
    }
}