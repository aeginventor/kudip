package com.kudip.recipe.dto;

import com.kudip.cookinglog.TimeSlot;
import lombok.Getter;

@Getter
public class TimeSlotStatItem {

    private final TimeSlot timeSlot;
    private final long count;
    private final double averageRating;

    public TimeSlotStatItem(TimeSlot timeSlot, long count, double averageRating) {
        this.timeSlot = timeSlot;
        this.count = count;
        this.averageRating = averageRating;
    }
}
