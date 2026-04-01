package com.kudip.auth;

import com.kudip.auth.dto.LoginRequest;
import com.kudip.auth.dto.LoginResponse;
import com.kudip.auth.dto.SignupRequest;
import com.kudip.auth.dto.SignupResponse;
import com.kudip.auth.jwt.JwtProvider;
import com.kudip.common.exception.CustomException;
import com.kudip.common.exception.ErrorCode;
import com.kudip.user.User;
import com.kudip.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    /*
     * [Supabase 회원가입 확인 방법]
     * 1. POST /api/auth/signup 호출 후
     * 2. Supabase 웹 콘솔 → Table Editor → users 테이블 선택
     * 3. 방금 요청한 email, nickname 행이 추가되었는지 확인
     * 4. password_hash 컬럼 값이 "$2a$..." 형태로 BCrypt 해싱되어 있는지 확인
     */
    @Transactional
    public SignupResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        User user = User.builder()
                .email(request.getEmail())
                .nickname(request.getNickname())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        return new SignupResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        String token = jwtProvider.generateToken(user.getId(), user.getEmail());
        return new LoginResponse(token, user.getNickname());
    }
}
