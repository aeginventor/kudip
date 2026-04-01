package com.kudip.dashboard.dto;

import lombok.Getter;

@Getter
public class TopRecipeItem {

    private final String recipeName;
    private final long count;
    private final double averageRating;

    public TopRecipeItem(String recipeName, long count, double averageRating) {
        this.recipeName = recipeName;
        this.count = count;
        this.averageRating = averageRating;
    }
}
