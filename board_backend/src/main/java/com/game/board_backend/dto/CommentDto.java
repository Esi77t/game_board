package com.game.board_backend.dto;

import com.game.board_backend.model.Comment;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class CommentDto {
    // 댓글 작성 요청
    @Getter
    @Setter
    public static class Create {
        @NotBlank(message = "댓글 내용은 필수입니다.")
        private String content;
        
        // 댓글 이미지
        private List<String> imageUrls;
    }

    // 댓글 수정 요청
    @Getter
    @Setter
    public static class Update {
        @NotBlank(message = "댓글 내용은 필수입니다.")
        private String content;

        private List<String> imageUrls;
    }

    // 댓글 조회 응답
    @Getter
    public static class Response {
        private final Long commentId;
        private final String content;
        private final String authorNickname;
        private final String authorProfileImageUrl;
        private final List<ImageInfo> images;
        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(Comment comment, List<ImageInfo> images) {
            this.commentId = comment.getCommentId();
            this.content = comment.getContent();
            this.authorNickname = comment.getUser().getNickname();
            this.authorProfileImageUrl = comment.getUser().getProfileImageUrl();
            this.images = images;
            this.createdAt = comment.getCreatedAt();
            this.updatedAt = comment.getUpdatedAt();
        }
    }

    // 이미지 정보
    public record ImageInfo(
            Long id,
            String imageUrl,
            String originalFileName,
            Integer orderIndex
    ) { }
}
