package com.game.board_backend.repository;

import com.game.board_backend.model.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    // 특정 유저가 작성한 게시글 목록
    List<Board> findByUserId(Long userId);

    // 특정 유저가 작성한 게시글 목록 (페이징)
    Page<Board> findByUserId(Long userId, Pageable pageable);

    // 최신순 정렬 (페이징)
    Page<Board> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // 조회수 높은 순 (페이징)
    Page<Board> findAllByOrderByViewCountDesc(Pageable pageable);

    // 좋아요 많은 순 (페이징)
    Page<Board> findAllByOrderByLikeCountDesc(Pageable pageable);

    // 제목으로 검색 (페이징)
    Page<Board> findByTitleContaining(String keyword, Pageable pageable);

    // 내용으로 검색 (페이징)
    Page<Board> findByContentContaining(String keyword, Pageable pageable);

    // 제목 + 내용 검색 (페이징)
    @Query("SELECT b FROM Board b WHERE b.title LIKE %:keyword% OR b.content LIKE %:keyword%")
    Page<Board> searchByTitleOrContent(@Param("keyword") String keyword, Pageable pageable);

    // 카테고리 별 게시글 목록 (페이징)
    Page<Board> findByCategoryInOrderByCreatedAtDesc(Long categoryId, Pageable pageable);

    // 카테고리 별 게시글 개수
    long countByCategoryId(Long categoryId);
}
