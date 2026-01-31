// 기본 설정, 인터셉트 설정
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../config/api';

// Axios 인스턴스 생성
const instance = axios.create({
    baseURL: API_URL,
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
        // console.log('[Axios Response]', response.config.url, 'Status:', response.status);
        // console.log('[Response Data]', response.data);
        return response;
    },
    (error: AxiosError) => {
        // console.error('[Axios Error]', error.config?.url, error.message);
        // console.error('[Error Response]', error.response?.data);
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