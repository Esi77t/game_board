package com.game.board_backend.service;

import com.game.board_backend.dto.BoardDto;
import com.game.board_backend.model.Board;
import com.game.board_backend.model.BoardImage;
import com.game.board_backend.model.BoardLike;
import com.game.board_backend.model.User;
import com.game.board_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    @Transactional
    public BoardDto.Response getBoard(Long boardId, Long currentUserId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 조회수 증가
        board.increaseViewCount();

        // 이미지 목록
        List<BoardDto.ImageInfo> imageInfos = getImageInfos(boardId);

        // 댓글 개수
        long commentCount = commentRepository.countByBoardId(boardId);

        // 좋아요 여부
        boolean isLiked = currentUserId != null &&
                boardLikeRepository.existsByBoardIdAndUserId(boardId, currentUserId);

        return new BoardDto.Response(board, isLiked, commentCount, imageInfos);
    }

    // 게시글 목록 조회(페이징)
    public Page<BoardDto.ListItem> getBoardList(Pageable pageable) {
        Page<Board> boards = boardRepository.findAllByOrderByCreatedAtDesc(pageable);

        return boards.map(board -> {
            long commentCount = commentRepository.countByBoardId(board.getBoardId());
            BoardImage thumbnail = boardImageRepository.findFirstByBoardIdOrderByOrderIndexAsc(board.getBoardId());
            String thumbnailUrl = thumbnail != null ? thumbnail.getImageUrl() : null;

            return new BoardDto.ListItem(board, commentCount, thumbnailUrl);
        });
    }

    // 게시글 검색
    public Page<BoardDto.ListItem> searchBoards(String keyword, Pageable pageable) {
        Page<Board> boards = boardRepository.searchByTitleOrContent(keyword, pageable);

        return boards.map(board -> {
            long commentCount = commentRepository.countByBoardId(board.getBoardId());
            BoardImage thumbnail = boardImageRepository.findFirstByBoardIdOrderByOrderIndexAsc(board.getBoardId());
            String thumbnailUrl = thumbnail != null ? thumbnail.getImageUrl() : null;

            return new BoardDto.ListItem(board, commentCount, thumbnailUrl);
        });
    }

    // 게시글 수정
    @Transactional
    public BoardDto.Response updateBoard(Long boardId, BoardDto.Update dto, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 작성자 확인
        if (!board.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("게시글 수정 권한이 없습니다.");
        }

        // 게시글 수정
        board.setTitle(dto.getTitle());
        board.setContent(dto.getContent());

        // 기존 이미지 삭제 후 새로 저장
        boardImageRepository.deleteByBoardId(boardId);

        List<BoardDto.ImageInfo> imageInfos = List.of();
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            for (int i = 0; i < dto.getImageUrls().size(); i++) {
                BoardImage image = new BoardImage();
                image.setBoard(board);
                image.setImageUrl(dto.getImageUrls().get(i));
                image.setOrderIndex(i);
                boardImageRepository.save(image);
            }
            imageInfos = getImageInfos(boardId);
        }

        long commentCount = commentRepository.countByBoardId(boardId);
        boolean isLiked = boardLikeRepository.existsByBoardIdAndUserId(boardId, userId);

        return new BoardDto.Response(board, isLiked, commentCount, imageInfos);
    }

    // 게시글 삭제
    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 작성자인지 확인
        if (!board.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("게시글 삭제 권한이 없습니다.");
        }

        // Cascade로 댓글, 이미지, 좋아요 자동 삭제
        boardRepository.delete(board);
    }

    // 좋아요 토글
    @Transactional
    public boolean toggleLike(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 이미 좋아요 했으면 취소
        if (boardLikeRepository.existsByBoardIdAndUserId(boardId, userId)){
            boardLikeRepository.deleteByBoardIdAndUserId(boardId, userId);
            board.decreaseLikeCount();
            return false;
        }
        // 좋아요 추가
        else {
            BoardLike like = new BoardLike();
            like.setBoard(board);
            like.setUser(user);
            boardLikeRepository.save(like);
            board.increaseLikeCount();
            return true;
        }
    }

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
