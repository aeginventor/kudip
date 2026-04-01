package com.kudip.cookinglog;

import com.kudip.common.response.ApiResponse;
import com.kudip.cookinglog.dto.CreateCookingLogRequest;
import com.kudip.cookinglog.dto.CookingLogResponse;
import com.kudip.cookinglog.dto.UpdateCookingLogRequest;
import com.kudip.recipe.RecipeCategory;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class CookingLogController {

    private final CookingLogService cookingLogService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CookingLogResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateCookingLogRequest request) {
        return ApiResponse.ok(cookingLogService.create(userDetails.getUsername(), request));
    }

    @GetMapping
    public ApiResponse<List<CookingLogResponse>> getList(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long recipeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) RecipeCategory category,
            @RequestParam(required = false) Integer minRating) {
        return ApiResponse.ok(cookingLogService.getList(
                userDetails.getUsername(), recipeId, startDate, endDate, category, minRating));
    }

    @GetMapping("/{id}")
    public ApiResponse<CookingLogResponse> getOne(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ApiResponse.ok(cookingLogService.getOne(userDetails.getUsername(), id));
    }

    @PutMapping("/{id}")
    public ApiResponse<CookingLogResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCookingLogRequest request) {
        return ApiResponse.ok(cookingLogService.update(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        cookingLogService.delete(userDetails.getUsername(), id);
    }
}
