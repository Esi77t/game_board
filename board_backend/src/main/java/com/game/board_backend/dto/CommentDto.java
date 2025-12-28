package com.game.board_backend.dto;

public class CommentDto {
    // 댓글 작성 요청

    // 댓글 수정 요청

    // 댓글 조회 응답

    // 이미지 정보
    public record ImageInfo(
            Long id,
            String imageUrl,
            String originalFileName,
            Integer orderIndex
    ) { }
}
