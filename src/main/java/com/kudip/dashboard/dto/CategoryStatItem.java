package com.kudip.dashboard.dto;

import com.kudip.recipe.RecipeCategory;
import lombok.Getter;

@Getter
public class CategoryStatItem {

    private final RecipeCategory category;
    private final long count;

    public CategoryStatItem(RecipeCategory category, long count) {
        this.category = category;
        this.count = count;
    }
}
