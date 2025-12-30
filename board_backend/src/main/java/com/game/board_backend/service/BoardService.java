package com.game.board_backend.service;

import com.game.board_backend.dto.BoardDto;
import com.game.board_backend.model.Board;
import com.game.board_backend.model.BoardImage;
import com.game.board_backend.model.User;
import com.game.board_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardImageRepository boardImageRepository;
    private final CommentRepository commentRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final UserRepository userRepository;

    // 게시글 작성
    public BoardDto.Response createBoard(BoardDto.Create dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디입니다."));

        // 게시글 생성
        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());
        board.setUser(user);
        board.setViewCount(0L);
        board.setLikeCount(0L);

        Board savedBoard = boardRepository.save(board);

        // 이미지 저장
        List<BoardDto.ImageInfo> imageInfos = List.of();
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            for (int i = 0; i < dto.getImageUrls().size(); i++) {
                BoardImage image = new BoardImage();

                image.setBoard(savedBoard);
                image.setImageUrl(dto.getImageUrls().get(i));
                image.setOrderIndex(i);
                boardImageRepository.save(image);
            }
            imageInfos = getImageInfos(savedBoard.getBoardId());
        }

        return new BoardDto.Response(savedBoard, false, 0L, imageInfos);
    }

    // 게시글 상세 조회(조회수 증가)

    // 게시글 목록 조회(페이징)

    // 게시글 검색

    // 게시글 수정

    // 게시글 삭제

    // 좋아요 토글

    // 이미지 정보 조회
    public List<BoardDto.ImageInfo> getImageInfos(Long boardId) {
        List<BoardImage> images = boardImageRepository.findByBoardIdOrderByOrderIndexAsc(boardId);

        return images.stream()
                .map(img -> new BoardDto.ImageInfo(
                        img.getId(),
                        img.getImageUrl(),
                        img.getOriginalFileName(),
                        img.getOrderIndex()
                ))
                .collect(Collectors.toList());
    }
}
