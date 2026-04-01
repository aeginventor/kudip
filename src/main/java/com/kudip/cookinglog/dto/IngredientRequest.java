package com.kudip.cookinglog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
@Schema(description = "재료 정보")
public class IngredientRequest {

    @Schema(description = "재료 이름 (동일 이름은 자동으로 기존 재료에 연결)", example = "돼지고기")
    @NotBlank(message = "재료 이름을 입력해주세요.")
    private String name;

    @Schema(description = "사용량 (자유 형식)", example = "200g")
    private String quantity;
}
