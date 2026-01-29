package com.game.board_backend.config;

import com.game.board_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // BCrypt 암호화 방식 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 주소(일단 프론트 개발용 주소)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173", // Vite를 쓰고 있으므로
                "http://localhost:3000", // React 용
                "http://localhost:4173"  // Vite preview 포트
        ));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // 허용할 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // 인증 정보 포함 허용
        configuration.setAllowCredentials(true);

        // preflight 요청 캐싱시간
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // Security 필터 체인 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 보호 비활성화 (REST API를 사용하기 위해서)
                .csrf(csrf -> csrf.disable())
                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 세션 사용하지 않음
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // URL 별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근 가능한 곳
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/boards",
                                "/api/boards/{id}",
                                "/api/boards/search",
                                "/api/boards/category/{categoryId}",
                                "/api/boards/{id}/comments",
                                "/api/categories",
                                "/api/categories/{categoryId}",
                                "/h2-console/**",
                                "/images/**",
                                "/profiles/**"
                        ).permitAll()
                        // 그 외 모든 요청은 인증이 필요함
                        .anyRequest().authenticated()
                )
                // 기본 로그인 폼 비활성화
                .formLogin(form -> form.disable())
                // HTTP Basic 인증 비 활성화
                .httpBasic(basic -> basic.disable())
                // 지정된 필터 앞에 커스텀 필터를 추가함
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
