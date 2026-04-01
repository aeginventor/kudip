package com.kudip.cookinglog.dto;

import com.kudip.cookinglog.CookingLogIngredient;
import lombok.Getter;

@Getter
public class IngredientResponse {

    private final String name;
    private final String quantity;

    private IngredientResponse(String name, String quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    public static IngredientResponse from(CookingLogIngredient cli) {
        return new IngredientResponse(cli.getIngredient().getName(), cli.getQuantity());
    }
}
