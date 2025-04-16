package ru.partyfinder.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import ru.partyfinder.entity.Media;
import ru.partyfinder.entity.Profile;
import ru.partyfinder.repository.MediaRepository;


@Slf4j
@Service
@AllArgsConstructor
public class MediaService {

    private MediaRepository mediaRepository;

    private ProfileService profileService;

    @Transactional
    public void saveFileForUser(MultipartFile file, String username) {

        Profile profile = profileService.getProfileByUsername(username);

        Media media = createNewMedia(file);

        if (media != null) {
            Media savedMedia = mediaRepository.save(media);

            profile.setMedia(savedMedia);
            profileService.saveProfileWithMedia(profile);
        } else {
            throw new IllegalArgumentException("Что-то не так с файлом, не смог создать объект");
        }
    }


    public Media getMediaByUser(String username) {
        Profile profile = profileService.getProfileByUsername(username);

        return profile.getMedia();
    }

    /*public void changeMediaByUser(MultipartFile file, String username) {
        Media newMedia = createNewMedia(file);
        if (newMedia != null) {
            Media oldMedia = getMediaByUser(username);

            Profile profile = profileService.getProfileByUsername(username);

            mediaRepository.delete(oldMedia);
            mediaRepository.save(newMedia);
            profile.setMedia(newMedia);
            profileService.saveProfileWithMedia(profile);
        } else {
            throw new IllegalArgumentException("Что-то не так с файлом, не смог создать объект");
        }

    }*/
   /* public void deleteMediaByUser(MultipartFile file, String username) {
        Media oldMedia = getMediaByUser(username);

        Profile profile = profileService.getProfileByUsername(username);

        mediaRepository.delete(oldMedia);
        profile.setMedia(null);
        profileService.saveProfileWithMedia(profile);
    }*/

    private Media createNewMedia(MultipartFile file) {
        try {
            Media media = new Media();
            media.setFileName(file.getOriginalFilename());
            media.setMimeType(file.getContentType());
            media.setFileData(file.getBytes());
            return media;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}