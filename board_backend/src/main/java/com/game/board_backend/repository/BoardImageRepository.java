package com.game.board_backend.repository;

import com.game.board_backend.model.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {
    // 특정 게시글의 이미지 목록 (순서대로)
    List<BoardImage> findByBoardIdOrderByOrderIndexAsc(Long boardId);

    // 특정 게시글의 첫 번째 이미지 (썸네일용)
    BoardImage findFirstByBoardIdOrderByOrderIndexAsc(Long boardId);

    // 특정 게시글의 이미지 삭제
    void deleteByBoardId(Long boardId);
}
