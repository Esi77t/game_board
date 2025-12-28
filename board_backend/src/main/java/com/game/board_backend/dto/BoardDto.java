package com.game.board_backend.dto;

import com.game.board_backend.model.Board;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class BoardDto {
    // 글쓰기
    @Getter
    @Setter
    public static class Create {
        @NotBlank
        @Size(max = 20)
        private String title;

        @NotBlank
        private String content;

        // 이미지 URL 목록 (프론트에서 이미 업로드 된 URL들)
        private List<String> imageUrls;
    }

    // 수정하기
    @Getter
    @Setter
    public static class Update {
        @NotBlank
        private String title;

        @NotBlank
        private String content;

        private List<String> imageUrls;
    }

    // 게시글 상세 조회 응답
    @Getter
    public static class Response {
        private final Long boardId;
        private final String title;
        private final String content;
        private final String authorNickname;
        private final String authorProfileImageUrl;
        private final Long viewCount;
        private final Long likeCount;
        private final boolean isLiked;     // 현재 유저가 좋아요 했는지 구분

        // 이미지 목록
        private final List<ImageInfo> images;

        // 댓글 갯수만
        private final Long commentCount;

        private final LocalDateTime createdAt;
        private final LocalDateTime updatedAt;

        public Response(Board board, boolean isLiked, Long commentCount, List<ImageInfo> images) {
            this.boardId = board.getBoardId();
            this.title = board.getTitle();
            this.content = board.getContent();
            this.authorNickname = board.getUser().getNickname();
            this.authorProfileImageUrl = board.getUser().getProfileImageUrl();
            this.viewCount = board.getViewCount();
            this.likeCount = board.getLikeCount();
            this.isLiked = isLiked;
            this.commentCount = commentCount;
            this.images = images;
            this.createdAt = board.getCreatedAt();
            this.updatedAt = board.getUpdatedAt();
        }
    }

    // 게시글 목록 조회 응답
    @Getter
    public static class ListItem {
        private final Long boardId;
        private final String title;
        private final String authorNickname;
        private final Long viewCount;
        private final Long likeCount;
        private final Long commentCount;

        // 썸네일용 이미지 주소
        private final String thumbnailUrl;

        private final LocalDateTime createdAt;

        public ListItem(Board board, Long commentCount, String thumbnailUrl) {
            this.boardId = board.getBoardId();
            this.title = board.getTitle();
            this.authorNickname = board.getUser().getNickname();
            this.viewCount = board.getViewCount();
            this.likeCount = board.getLikeCount();
            this.commentCount = commentCount;
            this.thumbnailUrl = thumbnailUrl;
            this.createdAt = board.getCreatedAt();
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
