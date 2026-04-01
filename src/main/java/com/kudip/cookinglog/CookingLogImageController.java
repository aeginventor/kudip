package com.kudip.cookinglog;

import com.kudip.common.response.ApiResponse;
import com.kudip.cookinglog.dto.ImageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "CookingLog", description = "요리 기록 관리")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class CookingLogImageController {

    private final CookingLogImageService imageService;

    @Operation(
            summary = "요리 이미지 업로드",
            description = "요리 기록에 이미지를 업로드합니다. jpg/jpeg/png/webp 형식, 최대 3장, 파일당 최대 10MB."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "업로드 성공 — S3 URL 반환"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "지원하지 않는 확장자 또는 이미지 수 초과"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 기록에 업로드 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "기록 없음")
    })
    @PostMapping(value = "/{logId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<List<ImageResponse>> upload(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long logId,
            @RequestParam("images") List<MultipartFile> files) {
        return ApiResponse.ok(imageService.upload(userDetails.getUsername(), logId, files));
    }

    @Operation(summary = "요리 이미지 삭제", description = "S3에서 이미지를 삭제하고 DB 레코드도 제거합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 기록의 이미지 삭제 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "이미지 없음")
    })
    @DeleteMapping("/{logId}/images/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long logId,
            @PathVariable Long imageId) {
        imageService.delete(userDetails.getUsername(), logId, imageId);
    }
}
