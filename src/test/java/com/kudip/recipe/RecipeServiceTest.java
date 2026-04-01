package com.kudip.recipe;

import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.recipe.dto.CreateRecipeRequest;
import com.kudip.user.User;
import com.kudip.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock private RecipeRepository recipeRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private RecipeService recipeService;

    private User makeUser(String email) {
        User user = User.builder()
                .email(email)
                .nickname("테스터")
                .passwordHash("hash")
                .build();
        ReflectionTestUtils.setField(user, "id", 1L);
        return user;
    }

    @Test
    void 레시피_생성_성공() {
        // given
        User user = makeUser("user@example.com");

        CreateRecipeRequest request = new CreateRecipeRequest();
        ReflectionTestUtils.setField(request, "name", "김치찌개");
        ReflectionTestUtils.setField(request, "category", RecipeCategory.KOREAN);

        Recipe saved = Recipe.builder()
                .user(user)
                .name("김치찌개")
                .category(RecipeCategory.KOREAN)
                .build();

        given(userRepository.findByEmail("user@example.com")).willReturn(Optional.of(user));
        given(recipeRepository.existsByUserAndName(user, "김치찌개")).willReturn(false);
        given(recipeRepository.save(any(Recipe.class))).willReturn(saved);

        // when
        var response = recipeService.create("user@example.com", request);

        // then
        assertThat(response.getName()).isEqualTo("김치찌개");
        assertThat(response.getCategory()).isEqualTo(RecipeCategory.KOREAN);
    }

    @Test
    void 레시피_생성_이름_중복_예외() {
        // given
        User user = makeUser("user@example.com");

        CreateRecipeRequest request = new CreateRecipeRequest();
        ReflectionTestUtils.setField(request, "name", "김치찌개");
        ReflectionTestUtils.setField(request, "category", RecipeCategory.KOREAN);

        given(userRepository.findByEmail("user@example.com")).willReturn(Optional.of(user));
        given(recipeRepository.existsByUserAndName(user, "김치찌개")).willReturn(true);

        // when & then
        assertThatThrownBy(() -> recipeService.create("user@example.com", request))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(ErrorCode.DUPLICATE_RECIPE_NAME));
    }

    @Test
    void 타인_레시피_삭제_시_FORBIDDEN_예외() {
        // given
        User owner = makeUser("owner@example.com");

        Recipe recipe = Recipe.builder()
                .user(owner)
                .name("된장찌개")
                .category(RecipeCategory.KOREAN)
                .build();
        ReflectionTestUtils.setField(recipe, "id", 10L);

        given(recipeRepository.findById(10L)).willReturn(Optional.of(recipe));

        // when & then
        assertThatThrownBy(() -> recipeService.delete(10L, "other@example.com"))
                .isInstanceOf(CustomException.class)
                .satisfies(e -> assertThat(((CustomException) e).getErrorCode())
                        .isEqualTo(ErrorCode.FORBIDDEN));
    }
}
