// 업로드 API
import axios from "axios"

// 이미지 업로드(단일)
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/upload/image', formData, {
        headers: {
            "Content-Type": 'multipart/form-data',
        },
    });

    return response.data;
};

// 이미지 업로드(다중)
export const uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('file', file);
    });

    const response = await axios.post('/upload/images', formData, {
        headers: {
            "Content-Type": 'multipart/form-data',
        }
    });

    return response.data;
};