package com.game.board_backend.dto;

import com.game.board_backend.model.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class CategoryDto {

    // 카테고리 생성 요청
    @Getter
    @Setter
    private static class Create {
        @NotBlank(message = "카테고리 이름은 필수입니다.")
        @Size(max = 50, message = "카테고리 이름은 50자를 초과할 수 없습니다.")
        private String name;

        @Size(max = 200, message = "설명은 200자를 초과할 수 없습니다.")
        private String description;

        private Integer displayOrder = 0;
    }

    // 카테고리 수정 요청
    @Getter
    @Setter
    private static class Update {
        @NotBlank(message = "카테고리 이름은 필수입니다.")
        @Size(max = 50, message = "카테고리 이름은 50자를 초과할 수 없습니다.")
        private String name;

        @Size(max = 200, message = "설명은 200자를 초과할 수 없습니다.")
        private String description;

        private Integer displayOrder;
    }

    // 카테고리 응답
    @Getter
    public static class Response {
        private final Long id;
        private final String name;
        private final String description;
        private final Integer displayOrder;
        private final LocalDateTime createdAt;

        public Response(Category category) {
            this.id = category.getId();
            this.name = category.getName();
            this.description = category.getDescription();
            this.displayOrder = category.getDisplayOrder();
            this.createdAt = category.getCreatedAt();
        }
    }
}
