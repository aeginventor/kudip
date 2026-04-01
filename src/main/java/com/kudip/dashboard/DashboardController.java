package com.kudip.dashboard;

import com.kudip.common.response.ApiResponse;
import com.kudip.dashboard.dto.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ApiResponse<DashboardResponse> getDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.ok(dashboardService.getDashboard(userDetails.getUsername()));
    }
}
