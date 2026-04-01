package com.kudip.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
@Schema(description = "로그인 응답")
public class LoginResponse {

    @Schema(description = "JWT accessToken — 이후 요청의 Authorization 헤더에 Bearer {token} 형식으로 포함", example = "eyJhbGci...")
    private final String accessToken;

    @Schema(description = "닉네임", example = "요리왕")
    private final String nickname;
}
