package com.kudip.cookinglog;

import com.kudip.common.response.ApiResponse;
import com.kudip.cookinglog.dto.CreateCookingLogRequest;
import com.kudip.cookinglog.dto.CookingLogResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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
}
