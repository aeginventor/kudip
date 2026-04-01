package com.kudip.cookinglog.dto;

import com.kudip.cookinglog.CookingLog;
import com.kudip.cookinglog.TimeSlot;
import com.kudip.recipe.RecipeCategory;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class CookingLogResponse {

    private final Long id;
    private final Long recipeId;
    private final String recipeName;
    private final RecipeCategory category;
    private final LocalDate cookedAt;
    private final TimeSlot timeSlot;
    private final Integer cookTimeMinutes;
    private final String recipeMemo;
    private final String processMemo;
    private final Integer rating;
    private final String diary;
    private final List<IngredientResponse> ingredients;
    private final List<String> imageUrls;
    private final LocalDateTime createdAt;

    private CookingLogResponse(CookingLog log) {
        this.id = log.getId();
        this.recipeId = log.getRecipe().getId();
        this.recipeName = log.getRecipe().getName();
        this.category = log.getRecipe().getCategory();
        this.cookedAt = log.getCookedAt();
        this.timeSlot = log.getTimeSlot();
        this.cookTimeMinutes = log.getCookTimeMinutes();
        this.recipeMemo = log.getRecipeMemo();
        this.processMemo = log.getProcessMemo();
        this.rating = log.getRating();
        this.diary = log.getDiary();
        this.ingredients = log.getIngredients().stream()
                .map(IngredientResponse::from)
                .toList();
        this.imageUrls = log.getImages().stream()
                .map(img -> img.getImageUrl())
                .toList();
        this.createdAt = log.getCreatedAt();
    }

    public static CookingLogResponse from(CookingLog log) {
        return new CookingLogResponse(log);
    }
}
