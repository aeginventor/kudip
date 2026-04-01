package com.kudip.recipe;

import com.kudip.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    boolean existsByUserAndName(User user, String name);

    @Query("SELECT r.id AS id, r.name AS name, r.category AS category, r.createdAt AS createdAt, " +
           "COUNT(cl.id) AS totalCookCount " +
           "FROM Recipe r LEFT JOIN r.cookingLogs cl " +
           "WHERE r.user = :user " +
           "GROUP BY r.id, r.name, r.category, r.createdAt " +
           "ORDER BY r.createdAt DESC")
    List<RecipeProjection> findRecipeListByUser(@Param("user") User user);
}
