package com.kudip.cookinglog;

import com.kudip.common.entity.BaseEntity;
import com.kudip.recipe.Recipe;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cooking_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CookingLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    private LocalDate cookedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeSlot timeSlot;

    private Integer cookTimeMinutes;

    @Column(columnDefinition = "TEXT")
    private String recipeMemo;

    @Column(columnDefinition = "TEXT")
    private String processMemo;

    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String diary;

    @OneToMany(mappedBy = "cookingLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CookingLogIngredient> ingredients = new ArrayList<>();

    @OneToMany(mappedBy = "cookingLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CookingLogImage> images = new ArrayList<>();

    public void update(LocalDate cookedAt, TimeSlot timeSlot, Integer cookTimeMinutes,
                       String recipeMemo, String processMemo, Integer rating, String diary) {
        this.cookedAt = cookedAt;
        this.timeSlot = timeSlot;
        this.cookTimeMinutes = cookTimeMinutes;
        this.recipeMemo = recipeMemo;
        this.processMemo = processMemo;
        this.rating = rating;
        this.diary = diary;
    }

    @Builder
    public CookingLog(Recipe recipe, LocalDate cookedAt, TimeSlot timeSlot,
                      Integer cookTimeMinutes, String recipeMemo, String processMemo,
                      Integer rating, String diary) {
        this.recipe = recipe;
        this.cookedAt = cookedAt;
        this.timeSlot = timeSlot;
        this.cookTimeMinutes = cookTimeMinutes;
        this.recipeMemo = recipeMemo;
        this.processMemo = processMemo;
        this.rating = rating;
        this.diary = diary;
    }
}
