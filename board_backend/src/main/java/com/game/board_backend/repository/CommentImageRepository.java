package com.game.board_backend.repository;

import com.game.board_backend.model.CommentImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentImageRepository extends JpaRepository<CommentImage, Long> {
    // 특정 댓글의 이미지 목록 (순서대로)
    List<CommentImage> findByCommentIdOrderByOrderIndexAsc(Long commentId);

    // 특정 댓글의 이미지 삭제
    void deleteByCommentId(Long commentId);
}
