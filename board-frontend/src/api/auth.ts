// 인증 관련 API
import axios from "axios"
import { AuthResponse, LoginRequest, SignUpRequest, UploadResponse, User } from "../types";

// 회원가입
export const signup = async (userData: SignUpRequest): Promise<User> => {
    const response = await axios.post('/auth/signup', userData);
    return response.data;
};

// 로그인
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
};

// 내 정보 조회
export const getMyProfile = async (): Promise<User> => {
    const response = await axios.get('/auth/me');
    return response.data;
};

// 프로필 수정
export const updateProfile = async (userData: Partial<User>): Promise<User> => {
    const response = await axios.put('/auth/me', userData);
    return response.data;
};

// 비밀번호 변경
export const changePassword = async (passwordData: {
    currentPassword: string;
    newPassword: string;
}): Promise<void> => {
    const response = await axios.put('/auth/me/password', passwordData);
    return response.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/auth/me/profile-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

// 회원탈퇴
export const deleteAccount = async (password: string): Promise<void> => {
    const response = await axios.delete(`/auth/me?password=${password}`);
    return response.data;
};