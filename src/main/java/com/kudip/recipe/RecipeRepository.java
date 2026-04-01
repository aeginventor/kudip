package com.kudip.recipe;

import com.kudip.user.User;
import org.springframework.data.domain.Pageable;
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

    /**
     * 해당 유저의 전체 레시피 수
     * Raw SQL:
     *   SELECT COUNT(*) FROM recipes WHERE user_id = (SELECT id FROM users WHERE email = :email);
     */
    @Query("SELECT COUNT(r.id) FROM Recipe r WHERE r.user.email = :email")
    long countByUserEmail(@Param("email") String email);

    /**
     * 요리 횟수 기준 상위 레시피 (동점이면 평점 높은 순)
     * Raw SQL:
     *   SELECT r.name AS recipe_name, COUNT(cl.id) AS count, AVG(cl.rating) AS average_rating
     *   FROM recipes r LEFT JOIN cooking_logs cl ON cl.recipe_id = r.id
     *   WHERE r.user_id = (SELECT id FROM users WHERE email = :email)
     *   GROUP BY r.id, r.name ORDER BY count DESC, average_rating DESC LIMIT 5;
     */
    @Query("SELECT r.name AS recipeName, COUNT(cl.id) AS count, COALESCE(AVG(cl.rating), 0.0) AS averageRating " +
           "FROM Recipe r LEFT JOIN r.cookingLogs cl " +
           "WHERE r.user.email = :email " +
           "GROUP BY r.id, r.name " +
           "ORDER BY COUNT(cl.id) DESC, COALESCE(AVG(cl.rating), 0.0) DESC")
    List<TopRecipeProjection> findTopRecipes(@Param("email") String email, Pageable pageable);

    /**
     * 카테고리별 요리 횟수
     * Raw SQL:
     *   SELECT r.category, COUNT(cl.id) AS count
     *   FROM recipes r JOIN cooking_logs cl ON cl.recipe_id = r.id
     *   WHERE r.user_id = (SELECT id FROM users WHERE email = :email)
     *   GROUP BY r.category ORDER BY count DESC;
     */
    @Query("SELECT r.category AS category, COUNT(cl.id) AS count " +
           "FROM Recipe r JOIN r.cookingLogs cl " +
           "WHERE r.user.email = :email " +
           "GROUP BY r.category " +
           "ORDER BY COUNT(cl.id) DESC")
    List<CategoryStatProjection> findCategoryStats(@Param("email") String email);
}
