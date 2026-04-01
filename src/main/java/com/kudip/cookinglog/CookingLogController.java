package com.kudip.cookinglog;

import com.kudip.common.response.ApiResponse;
import com.kudip.cookinglog.dto.CreateCookingLogRequest;
import com.kudip.cookinglog.dto.CookingLogResponse;
import com.kudip.cookinglog.dto.UpdateCookingLogRequest;
import com.kudip.recipe.RecipeCategory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "CookingLog", description = "요리 기록 관리")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class CookingLogController {

    private final CookingLogService cookingLogService;

    @Operation(summary = "요리 기록 생성", description = "레시피에 요리 기록을 추가합니다. 재료는 자동으로 find-or-create 처리됩니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "생성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 레시피에 기록 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "레시피 없음")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CookingLogResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCookingLogRequest request) {
        return ApiResponse.ok(cookingLogService.create(userDetails.getUsername(), request));
    }

    @Operation(summary = "요리 기록 목록 조회", description = "다양한 조건으로 필터링된 요리 기록 목록을 최신순으로 반환합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ApiResponse<List<CookingLogResponse>> getList(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "레시피 ID로 필터") @RequestParam(required = false) Long recipeId,
            @Parameter(description = "시작 날짜 (yyyy-MM-dd)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "종료 날짜 (yyyy-MM-dd)") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @Parameter(description = "카테고리 (KOREAN/WESTERN/JAPANESE/CHINESE/OTHER)") @RequestParam(required = false) RecipeCategory category,
            @Parameter(description = "최소 평점 (1~5)") @RequestParam(required = false) Integer minRating) {
        return ApiResponse.ok(cookingLogService.getList(
                userDetails.getUsername(), recipeId, startDate, endDate, category, minRating));
    }

    @Operation(summary = "요리 기록 상세 조회")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 기록 조회 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "기록 없음")
    })
    @GetMapping("/{id}")
    public ApiResponse<CookingLogResponse> getOne(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ApiResponse.ok(cookingLogService.getOne(userDetails.getUsername(), id));
    }

    @Operation(summary = "요리 기록 수정", description = "기록 내용을 수정합니다. 재료 목록은 기존 재료를 모두 교체합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 기록 수정 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "기록 없음")
    })
    @PutMapping("/{id}")
    public ApiResponse<CookingLogResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCookingLogRequest request) {
        return ApiResponse.ok(cookingLogService.update(userDetails.getUsername(), id, request));
    }

    @Operation(summary = "요리 기록 삭제")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 기록 삭제 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "기록 없음")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        cookingLogService.delete(userDetails.getUsername(), id);
    }
}
