package com.kudip.recipe;

import com.kudip.common.response.ApiResponse;
import com.kudip.recipe.dto.CreateRecipeRequest;
import com.kudip.recipe.dto.RecipeResponse;
import com.kudip.recipe.dto.UpdateRecipeRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Recipe", description = "레시피 관리")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @Operation(summary = "내 레시피 목록 조회", description = "로그인한 사용자의 레시피 목록을 최신순으로 반환합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ApiResponse<List<RecipeResponse>> getMyRecipes(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.ok(recipeService.getMyRecipes(userDetails.getUsername()));
    }

    @Operation(summary = "레시피 생성", description = "새 레시피를 생성합니다. 동일 사용자의 중복 이름은 허용되지 않습니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "생성 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "레시피 이름 중복")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RecipeResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateRecipeRequest request) {
        return ApiResponse.ok(recipeService.create(userDetails.getUsername(), request));
    }

    @Operation(summary = "레시피 수정", description = "레시피 이름과 카테고리를 수정합니다. 본인 레시피만 수정 가능합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 레시피 수정 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "레시피 없음")
    })
    @PutMapping("/{id}")
    public ApiResponse<RecipeResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateRecipeRequest request) {
        return ApiResponse.ok(recipeService.update(id, userDetails.getUsername(), request));
    }

    @Operation(summary = "레시피 삭제", description = "레시피와 연결된 모든 요리 기록을 함께 삭제합니다. 본인 레시피만 삭제 가능합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "타인 레시피 삭제 시도"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "레시피 없음")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        recipeService.delete(id, userDetails.getUsername());
    }
}
