package com.kudip.recipe.dto;

import com.kudip.recipe.RecipeCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
@Schema(description = "레시피 생성 요청")
public class CreateRecipeRequest {

    @Schema(description = "레시피 이름", example = "김치찌개")
    @NotBlank(message = "레시피 이름을 입력해주세요.")
    private String name;

    @Schema(description = "카테고리 (KOREAN/WESTERN/JAPANESE/CHINESE/OTHER)", example = "KOREAN")
    @NotNull(message = "카테고리를 선택해주세요.")
    private RecipeCategory category;
}
