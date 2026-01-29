// 카테고리 API
import { Category } from "../types";
import instance from "./axios";

// 카테고리 목록 조회
export const getCategories = async (): Promise<Category[]> => {
    const response = await instance.get('/categories');
    return response.data;
};

// 카테고리 생성(관리자만)
export const createCategory = async (categoryData: {
    name: string;
    description?: string;
    displayOrder?: number;
}): Promise<Category> => {
    const response = await instance.post('/categories', categoryData);
    return response.data;
};

// 카테고리 수정(관리자만)
export const updateCategory = async (categoryId: number, categoryData: {
    name: string;
    description?: string;
    displayOrder?: number;
}): Promise<Category> => {
    const response = await instance.put<Category>(`/categories/${categoryId}`, categoryData);
    return response.data;
};

// 카테고리 삭제(관리자만)
export const deleteCateogry = async (categoryId: number): Promise<void> => {
    const response = await instance.delete(`/categories/${categoryId}`);
    return response.data;
};