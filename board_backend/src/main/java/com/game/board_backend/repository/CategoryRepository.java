package com.game.board_backend.repository;

import com.game.board_backend.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    // 카테고리 명 조회
    Optional<Category> findByName(String name);

    // 카테고리명 중복 체크
    boolean existsByName(String name);

    // 표시 순서대로 정렬
    List<Category> findAllByOrderByDisplayOrderAsc();
}
