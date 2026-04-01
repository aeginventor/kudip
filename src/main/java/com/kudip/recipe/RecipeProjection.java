package com.kudip.recipe;

import java.time.LocalDateTime;

public interface RecipeProjection {
    Long getId();
    String getName();
    RecipeCategory getCategory();
    LocalDateTime getCreatedAt();
    Long getTotalCookCount();
}
