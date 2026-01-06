package com.game.board_backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "file")
public class FileUploadProperties {
    private String uploadDir;
    private long maxSize;
}
