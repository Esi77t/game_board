package com.game.board_backend.repository;

import com.game.board_backend.model.BoardLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {
    // 특정 유저가 특정 게시글에 좋아요 했는지 확인
    boolean existsByBoardIdAndUserId(Long boardId, Long userId);

    // 특정 유저의 특정 게시글 좋아요 찾기
    Optional<BoardLike> findByBoardIdAndUserId(Long boardId, Long userId);

    // 특정 게시글의 좋아요 삭제
    void deleteByBoardId(Long boardId);

    // 특정 유저의 특정 게시글 좋아요 삭제
    void deleteByBoardIdAndUserId(Long boardId, Long userId);
}
