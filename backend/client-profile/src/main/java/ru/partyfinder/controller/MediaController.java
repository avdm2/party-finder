package ru.partyfinder.controller;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.partyfinder.entity.Media;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.ProfileRepository;
import ru.partyfinder.service.MediaService;

@RestController
@RequestMapping("/api/v3/media/user")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/getPhoto/{username}")
    public ResponseEntity<byte[]> getPhotoByUser(@PathVariable String username) {
        try {
            byte[] bytes = mediaService.getMediaByUser(username).getFileData();
            return ResponseEntity.ok(bytes);
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
            mediaService.deleteMediaByUser(file, username);
            return ResponseEntity.ok("Фото успешно удалено для пользователя: " + username);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при загрузке файла: " + e.getMessage());
        }
    }
}