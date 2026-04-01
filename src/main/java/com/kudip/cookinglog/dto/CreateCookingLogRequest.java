package com.kudip.cookinglog.dto;

import com.kudip.cookinglog.TimeSlot;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Schema(description = "요리 기록 생성 요청")
public class CreateCookingLogRequest {

    @Schema(description = "레시피 ID", example = "1")
    @NotNull(message = "레시피를 선택해주세요.")
    private Long recipeId;

    @Schema(description = "요리한 날짜 (yyyy-MM-dd)", example = "2025-06-15")
    private LocalDate cookedAt;

    @Schema(description = "시간대 (MORNING/LUNCH/DINNER/NONE)", example = "DINNER")
    @NotNull(message = "시간대를 선택해주세요.")
    private TimeSlot timeSlot;

    @Schema(description = "조리 시간 (분)", example = "45")
    private Integer cookTimeMinutes;

    @Schema(description = "레시피 메모", example = "묵은지를 사용하면 더 맛있음")
    private String recipeMemo;

    @Schema(description = "과정 메모", example = "두부를 마지막에 넣어야 부서지지 않음")
    private String processMemo;

    @Schema(description = "평점 (1~5)", example = "4")
    @NotNull(message = "평점을 입력해주세요.")
    @Min(value = 1, message = "평점은 최소 1점입니다.")
    @Max(value = 5, message = "평점은 최대 5점입니다.")
    private Integer rating;

    @Schema(description = "다이어리 (자유 메모)", example = "오늘은 좀 짰다. 간장 줄여야겠다.")
    private String diary;

    @Schema(description = "사용한 재료 목록")
    @Valid
    private List<IngredientRequest> ingredients = new ArrayList<>();
}
