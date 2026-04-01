package com.kudip.recipe;

import com.kudip.config.JpaConfig;
import com.kudip.cookinglog.*;
import com.kudip.ingredient.Ingredient;
import com.kudip.recipe.dto.IngredientStatItem;
import com.kudip.recipe.dto.RecipeStatsResponse;
import com.kudip.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(JpaConfig.class)
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=PostgreSQL",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class RecipeStatsServiceTest {

    @Autowired TestEntityManager em;
    @Autowired RecipeRepository recipeRepository;
    @Autowired CookingLogRepository cookingLogRepository;

    private RecipeStatsService recipeStatsService;
    private Recipe recipe;

    @BeforeEach
    void setUp() {
        recipeStatsService = new RecipeStatsService(recipeRepository, cookingLogRepository);

        User user = em.persistAndFlush(User.builder()
                .email("stats@example.com")
                .nickname("테스터")
                .passwordHash("hash")
                .build());

        recipe = em.persistAndFlush(Recipe.builder()
                .user(user)
                .name("김치찌개")
                .category(RecipeCategory.KOREAN)
                .build());

        Ingredient pork = em.persistAndFlush(Ingredient.builder().name("돼지고기").build());
        Ingredient kimchi = em.persistAndFlush(Ingredient.builder().name("김치").build());

        // 기록1: rating=5, DINNER, 재료=[돼지고기, 김치]
        CookingLog log1 = CookingLog.builder()
                .recipe(recipe).cookedAt(LocalDate.now())
                .timeSlot(TimeSlot.DINNER).rating(5).build();
        em.persist(log1);
        em.persist(CookingLogIngredient.builder().cookingLog(log1).ingredient(pork).build());
        em.persist(CookingLogIngredient.builder().cookingLog(log1).ingredient(kimchi).build());

        // 기록2: rating=3, DINNER, 재료=[돼지고기]
        CookingLog log2 = CookingLog.builder()
                .recipe(recipe).cookedAt(LocalDate.now())
                .timeSlot(TimeSlot.DINNER).rating(3).build();
        em.persist(log2);
        em.persist(CookingLogIngredient.builder().cookingLog(log2).ingredient(pork).build());

        // 기록3: rating=4, LUNCH, 재료=[김치]
        CookingLog log3 = CookingLog.builder()
                .recipe(recipe).cookedAt(LocalDate.now())
                .timeSlot(TimeSlot.LUNCH).rating(4).build();
        em.persist(log3);
        em.persist(CookingLogIngredient.builder().cookingLog(log3).ingredient(kimchi).build());

        em.flush();
        em.clear();
    }

    @Test
    void 총_요리_횟수와_평균_평점() {
        // when
        long totalCount = cookingLogRepository.countByRecipe(recipe);
        double averageRating = cookingLogRepository.findAverageRatingByRecipe(recipe);

        // then
        assertThat(totalCount).isEqualTo(3);
        assertThat(averageRating).isEqualTo(4.0); // (5+3+4)/3
    }

    @Test
    void 재료별_통계_정확성() {
        // when
        RecipeStatsResponse response = recipeStatsService.getStats("stats@example.com", recipe.getId());

        // then
        assertThat(response.getIngredientStats()).hasSize(2);

        // 돼지고기: 2회 사용, 평균 평점 4.0 ((5+3)/2)
        IngredientStatItem porkStat = response.getIngredientStats().stream()
                .filter(s -> s.getIngredientName().equals("돼지고기"))
                .findFirst().orElseThrow();
        assertThat(porkStat.getUseCount()).isEqualTo(2);
        assertThat(porkStat.getAverageRating()).isEqualTo(4.0);

        // 김치: 2회 사용, 평균 평점 4.5 ((5+4)/2)
        IngredientStatItem kimchiStat = response.getIngredientStats().stream()
                .filter(s -> s.getIngredientName().equals("김치"))
                .findFirst().orElseThrow();
        assertThat(kimchiStat.getUseCount()).isEqualTo(2);
        assertThat(kimchiStat.getAverageRating()).isEqualTo(4.5);
    }

    @Test
    void 시간대별_통계_정확성() {
        // when
        RecipeStatsResponse response = recipeStatsService.getStats("stats@example.com", recipe.getId());

        // then
        assertThat(response.getTimeSlotStats()).hasSize(2);

        var dinnerStat = response.getTimeSlotStats().stream()
                .filter(s -> s.getTimeSlot() == TimeSlot.DINNER)
                .findFirst().orElseThrow();
        assertThat(dinnerStat.getCount()).isEqualTo(2);
        assertThat(dinnerStat.getAverageRating()).isEqualTo(4.0); // (5+3)/2

        var lunchStat = response.getTimeSlotStats().stream()
                .filter(s -> s.getTimeSlot() == TimeSlot.LUNCH)
                .findFirst().orElseThrow();
        assertThat(lunchStat.getCount()).isEqualTo(1);
        assertThat(lunchStat.getAverageRating()).isEqualTo(4.0);
    }
}
