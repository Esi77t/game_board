package com.game.board_backend.controller;

import com.game.board_backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    @PostMapping("/image")
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

    /**
     * 다중 이미지 저장
     * POST /api/upload/images
     */
    @PostMapping("/images")
    public ResponseEntity<List<Map<String, String>>> uploadImages(
            @RequestParam("file") List<MultipartFile> files,
            Authentication authentication) {
        if (authentication == null) {
            throw new IllegalArgumentException("인증이 필요합니다.");
        }

        List<Map<String, String>> responses = new ArrayList<>();

        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String fileUrl = fileStorageService.storeFile(file, "images");

                Map<String, String> response = new HashMap<>();

                response.put("imageUrl", fileUrl);
                response.put("originalFileName", file.getOriginalFilename());

                responses.add(response);
            }
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    /**
     * 프로필 이미지 업로드
     * POST /api/upload/profile
     */
    public ResponseEntity<Map<String, String>> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();

        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        String fileUrl = fileStorageService.storeFile(file, "profiles");

        Map<String, String> response = new HashMap<>();

        response.put("imageUrl", fileUrl);
        response.put("originalFileName", file.getOriginalFilename());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
