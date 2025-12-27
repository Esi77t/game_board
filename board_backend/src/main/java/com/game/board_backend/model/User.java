package com.game.board_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    // 고유 생성 ID(PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 유저ID (이거로 로그인)
    @Column(unique = true, nullable = false, length = 50)
    private String userId;

    // BCrypt로 저장
    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 50)
    private String nickname;

    @Column(unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    // 유저 가입 날짜
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    // 프로필 이미지 저장용(주소로 저장해서 불러올 것)
    private String profileImageUrl;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
