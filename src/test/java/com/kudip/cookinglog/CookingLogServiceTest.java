package com.kudip.cookinglog;

import com.kudip.cookinglog.dto.IngredientRequest;
import com.kudip.cookinglog.dto.UpdateCookingLogRequest;
import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.ingredient.Ingredient;
import com.kudip.ingredient.IngredientService;
import com.kudip.recipe.Recipe;
import com.kudip.recipe.RecipeCategory;
import com.kudip.recipe.RecipeRepository;
import com.kudip.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class CookingLogServiceTest {

    @Mock private CookingLogRepository cookingLogRepository;
    @Mock private RecipeRepository recipeRepository;
    @Mock private IngredientService ingredientService;

    @InjectMocks private CookingLogService cookingLogService;

    private User makeUser(String email) {
        User user = User.builder()
                .email(email)
                .nickname("테스터")
                .passwordHash("hash")
                .build();
        ReflectionTestUtils.setField(user, "id", 1L);
        return user;
    }

    private Recipe makeRecipe(User user) {
        Recipe recipe = Recipe.builder()
                .user(user)
                .name("김치찌개")
                .category(RecipeCategory.KOREAN)
                .build();
        ReflectionTestUtils.setField(recipe, "id", 1L);
        return recipe;
    }

    private CookingLog makeLog(Recipe recipe) {
        CookingLog log = CookingLog.builder()
                .recipe(recipe)
                .cookedAt(LocalDate.now())
                .timeSlot(TimeSlot.DINNER)
                .rating(4)
                .build();
        ReflectionTestUtils.setField(log, "id", 1L);
        return log;
    }

    @Test
    void 재료_find_or_create_기존_재료_재사용() {
        // given
        User user = makeUser("user@example.com");
        Recipe recipe = makeRecipe(user);
        CookingLog log = makeLog(recipe);

        Ingredient existing = Ingredient.builder().name("돼지고기").build();
        given(ingredientService.findOrCreate("돼지고기")).willReturn(existing);

        IngredientRequest item = new IngredientRequest();
        ReflectionTestUtils.setField(item, "name", "돼지고기");
        ReflectionTestUtils.setField(item, "quantity", "200g");

        // when
        cookingLogService.attachIngredients(log, List.of(item));

        // then
        assertThat(log.getIngredients()).hasSize(1);
        assertThat(log.getIngredients().get(0).getIngredient()).isEqualTo(existing);
        assertThat(log.getIngredients().get(0).getQuantity()).isEqualTo("200g");
        verify(ingredientService, times(1)).findOrCreate("돼지고기");
    }

    @Test
    void 재료_여러_개_각각_find_or_create_호출() {
        // given
        User user = makeUser("user@example.com");
        Recipe recipe = makeRecipe(user);
        CookingLog log = makeLog(recipe);

        Ingredient pork = Ingredient.builder().name("돼지고기").build();
        Ingredient kimchi = Ingredient.builder().name("김치").build();

        given(ingredientService.findOrCreate("돼지고기")).willReturn(pork);
        given(ingredientService.findOrCreate("김치")).willReturn(kimchi);

        IngredientRequest item1 = new IngredientRequest();
        ReflectionTestUtils.setField(item1, "name", "돼지고기");
        ReflectionTestUtils.setField(item1, "quantity", "200g");

        IngredientRequest item2 = new IngredientRequest();
        ReflectionTestUtils.setField(item2, "name", "김치");
        ReflectionTestUtils.setField(item2, "quantity", "100g");

        // when
        cookingLogService.attachIngredients(log, List.of(item1, item2));

        // then
        assertThat(log.getIngredients()).hasSize(2);
        verify(ingredientService, times(2)).findOrCreate(anyString());
    }

    @Test
    void 요리기록_수정_시_재료_clear_후_재삽입() {
        // given
        User user = makeUser("user@example.com");
        Recipe recipe = makeRecipe(user);
        CookingLog log = makeLog(recipe);

        // 기존 재료 1개 추가
        Ingredient pork = Ingredient.builder().name("돼지고기").build();
        log.getIngredients().add(CookingLogIngredient.builder()
                .cookingLog(log).ingredient(pork).quantity("200g").build());

        UpdateCookingLogRequest request = new UpdateCookingLogRequest();
        ReflectionTestUtils.setField(request, "cookedAt", LocalDate.now());
        ReflectionTestUtils.setField(request, "timeSlot", TimeSlot.LUNCH);
        ReflectionTestUtils.setField(request, "rating", 5);

        IngredientRequest newItem = new IngredientRequest();
        ReflectionTestUtils.setField(newItem, "name", "두부");
        ReflectionTestUtils.setField(newItem, "quantity", "1모");
        ReflectionTestUtils.setField(request, "ingredients", List.of(newItem));

        Ingredient tofu = Ingredient.builder().name("두부").build();
        given(cookingLogRepository.findById(1L)).willReturn(Optional.of(log));
        given(ingredientService.findOrCreate("두부")).willReturn(tofu);

        // when
        cookingLogService.update("user@example.com", 1L, request);

        // then
        assertThat(log.getIngredients()).hasSize(1);
        assertThat(log.getIngredients().get(0).getIngredient().getName()).isEqualTo("두부");
    }

    @Test
    void 타인_요리기록_조회_시_FORBIDDEN_예외() {
        // given
        User owner = makeUser("owner@example.com");
        Recipe recipe = makeRecipe(owner);
        CookingLog log = makeLog(recipe);

        given(cookingLogRepository.findById(1L)).willReturn(Optional.of(log));

        // when & then
        assertThatThrownBy(() -> cookingLogService.getOne("other@example.com", 1L))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(ErrorCode.FORBIDDEN));
    }
}
