package com.kudip.auth;

import com.kudip.auth.dto.LoginRequest;
import com.kudip.auth.dto.SignupRequest;
import com.kudip.auth.jwt.JwtProvider;
import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.user.User;
import com.kudip.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtProvider jwtProvider;

    @InjectMocks AuthService authService;

    @Test
    void 회원가입_성공() {
        // given
        SignupRequest request = new SignupRequest();
        ReflectionTestUtils.setField(request, "email", "test@example.com");
        ReflectionTestUtils.setField(request, "nickname", "테스터");
        ReflectionTestUtils.setField(request, "password", "password123");

        User saved = User.builder()
                .email("test@example.com")
                .nickname("테스터")
                .passwordHash("$2a$encodedPw")
                .build();

        given(userRepository.existsByEmail("test@example.com")).willReturn(false);
        given(passwordEncoder.encode("password123")).willReturn("$2a$encodedPw");
        given(userRepository.save(any(User.class))).willReturn(saved);

        // when
        var response = authService.signup(request);

        // then
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getNickname()).isEqualTo("테스터");
    }

    @Test
    void 이메일_중복이면_DUPLICATE_EMAIL_예외() {
        // given
        SignupRequest request = new SignupRequest();
        ReflectionTestUtils.setField(request, "email", "dup@example.com");
        ReflectionTestUtils.setField(request, "nickname", "테스터");
        ReflectionTestUtils.setField(request, "password", "password123");

        given(userRepository.existsByEmail("dup@example.com")).willReturn(true);

        // when & then
        CustomException ex = assertThrows(CustomException.class, () -> authService.signup(request));
        assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.DUPLICATE_EMAIL);
    }

    @Test
    void 로그인_성공() {
        // given
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "email", "test@example.com");
        ReflectionTestUtils.setField(request, "password", "password123");

        User user = User.builder()
                .email("test@example.com")
                .nickname("테스터")
                .passwordHash("$2a$encodedPw")
                .build();
        ReflectionTestUtils.setField(user, "id", 1L);

        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("password123", "$2a$encodedPw")).willReturn(true);
        given(jwtProvider.generateToken(1L, "test@example.com")).willReturn("jwt.token.value");

        // when
        var response = authService.login(request);

        // then
        assertThat(response.getAccessToken()).isEqualTo("jwt.token.value");
        assertThat(response.getNickname()).isEqualTo("테스터");
    }

    @Test
    void 비밀번호_틀리면_UNAUTHORIZED_예외() {
        // given
        LoginRequest request = new LoginRequest();
        ReflectionTestUtils.setField(request, "email", "test@example.com");
        ReflectionTestUtils.setField(request, "password", "wrongPass");

        User user = User.builder()
                .email("test@example.com")
                .nickname("테스터")
                .passwordHash("$2a$encodedPw")
                .build();

        given(userRepository.findByEmail("test@example.com")).willReturn(Optional.of(user));
        given(passwordEncoder.matches("wrongPass", "$2a$encodedPw")).willReturn(false);

        // when & then
        CustomException ex = assertThrows(CustomException.class, () -> authService.login(request));
        assertThat(ex.getErrorCode()).isEqualTo(ErrorCode.UNAUTHORIZED);
    }
}
