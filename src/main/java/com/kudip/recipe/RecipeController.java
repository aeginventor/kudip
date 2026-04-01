package com.kudip.recipe;

import com.kudip.common.response.ApiResponse;
import com.kudip.recipe.dto.CreateRecipeRequest;
import com.kudip.recipe.dto.RecipeResponse;
import com.kudip.recipe.dto.UpdateRecipeRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping
    public ApiResponse<List<RecipeResponse>> getMyRecipes(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.ok(recipeService.getMyRecipes(userDetails.getUsername()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RecipeResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateRecipeRequest request) {
        return ApiResponse.ok(recipeService.create(userDetails.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ApiResponse<RecipeResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateRecipeRequest request) {
        return ApiResponse.ok(recipeService.update(id, userDetails.getUsername(), request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        recipeService.delete(id, userDetails.getUsername());
    }
}
