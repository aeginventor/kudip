package com.kudip.cookinglog;

import com.kudip.common.response.ApiResponse;
import com.kudip.cookinglog.dto.ImageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class CookingLogImageController {

    private final CookingLogImageService imageService;

    @PostMapping(value = "/{logId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<List<ImageResponse>> upload(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long logId,
            @RequestParam("images") List<MultipartFile> files) {
        return ApiResponse.ok(imageService.upload(userDetails.getUsername(), logId, files));
    }

    @DeleteMapping("/{logId}/images/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long logId,
            @PathVariable Long imageId) {
        imageService.delete(userDetails.getUsername(), logId, imageId);
    }
}
