package com.kudip.cookinglog.dto;

import com.kudip.cookinglog.TimeSlot;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
public class UpdateCookingLogRequest {

    private LocalDate cookedAt;

    @NotNull(message = "시간대를 선택해주세요.")
    private TimeSlot timeSlot;

    private Integer cookTimeMinutes;
    private String recipeMemo;
    private String processMemo;

    @NotNull(message = "평점을 입력해주세요.")
    @Min(value = 1, message = "평점은 최소 1점입니다.")
    @Max(value = 5, message = "평점은 최대 5점입니다.")
    private Integer rating;

    private String diary;

    @Valid
    private List<IngredientRequest> ingredients = new ArrayList<>();
}
