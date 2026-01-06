package com.game.board_backend.controller;

import com.game.board_backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/upload")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    /**
     * 단일 이미지 저장
     * POST /api/upload/image
     */
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        if (authentication == null) {
            throw new IllegalArgumentException("인증이 필요합니다.");
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        String fileUrl = fileStorageService.storeFile(file, "image");

        Map<String, String> response = new HashMap<>();

        response.put("imageUrl", fileUrl);
        response.put("originalFileName", file.getOriginalFilename());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
