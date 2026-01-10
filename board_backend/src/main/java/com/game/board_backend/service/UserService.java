package com.game.board_backend.service;

import com.game.board_backend.dto.AuthResponse;
import com.game.board_backend.dto.UserDto;
import com.game.board_backend.model.User;
import com.game.board_backend.model.UserRole;
import com.game.board_backend.repository.UserRepository;
import com.game.board_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final FileStorageService fileStorageService;

    // 회원가입
    @Transactional
    public UserDto.Response signUp(UserDto.SignUp dto) {
        // 아이디 중복체크
        if (userRepository.existsByUserId(dto.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        // 이메일 중복체크
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 닉네임 중복체크
        if (userRepository.existsByNickname(dto.getNickname())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        // User 엔티티 생성
        User user = new User();
        user.setUserId(dto.getUserId());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));    // 비밀번호 암호화
        user.setEmail(dto.getEmail());
        user.setNickname(dto.getNickname());
        user.setRole(UserRole.USER);

        User savedUser = userRepository.saveAndFlush(user);
        return new UserDto.Response(savedUser);
    }

    // 로그인
    public AuthResponse login(UserDto.Login dto) {
        // 사용자 조회
        User user = userRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        // 비밀번호 검증
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(user.getId(), user.getUserId());

        return new AuthResponse(token, new UserDto.Response(user));
    }

    // 유저 정보 조회
    public UserDto.Response getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        return new UserDto.Response(user);
    }

    // 프로필 수정
    @Transactional
    public UserDto.Response updateProfile(Long userId, UserDto.Update dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 닉네임 변경 시 중복체크
        if (dto.getNickname() != null && !dto.getNickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(dto.getNickname())) {
                throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
            }
            user.setNickname(dto.getNickname());
        }

        // 이메일 변경 시 중복체크
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
            }
            user.setEmail(dto.getEmail());
        }

        // 프로필 이미지 변경
        if (dto.getProfileImageUrl() != null) {
            user.setProfileImageUrl(dto.getProfileImageUrl());
        }

        return new UserDto.Response(user);
    }

    // 프로필 이미지 수정
    @Transactional
    public UserDto.ProfileImageResponse uploadProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 기존 프로필 이미지 삭제
        if (user.getProfileImageUrl() != null) {
            fileStorageService.deleteFile(user.getProfileImageUrl());
        }

        // 새 이미지 저장
        String imageUrl = fileStorageService.storeFile(file, "profiles");
        user.setProfileImageUrl(imageUrl);

        return new UserDto.ProfileImageResponse(imageUrl);
    }

    // 프로필 이미지 삭제
    @Transactional
    public void deleteProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (user.getProfileImageUrl() != null) {
            fileStorageService.deleteFile(user.getProfileImageUrl());
            user.setProfileImageUrl(null);
        }
    }

    // 비밀번호 삭제
    @Transactional
    public void changePassword(Long userId, UserDto.PasswordChange dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 올바르지 않습니다.");
        }

        // 새 비밀번호와 현재 비밀번호가 같은지 확인
        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
        }

        // 비밀번호 변경
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }

    // 회원 탈퇴
    @Transactional
    public void deleteAccount(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 프로필 이미지 삭제
        if (user.getProfileImageUrl() != null) {
            fileStorageService.deleteFile(user.getProfileImageUrl());
        }

        // 회원 삭제 (게시글과 댓글은 CASCADE로 자동 삭제)
        userRepository.delete(user);
    }
}
