package com.kudip.cookinglog;

import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.cookinglog.dto.*;
import com.kudip.ingredient.Ingredient;
import com.kudip.ingredient.IngredientService;
import com.kudip.recipe.Recipe;
import com.kudip.recipe.RecipeRepository;
import com.kudip.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CookingLogService {

    private final CookingLogRepository cookingLogRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final IngredientService ingredientService;

    @Transactional
    public CookingLogResponse create(String email, CreateCookingLogRequest request) {
        Recipe recipe = recipeRepository.findById(request.getRecipeId())
                .orElseThrow(() -> new CustomException(ErrorCode.RECIPE_NOT_FOUND));

        if (!recipe.getUser().getEmail().equals(email)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        CookingLog log = CookingLog.builder()
                .recipe(recipe)
                .cookedAt(request.getCookedAt())
                .timeSlot(request.getTimeSlot())
                .cookTimeMinutes(request.getCookTimeMinutes())
                .recipeMemo(request.getRecipeMemo())
                .processMemo(request.getProcessMemo())
                .rating(request.getRating())
                .diary(request.getDiary())
                .build();

        cookingLogRepository.save(log);
        attachIngredients(log, request.getIngredients());

        return CookingLogResponse.from(log);
    }

    @Transactional(readOnly = true)
    public CookingLogResponse getOne(String email, Long logId) {
        CookingLog log = findLog(logId);
        checkOwner(log, email);
        return CookingLogResponse.from(log);
    }

    @Transactional
    public CookingLogResponse update(String email, Long logId, UpdateCookingLogRequest request) {
        CookingLog log = findLog(logId);
        checkOwner(log, email);

        log.update(request.getCookedAt(), request.getTimeSlot(), request.getCookTimeMinutes(),
                request.getRecipeMemo(), request.getProcessMemo(), request.getRating(), request.getDiary());

        log.getIngredients().clear();
        attachIngredients(log, request.getIngredients());

        return CookingLogResponse.from(log);
    }

    @Transactional
    public void delete(String email, Long logId) {
        CookingLog log = findLog(logId);
        checkOwner(log, email);
        cookingLogRepository.delete(log);
    }

    void attachIngredients(CookingLog log, List<IngredientRequest> items) {
        if (items == null || items.isEmpty()) return;
        for (IngredientRequest item : items) {
            Ingredient ingredient = ingredientService.findOrCreate(item.getName());
            log.getIngredients().add(
                    CookingLogIngredient.builder()
                            .cookingLog(log)
                            .ingredient(ingredient)
                            .quantity(item.getQuantity())
                            .build()
            );
        }
    }

    CookingLog findLog(Long logId) {
        return cookingLogRepository.findById(logId)
                .orElseThrow(() -> new CustomException(ErrorCode.COOKING_LOG_NOT_FOUND));
    }

    void checkOwner(CookingLog log, String email) {
        if (!log.getRecipe().getUser().getEmail().equals(email)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }
}
