package com.game.board_backend.controller;

import com.game.board_backend.dto.CategoryDto;
import com.game.board_backend.service.CategoryService;
import com.game.board_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final UserService userService;

    /**
     * 카테고리 생성(관리자만 생성 가능)
     * POST api/categories
     */
    @PostMapping
    public ResponseEntity<CategoryDto.Response> createCategory(
            @Valid @RequestBody CategoryDto.Create dto,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        checkAdminRole(userId);

        CategoryDto.Response response = categoryService.createCategory(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 카테고리 목록 조회(모든 사용자가 이용 가능)
     * GET api/categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryDto.Response>> getAllCategories() {
        List<CategoryDto.Response> response = categoryService.getAllCategories();
        return ResponseEntity.ok(response);
    }

    /**
     * 카테고리 상세 조회(모든 사용자가 이용 가능)
     * GET api/categories/{categoryId}
     */
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto.Response> getCategory(@PathVariable Long categoryId) {
        CategoryDto.Response response = categoryService.getCategory(categoryId);
        return ResponseEntity.ok(response);
    }

    /**
     * 카테고리 수정(관리자 전용)
     * PUT api/categories/{categoryId}
     */
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDto.Response> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDto.Update dto,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        checkAdminRole(userId);

        CategoryDto.Response response = categoryService.updateCategory(categoryId, dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 카테고리 삭제(관리자 전용)
     * PUT api/categories/{categoryId}
     */
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long categoryId,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        checkAdminRole(userId);

        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    // 관리자 확인용
    private void checkAdminRole(Long userId) {
        var user = userService.getUserById(userId);
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("관리자 권한이 필요합니다..");
        }
    }
}
