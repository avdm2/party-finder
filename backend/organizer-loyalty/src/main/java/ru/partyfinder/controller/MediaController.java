package ru.partyfinder.controller;

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
import ru.partyfinder.entity.MediaEntity;
import ru.partyfinder.service.MediaService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/loyalty/media")
@RequiredArgsConstructor
@Slf4j
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/photo/{prizeUuid}")
    public ResponseEntity<byte[]> getPhotoByPrizeUUID(@PathVariable UUID prizeUuid) {
        MediaEntity media = mediaService.getMedia(prizeUuid);
        if (media == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header("Content-Type", media.getMimeType())
                .body(media.getFileData());
    }

    @PostMapping("/uploadPhoto")
    public ResponseEntity<String> uploadPhoto(@RequestParam("file") MultipartFile file,
                                              @RequestParam("prizeUuid") UUID prizeUuid) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Файл не может быть пустым");
            }
            mediaService.saveFile(file, prizeUuid);
            return ResponseEntity.ok("Фото успешно загружено для приза: " + prizeUuid);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка при загрузке файла: " + e.getMessage());
        }
    }
}