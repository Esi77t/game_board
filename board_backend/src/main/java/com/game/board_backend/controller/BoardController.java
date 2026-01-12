package com.game.board_backend.controller;

import com.game.board_backend.dto.BoardDto;
import com.game.board_backend.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    /**
     * 게시글 작성
     * POST /api/boards
     * Authorization: Bearer {token}
     */
    @PostMapping
    public ResponseEntity<BoardDto.Response> createBoard(
            @Valid @RequestBody BoardDto.Create dto,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        BoardDto.Response response = boardService.createBoard(dto, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 게시글 상세 조회
     * GET /api/boards/{boardId}
     * 인증 X (로그인 안해도 조회 가능)
     */
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardDto.Response> getBoard(
            @PathVariable Long boardId,
            Authentication authentication) {
        Long currentUserId = authentication != null ? (Long) authentication.getPrincipal() : null;
        BoardDto.Response response = boardService.getBoard(boardId, currentUserId);

        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 목록 조회 (페이징)
     * GET /api/boards?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<BoardDto.ListItem>> getBoardList(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        Page<BoardDto.ListItem> response = boardService.getBoardList(pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 검색
     * GET /api/boards/search?keyword=검색어&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<BoardDto.ListItem>> searchBoard(
            @RequestParam String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        Page<BoardDto.ListItem> response = boardService.searchBoards(keyword, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 수정
     * PUT /api/boards/{boardId}
     * Authorization: Bearer {token}
     */
    @PutMapping("/{boardId}")
    public ResponseEntity<BoardDto.Response> updateBoard(
            @PathVariable Long boardId,
            @Valid @RequestBody BoardDto.Update dto,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        BoardDto.Response response = boardService.updateBoard(boardId, dto, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 삭제
     * DELETE /api/boards/{boardId}
     * Authorization: Bearer {token}
     */
    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable Long boardId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        boardService.deleteBoard(boardId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * 좋아요 토글
     * POST /api/boards/{boardId}/like
     * Authorization: Bearer {token}
     */
    @PostMapping("/{boardId}/like")
    public ResponseEntity<Boolean> toggleLike(
            @PathVariable Long boardId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        boolean isLiked = boardService.toggleLike(boardId, userId);
        return ResponseEntity.ok(isLiked);
    }

    /**
     * 카테고리별 조회
     * GET /api/boards/category/{categoryId}?page=0&size=10
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<BoardDto.ListItem>> getBoardsByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        Page<BoardDto.ListItem> response = boardService.getBoardsByCategory(categoryId, pageable);
        return ResponseEntity.ok(response);
    }
}
