// 기본 설정, 인터셉트 설정
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터(예외 처리)
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터(예외 처리)
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // 401 에러(인증 실패) 처리
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;