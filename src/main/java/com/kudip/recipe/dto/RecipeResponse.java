package com.kudip.recipe.dto;

import com.kudip.recipe.Recipe;
import com.kudip.recipe.RecipeCategory;
import com.kudip.recipe.RecipeProjection;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class RecipeResponse {

    private final Long id;
    private final String name;
    private final RecipeCategory category;
    private final long totalCookCount;
    private final LocalDateTime createdAt;

    private RecipeResponse(Long id, String name, RecipeCategory category,
                           long totalCookCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.totalCookCount = totalCookCount;
        this.createdAt = createdAt;
    }

    public static RecipeResponse from(Recipe recipe) {
        return new RecipeResponse(
                recipe.getId(),
                recipe.getName(),
                recipe.getCategory(),
                recipe.getCookingLogs().size(),
                recipe.getCreatedAt()
        );
    }

    public static RecipeResponse from(RecipeProjection projection) {
        return new RecipeResponse(
                projection.getId(),
                projection.getName(),
                projection.getCategory(),
                projection.getTotalCookCount(),
                projection.getCreatedAt()
        );
    }
}
