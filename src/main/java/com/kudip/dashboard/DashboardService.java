package com.kudip.dashboard;

import com.kudip.cookinglog.CookingLogRepository;
import com.kudip.dashboard.dto.*;
import com.kudip.recipe.RecipeRepository;
import com.kudip.recipe.dto.CookingLogSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CookingLogRepository cookingLogRepository;
    private final RecipeRepository recipeRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String email) {
        List<CookingLogSummary> recentLogs = cookingLogRepository
                .findRecentByUserEmail(email, PageRequest.of(0, 7))
                .stream().map(CookingLogSummary::from).toList();

        List<TopRecipeItem> topRecipes = recipeRepository
                .findTopRecipes(email, PageRequest.of(0, 5))
                .stream()
                .map(p -> new TopRecipeItem(p.getRecipeName(), p.getCount(), p.getAverageRating()))
                .toList();

        List<CategoryStatItem> categoryStats = recipeRepository
                .findCategoryStats(email)
                .stream()
                .map(p -> new CategoryStatItem(p.getCategory(), p.getCount()))
                .toList();

        List<CalendarItem> calendarData = cookingLogRepository
                .findCalendarData(email)
                .stream()
                .map(p -> new CalendarItem(p.getDate(), p.getCount()))
                .toList();

        return DashboardResponse.builder()
                .totalCookCount(cookingLogRepository.countByUserEmail(email))
                .totalRecipeCount(recipeRepository.countByUserEmail(email))
                .averageRating(cookingLogRepository.findAverageRatingByUserEmail(email))
                .topRecipes(topRecipes)
                .recentLogs(recentLogs)
                .categoryStats(categoryStats)
                .calendarData(calendarData)
                .build();
    }
}
