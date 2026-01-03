package com.game.board_backend.controller;

import com.game.board_backend.dto.AuthResponse;
import com.game.board_backend.dto.UserDto;
import com.game.board_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    /**
     * 회원가입
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<UserDto.Response> signUp(@Valid @RequestBody UserDto.SignUp dto) {
        UserDto.Response response = userService.signUp(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 로그인(JWT 토큰 반환)
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserDto.Login dto) {
        AuthResponse response = userService.login(dto);

        return ResponseEntity.ok(response);
    }

    /**
     * 유저 정보 조회
     * GET /api/auth/users/{userId}
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDto.Response> getUserById(@PathVariable Long userId) {
        UserDto.Response response = userService.getUserById(userId);

        return ResponseEntity.ok(response);
    }

    /**
     * 내 프로필 조회
     * GET /api/auth/me
     * Authorization : Bearer {token}
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto.Response> getMyProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        UserDto.Response response = userService.getUserById(userId);

        return ResponseEntity.ok(response);
    }

    /**
     * 프로필 수정
     * PUT /api/auth/me
     */
    @PutMapping("/me")
    public ResponseEntity<UserDto.Response> updateProfile(
            @Valid @RequestBody UserDto.Update dto,
            Authentication authentication
    ) {
        Long userId = (Long) authentication.getPrincipal();
        UserDto.Response response = userService.updateProfile(userId, dto);

        return ResponseEntity.ok(response);
    }
}
