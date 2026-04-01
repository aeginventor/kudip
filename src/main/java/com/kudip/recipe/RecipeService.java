package com.kudip.recipe;

import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.recipe.dto.CreateRecipeRequest;
import com.kudip.recipe.dto.RecipeResponse;
import com.kudip.recipe.dto.UpdateRecipeRequest;
import com.kudip.user.User;
import com.kudip.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RecipeResponse> getMyRecipes(String email) {
        User user = findUser(email);
        return recipeRepository.findRecipeListByUser(user).stream()
                .map(RecipeResponse::from)
                .toList();
    }

    @Transactional
    public RecipeResponse create(String email, CreateRecipeRequest request) {
        User user = findUser(email);

        if (recipeRepository.existsByUserAndName(user, request.getName())) {
            throw new CustomException(ErrorCode.DUPLICATE_RECIPE_NAME);
        }

        Recipe recipe = Recipe.builder()
                .user(user)
                .name(request.getName())
                .category(request.getCategory())
                .build();

        return RecipeResponse.from(recipeRepository.save(recipe));
    }

    @Transactional
    public RecipeResponse update(Long recipeId, String email, UpdateRecipeRequest request) {
        Recipe recipe = findRecipe(recipeId);
        checkOwner(recipe, email);

        if (!recipe.getName().equals(request.getName()) &&
                recipeRepository.existsByUserAndName(recipe.getUser(), request.getName())) {
            throw new CustomException(ErrorCode.DUPLICATE_RECIPE_NAME);
        }

        recipe.update(request.getName(), request.getCategory());
        return RecipeResponse.from(recipe);
    }

    @Transactional
    public void delete(Long recipeId, String email) {
        Recipe recipe = findRecipe(recipeId);
        checkOwner(recipe, email);
        recipeRepository.delete(recipe);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private Recipe findRecipe(Long recipeId) {
        return recipeRepository.findById(recipeId)
                .orElseThrow(() -> new CustomException(ErrorCode.RECIPE_NOT_FOUND));
    }

    private void checkOwner(Recipe recipe, String email) {
        if (!recipe.getUser().getEmail().equals(email)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }
}
