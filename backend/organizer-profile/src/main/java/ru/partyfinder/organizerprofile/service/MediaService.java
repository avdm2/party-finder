package ru.partyfinder.organizerprofile.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import ru.partyfinder.organizerprofile.entity.MediaEntity;
import ru.partyfinder.organizerprofile.entity.OrganizerEntity;
import ru.partyfinder.organizerprofile.repository.MediaRepository;

@Service
@AllArgsConstructor
@RequiredArgsConstructor
public class MediaService {

    private MediaRepository mediaRepository;
    private OrganizerService organizerService;

    public void saveFileForUser(MultipartFile file, String username) {
        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);
        MediaEntity media = createNewMedia(file);

        MediaEntity savedMedia = mediaRepository.save(media);
        profile.setMedia(savedMedia);
        organizerService.saveOrganizerWithMedia(profile);
    }


    public MediaEntity getMediaByUser(@PathVariable String username) {
        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);
        return profile.getMedia();
    }

    public void changeMediaByUser(MultipartFile file, String username) {
        MediaEntity newMedia = createNewMedia(file);
        MediaEntity oldMedia = getMediaByUser(username);

        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);

        mediaRepository.delete(oldMedia);
        mediaRepository.save(newMedia);
        profile.setMedia(newMedia);
        organizerService.saveOrganizerWithMedia(profile);

    }

    public void deleteMediaByUser(String username) {
        MediaEntity oldMedia = getMediaByUser(username);
        OrganizerEntity profile = organizerService.findOrganizerByUsername(username);
        mediaRepository.delete(oldMedia);
        profile.setMedia(null);
        organizerService.saveOrganizerWithMedia(profile);
    }

    @SneakyThrows
    private MediaEntity createNewMedia(MultipartFile file) {
        MediaEntity media = new MediaEntity();
        media.setFileName(file.getOriginalFilename());
        media.setMimeType(file.getContentType());
        media.setFileData(file.getBytes());
        return media;
    }

}