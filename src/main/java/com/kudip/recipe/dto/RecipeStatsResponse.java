package com.kudip.recipe.dto;

import com.kudip.cookinglog.TimeSlot;
import com.kudip.recipe.RecipeCategory;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RecipeStatsResponse {

    private final String recipeName;
    private final long totalCount;
    private final double averageRating;
    private final CookingLogSummary bestLog;
    private final List<CookingLogSummary> recentLogs;
    private final List<IngredientStatItem> ingredientStats;
    private final List<TimeSlotStatItem> timeSlotStats;
}
