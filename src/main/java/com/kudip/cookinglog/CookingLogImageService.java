package com.kudip.cookinglog;

import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.config.S3Service;
import com.kudip.cookinglog.dto.ImageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CookingLogImageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final int MAX_IMAGE_COUNT = 3;

    private final CookingLogImageRepository imageRepository;
    private final CookingLogRepository cookingLogRepository;
    private final S3Service s3Service;

    @Transactional
    public List<ImageResponse> upload(String email, Long logId, List<MultipartFile> files) {
        CookingLog log = findLog(logId);
        checkOwner(log, email);

        if (log.getImages().size() + files.size() > MAX_IMAGE_COUNT) {
            throw new CustomException(ErrorCode.MAX_IMAGE_LIMIT_EXCEEDED);
        }

        return files.stream().map(file -> {
            String ext = extractExtension(file);
            if (!ALLOWED_EXTENSIONS.contains(ext)) {
                throw new CustomException(ErrorCode.INVALID_FILE_EXTENSION);
            }
            String key = String.format("kudip/logs/%d/%s.%s", logId, UUID.randomUUID(), ext);
            String url = s3Service.upload(file, key);

            CookingLogImage image = imageRepository.save(
                    CookingLogImage.builder().cookingLog(log).imageUrl(url).build()
            );
            log.getImages().add(image);
            return ImageResponse.from(image);
        }).toList();
    }

    @Transactional
    public void delete(String email, Long logId, Long imageId) {
        CookingLogImage image = imageRepository.findById(imageId)
                .orElseThrow(() -> new CustomException(ErrorCode.IMAGE_NOT_FOUND));

        if (!image.getCookingLog().getId().equals(logId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
        checkOwner(image.getCookingLog(), email);

        imageRepository.delete(image);
        s3Service.delete(image.getImageUrl());
    }

    private CookingLog findLog(Long logId) {
        return cookingLogRepository.findById(logId)
                .orElseThrow(() -> new CustomException(ErrorCode.COOKING_LOG_NOT_FOUND));
    }

    private void checkOwner(CookingLog log, String email) {
        if (!log.getRecipe().getUser().getEmail().equals(email)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }

    private String extractExtension(MultipartFile file) {
        String name = file.getOriginalFilename();
        if (name == null || !name.contains(".")) {
            throw new CustomException(ErrorCode.INVALID_FILE_EXTENSION);
        }
        return name.substring(name.lastIndexOf('.') + 1).toLowerCase();
    }
}
