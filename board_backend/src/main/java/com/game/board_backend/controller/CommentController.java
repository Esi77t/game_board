package com.game.board_backend.controller;

import com.game.board_backend.dto.CommentDto;
import com.game.board_backend.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards/{boardId}/comments")
public class CommentController {

    private final CommentService commentService;

    /**
     * 댓글 쓰기
     * POST /api/boards/{boardId}/comments
     * Authorization: Bearer {token}
     */
    @PostMapping
    public ResponseEntity<CommentDto.Response> createComment(
            @PathVariable Long boardId,
            @Valid @RequestBody CommentDto.Create dto,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        CommentDto.Response response = commentService.createComment(boardId, dto, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 댓글 목록 조회
     * GET /api/boards/{boardId}/comments
     */
    @GetMapping
    public ResponseEntity<List<CommentDto.Response>> getComments(@PathVariable Long boardId) {
        List<CommentDto.Response> responses = commentService.getCommentsByBoardId(boardId);
        return ResponseEntity.ok(responses);
    }

    /**
     * 댓글 수정
     * PUT /api/boards/{boardId}/comments/{commentId}
     * Authorization: Bearer {token}
     */
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto.Response> updateComment(
            @PathVariable Long boardId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentDto.Update dto,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        CommentDto.Response response = commentService.updateComment(commentId, dto, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * 댓글 삭제
     * DELETE /api/boards/{boardId}/comments/{commentId}
     * Authorization: Bearer {token}
     */
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long boardId,
            @PathVariable Long commentId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }
}
