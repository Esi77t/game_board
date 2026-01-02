package com.game.board_backend.service;

import com.game.board_backend.dto.CommentDto;
import com.game.board_backend.model.Board;
import com.game.board_backend.model.Comment;
import com.game.board_backend.model.CommentImage;
import com.game.board_backend.model.User;
import com.game.board_backend.repository.BoardRepository;
import com.game.board_backend.repository.CommentImageRepository;
import com.game.board_backend.repository.CommentRepository;
import com.game.board_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentImageRepository commentImageRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    // 댓글 쓰기
    @Transactional
    public CommentDto.Response createComment(Long boardId, CommentDto.Create dto, Long userId) {
        // 게시글 존재 확인
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 사용자 존재 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 댓글 작성
        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setBoard(board);
        comment.setUser(user);

        Comment savedComment = commentRepository.save(comment);

        // 이미지 저장
        List<CommentDto.ImageInfo> imageInfos = List.of();
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            for (int i = 0; i < dto.getImageUrls().size(); i++) {
                CommentImage image = new CommentImage();
                image.setComment(savedComment);
                image.setImageUrl(dto.getImageUrls().get(i));
                image.setOrderIndex(i);
                commentImageRepository.save(image);
            }

            imageInfos = getImageInfos(savedComment.getCommentId());
        }

        return new CommentDto.Response(savedComment, imageInfos);
    }

    // 특정 게시글의 댓글 목록 조회
    public List<CommentDto.Response> getCommentsByBoardId(Long boardId) {
        // 게시글 존재확인
        boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글 입니다."));

        List<Comment> comments = commentRepository.findByBoardIdOrderByCreatedAtAsc(boardId);

        return comments.stream()
                .map(comment -> {
                    List<CommentDto.ImageInfo> imageInfos = getImageInfos(comment.getCommentId());
                    return new CommentDto.Response(comment, imageInfos);
                })
                .collect(Collectors.toList());
    }

    // 댓글 수정
    @Transactional
    public CommentDto.Response updateComment(Long commentId, CommentDto.Update dto, Long userId) {
        // 댓글이 있는지 확인
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 작성자인지 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글 수정 권한이 없습니다.");
        }

        // 댓글 내용 수정
        comment.setContent(dto.getContent());

        // 기존 이미지 삭제 후 새로 저장
        commentImageRepository.deleteByCommentId(commentId);

        List<CommentDto.ImageInfo> imageInfos = List.of();
        if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
            for (int i = 0; i < dto.getImageUrls().size(); i++) {
                CommentImage image = new CommentImage();
                image.setComment(comment);
                image.setImageUrl(dto.getImageUrls().get(i));
                image.setOrderIndex(i);
                commentImageRepository.save(image);
            }

            imageInfos = getImageInfos(commentId);
        }

        return new CommentDto.Response(comment, imageInfos);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        // 댓글이 있는지 확인
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        // 작성자인지 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글 삭제 권한이 없습니다.");
        }

        // Cascade로 이미지 자동 삭제
        commentRepository.delete(comment);
    }

    // 특정 유저가 쓴 댓글 목록 조회
    public List<CommentDto.Response> getCommentsByUserId(Long userId) {
        // 사용자 존재 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        List<Comment> comments = commentRepository.findByUserId(userId);

        return comments.stream()
                .map(comment -> {
                    List<CommentDto.ImageInfo> imageInfos = getImageInfos(comment.getCommentId());
                    return new CommentDto.Response(comment, imageInfos);
                })
                .collect(Collectors.toList());
    }

    // 이미지 정보 조회
    public List<CommentDto.ImageInfo> getImageInfos(Long commentId) {
        List<CommentImage> images = commentImageRepository.findByCommentIdOrderByOrderIndexAsc(commentId);

        return images.stream()
                .map(img -> new CommentDto.ImageInfo(
                        img.getId(),
                        img.getImageUrl(),
                        img.getOriginalFileName(),
                        img.getOrderIndex()
                ))
                .collect(Collectors.toList());
    }
}
