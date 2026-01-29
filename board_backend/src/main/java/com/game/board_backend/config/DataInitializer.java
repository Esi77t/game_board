package com.game.board_backend.config;

import com.game.board_backend.model.Category;
import com.game.board_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// 임시로 생성해줄 카테고리들
// 빈배열로 뱉어내서 우선 이거 넣어줌
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        // 카테고리가 없으니까 일단 기본으로 생성해줄 카테고리
        // 기본적으로 ADMIN 계정이어야 만들어지니 일단 임시로
        if (categoryRepository.count() == 0) {
            log.info("카테고리 생성 시작");

            createCategory("자유게시판", "자유롭게 얘기하는 곳", 0);
            createCategory("공지사항", "공지하는 곳", 1);
            createCategory("질문게시판", "질문하는 곳", 2);
            createCategory("팁 노하우", "팁이나 노하우 쏟아내는 곳", 3);

            log.info("카테고리 생성: {}개", categoryRepository.count());
        } else {
            log.info("카테고리 {}개 있음", categoryRepository.count());
        }
    }

    private void createCategory(String name, String description, int order) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setDisplayOrder(order);
        categoryRepository.save(category);

        log.info("카테고리 생성 : {} (순서: {})", name, order);
    }
}
