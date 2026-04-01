package com.kudip.cookinglog;

import com.kudip.ingredient.Ingredient;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cooking_log_ingredients")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CookingLogIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cooking_log_id", nullable = false)
    private CookingLog cookingLog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    private Ingredient ingredient;

    @Column(length = 50)
    private String quantity;

    @Builder
    public CookingLogIngredient(CookingLog cookingLog, Ingredient ingredient, String quantity) {
        this.cookingLog = cookingLog;
        this.ingredient = ingredient;
        this.quantity = quantity;
    }
}
