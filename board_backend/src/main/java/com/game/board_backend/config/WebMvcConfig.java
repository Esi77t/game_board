package com.game.board_backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 정적 파일 서빙
@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final FileUploadProperties fileUploadProperties;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 파일을 URL로 접근 가능하게 설정
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + fileUploadProperties.getUploadDir() + "/images/");
        registry.addResourceHandler("/profiles/**")
                .addResourceLocations("file:" + fileUploadProperties.getUploadDir() + "/profiles/");
    }
}
