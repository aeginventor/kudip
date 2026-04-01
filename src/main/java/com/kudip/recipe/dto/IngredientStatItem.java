package com.kudip.recipe.dto;

import lombok.Getter;

@Getter
public class IngredientStatItem {

    private final String ingredientName;
    private final long useCount;
    private final double averageRating;

    public IngredientStatItem(String ingredientName, long useCount, double averageRating) {
        this.ingredientName = ingredientName;
        this.useCount = useCount;
        this.averageRating = averageRating;
    }
}
