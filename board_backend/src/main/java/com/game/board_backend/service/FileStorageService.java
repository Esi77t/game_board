package com.game.board_backend.service;

import com.game.board_backend.config.FileUploadProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private final FileUploadProperties fileUploadProperties;

    // 파일 저장
    public String storeFile(MultipartFile file, String subDirectory) {
        // 파일명 검증
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // 파일명에 부적절한 이름이 있는지 확인
            if (originalFileName.contains("..")) {
                throw new IllegalArgumentException("파일명에 부적절한 경로가 포함되어 있습니다: " + originalFileName);
            }
            // 파일 크기 체크
            if (file.getSize() > fileUploadProperties.getMaxSize()) {
                throw new IllegalArgumentException("파일 크기가 너무 큽니다. 최대 크기: " + fileUploadProperties.getMaxSize());
            }

            // 파일 확장자 체크
            String extension = getFileExtension(originalFileName);
            if (isAllowedExtension(extension)) {
                throw new IllegalArgumentException("허용되지 않는 파일 형식입니다: " + extension);
            }

            // 고유한 파일명 생성
            String storedFileName = UUID.randomUUID().toString() + "." + extension;

            // 저장 경로 생성
            Path uploadPath = Paths.get(fileUploadProperties.getUploadDir(), subDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일 저장
            Path targetLocation = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 저장된 파일의 URL반환

            return "/" + subDirectory + "/" + storedFileName;
        } catch (IOException e) {
            throw new RuntimeException("파일 저장에 실패했습니다: " + originalFileName, e);
        }
    }

    // 파일 삭제
    public void deleteFile(String fileUrl) {
        try {
            Path filePath = Paths.get(fileUploadProperties.getUploadDir() + fileUrl);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("파일 삭제에 실패했습니다: " + fileUrl, e);
        }
    }

    // 파일 확장자 추출
    private String getFileExtension(String fileName) {
        int lastIndexOf = fileName.lastIndexOf(".");
        if (lastIndexOf == -1) {
            return "";
        }

        return fileName.substring(lastIndexOf + 1).toLowerCase();
    }

    // 허용된 파일 확장자체크
    private boolean isAllowedExtension(String extension) {
        String[] allowedExtension = {"jpg", "jpeg", "png", "gif", "webp"};
        for (String allowed : allowedExtension) {
            if (allowed.equals(extension)) {
                return true;
            }
        }

        return false;
    }
}
