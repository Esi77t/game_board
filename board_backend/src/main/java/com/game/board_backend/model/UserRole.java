package com.game.board_backend.model;

public enum UserRole {
    USER,       // 일반 유저
    MODERATOR,  // 게시판 관리자(유저 밴, 게시글 삭제 권한 정도만)
    ADMIN       // 전체 시스템 관리자
}
