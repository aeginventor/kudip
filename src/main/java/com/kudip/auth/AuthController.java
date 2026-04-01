package com.kudip.auth;

import com.kudip.auth.dto.LoginRequest;
import com.kudip.auth.dto.LoginResponse;
import com.kudip.auth.dto.SignupRequest;
import com.kudip.auth.dto.SignupResponse;
import com.kudip.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /*
     * [Supabase 회원가입 확인]
     * curl -X POST http://localhost:8080/api/auth/signup \
     *   -H "Content-Type: application/json" \
     *   -d '{"email":"test@example.com","nickname":"tester","password":"password123"}'
     * → Supabase Table Editor > users 테이블에서 삽입된 행 확인
     */
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SignupResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ApiResponse.ok(authService.signup(request));
    }

    /*
     * [Supabase 로그인 확인]
     * curl -X POST http://localhost:8080/api/auth/login \
     *   -H "Content-Type: application/json" \
     *   -d '{"email":"test@example.com","password":"password123"}'
     * → 응답의 accessToken 값을 복사해 jwt.io에서 디코딩하면 userId, email 확인 가능
     * → 이후 API 호출 시 Authorization: Bearer <accessToken> 헤더에 포함
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok(authService.login(request));
    }
}
