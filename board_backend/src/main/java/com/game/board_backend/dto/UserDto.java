package com.game.board_backend.dto;

import com.game.board_backend.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class UserDto {
    // 회원가입
    @Getter
    @Setter
    public static class SignUp {
        @NotBlank(message = "아이디는 필수로 입력해야 합니다.")
        @Size(min = 4, max = 20)
        private String userId;

        @NotBlank(message = "비밀번호는 필수로 입력해야 합니다.")
        @Size(min = 8, max = 20)
        private String password;

        @NotBlank
        @Size(min = 2, max = 20)
        private String nickname;

        @NotBlank
        @Email(message = "이메일 형식에 맞지 않습니다.")
        private String email;
    }

    // 로그인 요청
    @Getter
    @Setter
    public static class Login {
        @NotBlank
        private String userId;

        @NotBlank
        private String password;
    }

    // 응답
    // 비밀번호는 제외
    @Getter
    @Setter
    public static class Response {
        private Long id;
        private String userId;
        private String nickname;
        private String email;
        private String profileImageUrl;
        private String role;
        private LocalDateTime createdAt;

        // Entity에서 DTO 변환 생성자
        public Response(User user) {
            this.id = user.getId();
            this.userId = user.getUserId();
            this.nickname = user.getNickname();
            this.email = user.getEmail();
            this.profileImageUrl = user.getProfileImageUrl();
            this.role = user.getRole().name();
            this.createdAt = getCreatedAt();
        }
    }
}
