// 업로드 API
import { UploadResponse } from "../types";
import instance from "./axios";

// 이미지 업로드(단일)
export const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await instance.post<UploadResponse>('/upload/image', formData, {
        headers: {
            "Content-Type": 'multipart/form-data',
        },
    });

    return response.data;
};

// 이미지 업로드(다중)
export const uploadImages = async (files: File[]): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('file', file);
    });

    const response = await instance.post<UploadResponse[]>('/upload/images', formData, {
        headers: {
            "Content-Type": 'multipart/form-data',
        }
    });

    return response.data;
};