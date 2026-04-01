package com.kudip.cookinglog;

import com.kudip.recipe.Recipe;
import com.kudip.recipe.RecipeCategory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CookingLogRepository extends JpaRepository<CookingLog, Long>,
        JpaSpecificationExecutor<CookingLog> {

    // ──────────────── Recipe 통계 ────────────────

    /**
     * 해당 레시피의 총 요리 횟수
     * Raw SQL:
     *   SELECT COUNT(*) FROM cooking_logs WHERE recipe_id = :recipeId;
     */
    @Query("SELECT COUNT(cl.id) FROM CookingLog cl WHERE cl.recipe = :recipe")
    long countByRecipe(@Param("recipe") Recipe recipe);

    /**
     * 해당 레시피의 평균 평점 (기록 없으면 0.0)
     * Raw SQL:
     *   SELECT COALESCE(AVG(rating), 0) FROM cooking_logs WHERE recipe_id = :recipeId;
     */
    @Query("SELECT COALESCE(AVG(cl.rating), 0.0) FROM CookingLog cl WHERE cl.recipe = :recipe")
    double findAverageRatingByRecipe(@Param("recipe") Recipe recipe);

    /**
     * 해당 레시피에서 가장 높은 평점을 받은 요리 기록 (동점이면 최신순)
     * Raw SQL:
     *   SELECT * FROM cooking_logs WHERE recipe_id = :recipeId
     *   ORDER BY rating DESC, created_at DESC LIMIT 1;
     */
    @Query("SELECT cl FROM CookingLog cl WHERE cl.recipe = :recipe ORDER BY cl.rating DESC, cl.createdAt DESC")
    List<CookingLog> findBestByRecipe(@Param("recipe") Recipe recipe, Pageable pageable);

    /**
     * 해당 레시피의 최근 요리 기록 N개
     * Raw SQL:
     *   SELECT * FROM cooking_logs WHERE recipe_id = :recipeId
     *   ORDER BY created_at DESC LIMIT :n;
     */
    @Query("SELECT cl FROM CookingLog cl WHERE cl.recipe = :recipe ORDER BY cl.createdAt DESC")
    List<CookingLog> findRecentByRecipe(@Param("recipe") Recipe recipe, Pageable pageable);

    /**
     * 해당 레시피의 재료별 사용 횟수 및 평균 평점 (사용 횟수 내림차순)
     * Raw SQL:
     *   SELECT i.name AS ingredient_name,
     *          COUNT(cli.id) AS use_count,
     *          AVG(cl.rating) AS average_rating
     *   FROM cooking_log_ingredients cli
     *   JOIN ingredients i ON cli.ingredient_id = i.id
     *   JOIN cooking_logs cl ON cli.cooking_log_id = cl.id
     *   WHERE cl.recipe_id = :recipeId
     *   GROUP BY i.id, i.name
     *   ORDER BY use_count DESC;
     */
    @Query("SELECT i.name AS ingredientName, COUNT(cli.id) AS useCount, AVG(cl.rating) AS averageRating " +
           "FROM CookingLogIngredient cli " +
           "JOIN cli.ingredient i " +
           "JOIN cli.cookingLog cl " +
           "WHERE cl.recipe = :recipe " +
           "GROUP BY i.id, i.name " +
           "ORDER BY COUNT(cli.id) DESC")
    List<IngredientStatProjection> findIngredientStats(@Param("recipe") Recipe recipe);

    /**
     * 해당 레시피의 시간대별 요리 횟수 및 평균 평점
     * Raw SQL:
     *   SELECT time_slot, COUNT(*) AS count, AVG(rating) AS average_rating
     *   FROM cooking_logs WHERE recipe_id = :recipeId
     *   GROUP BY time_slot ORDER BY count DESC;
     */
    @Query("SELECT cl.timeSlot AS timeSlot, COUNT(cl.id) AS count, AVG(cl.rating) AS averageRating " +
           "FROM CookingLog cl " +
           "WHERE cl.recipe = :recipe " +
           "GROUP BY cl.timeSlot " +
           "ORDER BY COUNT(cl.id) DESC")
    List<TimeSlotStatProjection> findTimeSlotStats(@Param("recipe") Recipe recipe);

    // ──────────────── 대시보드 ────────────────

    /**
     * 해당 유저의 전체 요리 횟수
     * Raw SQL:
     *   SELECT COUNT(*) FROM cooking_logs cl
     *   JOIN recipes r ON cl.recipe_id = r.id
     *   JOIN users u ON r.user_id = u.id WHERE u.email = :email;
     */
    @Query("SELECT COUNT(cl.id) FROM CookingLog cl WHERE cl.recipe.user.email = :email")
    long countByUserEmail(@Param("email") String email);

    /**
     * 해당 유저의 전체 평균 평점
     * Raw SQL:
     *   SELECT COALESCE(AVG(cl.rating), 0) FROM cooking_logs cl
     *   JOIN recipes r ON cl.recipe_id = r.id WHERE r.user_id = (SELECT id FROM users WHERE email = :email);
     */
    @Query("SELECT COALESCE(AVG(cl.rating), 0.0) FROM CookingLog cl WHERE cl.recipe.user.email = :email")
    double findAverageRatingByUserEmail(@Param("email") String email);

    /**
     * 해당 유저의 최근 요리 기록 N개
     * Raw SQL:
     *   SELECT cl.* FROM cooking_logs cl
     *   JOIN recipes r ON cl.recipe_id = r.id
     *   WHERE r.user_id = (SELECT id FROM users WHERE email = :email)
     *   ORDER BY cl.created_at DESC LIMIT :n;
     */
    @Query("SELECT cl FROM CookingLog cl WHERE cl.recipe.user.email = :email ORDER BY cl.createdAt DESC")
    List<CookingLog> findRecentByUserEmail(@Param("email") String email, Pageable pageable);

    /**
     * 날짜별 요리 횟수 (cookedAt 기준, null 제외)
     * Raw SQL:
     *   SELECT cl.cooked_at AS date, COUNT(*) AS count
     *   FROM cooking_logs cl JOIN recipes r ON cl.recipe_id = r.id
     *   WHERE r.user_id = (SELECT id FROM users WHERE email = :email) AND cl.cooked_at IS NOT NULL
     *   GROUP BY cl.cooked_at ORDER BY cl.cooked_at DESC;
     */
    @Query("SELECT cl.cookedAt AS date, COUNT(cl.id) AS count " +
           "FROM CookingLog cl " +
           "WHERE cl.recipe.user.email = :email AND cl.cookedAt IS NOT NULL " +
           "GROUP BY cl.cookedAt " +
           "ORDER BY cl.cookedAt DESC")
    List<CalendarProjection> findCalendarData(@Param("email") String email);
}
