package com.kudip.cookinglog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class IngredientRequest {

    @NotBlank(message = "재료 이름을 입력해주세요.")
    private String name;

    private String quantity;
}
