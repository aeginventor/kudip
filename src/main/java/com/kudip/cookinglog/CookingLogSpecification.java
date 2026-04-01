package com.kudip.cookinglog;

import com.kudip.recipe.Recipe;
import com.kudip.recipe.RecipeCategory;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class CookingLogSpecification {

    public static Specification<CookingLog> filter(String email, Long recipeId,
                                                    LocalDate startDate, LocalDate endDate,
                                                    RecipeCategory category, Integer minRating) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<CookingLog, Recipe> recipeJoin = root.join("recipe", JoinType.INNER);
            predicates.add(cb.equal(recipeJoin.get("user").get("email"), email));

            if (recipeId != null) {
                predicates.add(cb.equal(recipeJoin.get("id"), recipeId));
            }
            if (category != null) {
                predicates.add(cb.equal(recipeJoin.get("category"), category));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("cookedAt"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("cookedAt"), endDate));
            }
            if (minRating != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("rating"), minRating));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
