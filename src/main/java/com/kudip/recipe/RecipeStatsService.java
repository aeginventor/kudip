package com.kudip.recipe;

import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.cookinglog.CookingLogRepository;
import com.kudip.recipe.dto.CookingLogSummary;
import com.kudip.recipe.dto.RecipeStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeStatsService {

    private final RecipeRepository recipeRepository;
    private final CookingLogRepository cookingLogRepository;

    @Transactional(readOnly = true)
    public RecipeStatsResponse getStats(String email, Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new CustomException(ErrorCode.RECIPE_NOT_FOUND));

        if (!recipe.getUser().getEmail().equals(email)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        List<CookingLogSummary> bestLogList = cookingLogRepository
                .findBestByRecipe(recipe, PageRequest.of(0, 1))
                .stream().map(CookingLogSummary::from).toList();

        List<CookingLogSummary> recentLogs = cookingLogRepository
                .findRecentByRecipe(recipe, PageRequest.of(0, 5))
                .stream().map(CookingLogSummary::from).toList();

        return RecipeStatsResponse.builder()
                .recipeName(recipe.getName())
                .totalCount(cookingLogRepository.countByRecipe(recipe))
                .averageRating(cookingLogRepository.findAverageRatingByRecipe(recipe))
                .bestLog(bestLogList.isEmpty() ? null : bestLogList.get(0))
                .recentLogs(recentLogs)
                .ingredientStats(List.of())
                .timeSlotStats(List.of())
                .build();
    }
}
