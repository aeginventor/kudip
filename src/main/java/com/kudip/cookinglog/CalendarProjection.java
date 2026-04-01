package com.kudip.cookinglog;

import java.time.LocalDate;

public interface CalendarProjection {
    LocalDate getDate();
    Long getCount();
}
