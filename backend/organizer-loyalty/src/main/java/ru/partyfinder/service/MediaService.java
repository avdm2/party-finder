package ru.partyfinder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.partyfinder.entity.MediaEntity;
import ru.partyfinder.entity.PrizeEntity;
import ru.partyfinder.repository.MediaRepository;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final PrizeService prizeService;

    @Transactional
    public void saveFile(MultipartFile file, UUID prizeUuid) {
        PrizeEntity prize = prizeService.get(prizeUuid);
        if (prize == null) {
            throw new RuntimeException("Приз с ID " + prizeUuid + " не найден");
        }

        MediaEntity media = createNewMedia(file);
        MediaEntity savedMedia = mediaRepository.save(media);

        prize.setMedia(savedMedia);
        prizeService.add(prize.withMedia(savedMedia));
    }

    @Transactional(readOnly = true)
    public MediaEntity getMedia(UUID prizeUuid) {
        PrizeEntity prizeEntity = prizeService.get(prizeUuid);
        if (prizeEntity == null || prizeEntity.getMedia() == null) {
            return null;
        }
        return prizeEntity.getMedia();
    }

    private MediaEntity createNewMedia(MultipartFile file) {
        MediaEntity media = new MediaEntity();
        media.setFileName(file.getOriginalFilename());
        media.setMimeType(file.getContentType());
        try {
            media.setFileData(file.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при чтении файла", e);
        }
        return media;
    }

}