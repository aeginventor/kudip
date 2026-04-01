package com.kudip.recipe;

import com.kudip.common.response.ApiResponse;
import com.kudip.recipe.dto.RecipeStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeStatsController {

    private final RecipeStatsService recipeStatsService;

    @GetMapping("/{id}/stats")
    public ApiResponse<RecipeStatsResponse> getStats(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ApiResponse.ok(recipeStatsService.getStats(userDetails.getUsername(), id));
    }
}
