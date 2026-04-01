package com.kudip.cookinglog;

import com.kudip.common.entity.BaseEntity;
import com.kudip.recipe.Recipe;
import com.kudip.user.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "cooking_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CookingLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Enumerated(EnumType.STRING)
    private TimeSlot timeSlot;

    @Column(nullable = false)
    private LocalDate logDate;

    @Builder
    public CookingLog(User user, Recipe recipe, String title, String memo, TimeSlot timeSlot, LocalDate logDate) {
        this.user = user;
        this.recipe = recipe;
        this.title = title;
        this.memo = memo;
        this.timeSlot = timeSlot;
        this.logDate = logDate;
    }
}
