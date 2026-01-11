package com.game.board_backend.service;

import com.game.board_backend.dto.CategoryDto;
import com.game.board_backend.model.Category;
import com.game.board_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// 카테고리 생성, 수정, 삭제는 Controller쪽에서 ADMIN 체크 후에 생성 가능하게 만들 예정
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 카테고리 생성
    @Transactional
    public CategoryDto.Response createCategory(CategoryDto.Create dto) {
        // 카테고리 명 중복 체크
        if (categoryRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("이미 존재하는 카테고리입니다.");
        }

        Category category = new Category();
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());
        category.setDisplayOrder(dto.getDisplayOrder());

        Category savedCategory = categoryRepository.save(category);
        return new CategoryDto.Response(savedCategory);
    }

    // 카테고리 목록 조회
    public List<CategoryDto.Response> getAllCategories() {
        List<Category> categories = categoryRepository.findAllByOrderByDisplayOrderAsc();
        return categories.stream()
                .map(CategoryDto.Response::new)
                .collect(Collectors.toList());
    }

    // 카테고리 상세 조회
    public CategoryDto.Response getCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        return new CategoryDto.Response(category);
    }

    // 카테고리 수정
    @Transactional
    public CategoryDto.Response updateCategory(Long categoryId, CategoryDto.Update dto) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        if (!category.getName().equals(dto.getName())) {
            if (categoryRepository.existsByName(dto.getName())) {
                throw new IllegalArgumentException("이미 존재하는 카테고리입니다.");
            }

            category.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            category.setDescription(dto.getDescription());
        }

        if (dto.getDisplayOrder() != null) {
            category.setDisplayOrder(dto.getDisplayOrder());
        }

        return new CategoryDto.Response(category);
    }

    // 카테고리 삭제
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 카테고리입니다."));

        // 카테고리 삭제 시 해당 카테고리의 게시글들은 category가 null로 설정됨
        categoryRepository.delete(category);
    }
}
