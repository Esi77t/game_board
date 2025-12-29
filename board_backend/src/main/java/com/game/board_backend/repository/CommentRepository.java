package com.game.board_backend.repository;

import com.game.board_backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 특정 게시글의 댓글 목록 (최신순)
    List<Comment> findByBoardIdOrderByCreatedAtDesc(Long boardId);

    // 특정 게시글의 댓글 목록 (오래된순)
    List<Comment> findByBoardIdOrderByCreatedAtAsc(Long boardId);

    // 특정 유저가 작성한 댓글 목록
    List<Comment> findByUserId(Long userId);

    // 특정 게시글의 댓글 개수
    long countByBoardId(Long boardId);

    // 특정 게시글의 댓글 삭제
    void deleteByBoardId(Long boardId);
}
