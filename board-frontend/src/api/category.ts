// 카테고리 API
import axios from "axios"

// 카테고리 목록 조회
export const getCategories = async () => {
    const response = await axios.get('/categories');
    return response.data;
};

// 카테고리 생성(관리자만)
export const createCategory = async (categoryData) => {
    const response = await axios.post('/categories', categoryData);
    return response.data;
};

// 카테고리 수정(관리자만)
export const updateCategory = async (categoryId, categoryData) => {
    const response = await axios.put(`/categories/${categoryId}`, categoryData);
    return response.data;
};

// 카테고리 삭제(관리자만)
export const deleteCateogry = async (categoryId) => {
    const response = await axios.delete(`/categories/${categoryId}`);
    return response.data;
};