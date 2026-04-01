package com.kudip.auth.dto;

import com.kudip.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
@Schema(description = "회원가입 응답")
public class SignupResponse {

    @Schema(description = "생성된 사용자 ID", example = "1")
    private final Long userId;

    @Schema(description = "이메일", example = "user@example.com")
    private final String email;

    @Schema(description = "닉네임", example = "요리왕")
    private final String nickname;

    public SignupResponse(User user) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
    }
}
