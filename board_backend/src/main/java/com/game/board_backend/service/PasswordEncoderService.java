package com.game.board_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordEncoderService {

    private final PasswordEncoder passwordEncoder;

    // 비밀번호 암호화
    public String encode(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * 비밀번호 일치 여부 확인
     * @param rawPassword 입력된 평문 비밀번호
     * @param encodedPassword DB에 저장된 암호화된 비밀번호
     * @return 일치 여부
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
