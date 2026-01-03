package com.game.board_backend.dto;

import lombok.Getter;

@Getter
public class AuthResponse {
    private final String token;
    private final UserDto.Response user;

    public AuthResponse(String token, UserDto.Response user) {
        this.token = token;
        this.user = user;
    }
}
