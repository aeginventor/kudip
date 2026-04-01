package com.kudip.dashboard.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class CalendarItem {

    private final LocalDate date;
    private final long count;

    public CalendarItem(LocalDate date, long count) {
        this.date = date;
        this.count = count;
    }
}
