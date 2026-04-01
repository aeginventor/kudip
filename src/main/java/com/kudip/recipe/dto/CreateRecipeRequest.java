package com.kudip.recipe.dto;

import com.kudip.recipe.RecipeCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateRecipeRequest {

    @NotBlank(message = "레시피 이름을 입력해주세요.")
    private String name;

    @NotNull(message = "카테고리를 선택해주세요.")
    private RecipeCategory category;
}
