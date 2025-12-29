package com.game.board_backend.repository;

import com.game.board_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 아이디로 유저 찾기
    Optional<User> findByUserId(String userId);

    // 이메일로 유저 찾기
    Optional<User> findByEmail(String email);

    // 아이디 중복 체크
    boolean existsByUserId(String userId);

    // 이메일 중복 체크
    boolean existsByEmail(String email);

    // 닉네임 중복 체크
    boolean existsByNickname(String nickname);
}
