package com.kudip.recipe;

import com.kudip.common.response.ApiResponse;
import com.kudip.recipe.dto.RecipeStatsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Recipe", description = "레시피 관리")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeStatsController {

    private final RecipeStatsService recipeStatsService;

    @Operation(
            summary = "레시피 상세 통계 조회",
            description = "총 요리 횟수, 평균 평점, 최고 기록, 최근 5개 기록, 재료별 통계, 시간대별 통계를 반환합니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 레시피 조회 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "레시피 없음")
    })
    @GetMapping("/{id}/stats")
    public ApiResponse<RecipeStatsResponse> getStats(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ApiResponse.ok(recipeStatsService.getStats(userDetails.getUsername(), id));
    }
}
