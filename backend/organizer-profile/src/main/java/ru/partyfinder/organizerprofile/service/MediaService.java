package ru.partyfinder.organizerprofile.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import ru.partyfinder.organizerprofile.entity.MediaEntity;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;
import ru.partyfinder.organizerprofile.repository.MediaRepository;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final OrganizerService organizerService;

    @Transactional
    public void saveFileForUser(MultipartFile file, String username) {
        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);
        if (profile == null) {
            throw new RuntimeException("Организатор с username " + username + " не найден");
        }

        MediaEntity media = createNewMedia(file);
        MediaEntity savedMedia = mediaRepository.save(media);

        profile.setMedia(savedMedia);
        organizerService.saveOrganizerWithMedia(profile);
    }

    @Transactional(readOnly = true)
    public MediaEntity getMediaByUser(String username) {
        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);
        if (profile == null || profile.getMedia() == null) {
            return null;
        }
        return profile.getMedia();
    }

    @Transactional
    public void changeMediaByUser(MultipartFile file, String username) {
        MediaEntity newMedia = createNewMedia(file);
        MediaEntity oldMedia = getMediaByUser(username);

        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);

        mediaRepository.delete(oldMedia);
        mediaRepository.save(newMedia);
        profile.setMedia(newMedia);
        organizerService.saveOrganizerWithMedia(profile);

    }

    @Transactional
    public void deleteMediaByUser(String username) {
        MediaEntity oldMedia = getMediaByUser(username);
        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);
        mediaRepository.delete(oldMedia);
        profile.setMedia(null);
        organizerService.saveOrganizerWithMedia(profile);
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