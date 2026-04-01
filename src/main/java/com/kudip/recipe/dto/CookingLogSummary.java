package com.kudip.recipe.dto;

import com.kudip.cookinglog.CookingLog;
import com.kudip.cookinglog.TimeSlot;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class CookingLogSummary {

    private final Long id;
    private final LocalDate cookedAt;
    private final TimeSlot timeSlot;
    private final Integer rating;
    private final String diary;
    private final LocalDateTime createdAt;

    private CookingLogSummary(CookingLog log) {
        this.id = log.getId();
        this.cookedAt = log.getCookedAt();
        this.timeSlot = log.getTimeSlot();
        this.rating = log.getRating();
        this.diary = log.getDiary();
        this.createdAt = log.getCreatedAt();
    }

    public static CookingLogSummary from(CookingLog log) {
        return new CookingLogSummary(log);
    }
}
