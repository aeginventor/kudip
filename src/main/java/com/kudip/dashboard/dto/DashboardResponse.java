package com.kudip.dashboard.dto;

import com.kudip.recipe.dto.CookingLogSummary;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DashboardResponse {

    private final long totalCookCount;
    private final long totalRecipeCount;
    private final double averageRating;
    private final List<TopRecipeItem> topRecipes;
    private final List<CookingLogSummary> recentLogs;
    private final List<CategoryStatItem> categoryStats;
    private final List<CalendarItem> calendarData;
}
