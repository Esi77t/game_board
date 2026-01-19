// 게시판 API
import axios from "axios"

// 게시물 목록 조회
export const getBoardList = async (page = 0, size = 10) => {
    const response = await axios.get(`/boards?page=${page}&size=${size}`);
    return response.data;
};

// 게시글 상세 조회
export const getBoardDetail = async (boardId) => {
    const response = await axios.get(`/boards/${boardId}`);
    return response.data;
};

// 게시글 작성
export const createBoard = async (boardData) => {
    const response = await axios.post(`/boards`, boardData);
    return response.data;
};

// 게시글 수정
export const updateBoard = async (boardId, boardData) => {
    const response = await axios.put(`/boards/${boardId}`, boardData);
    return response.data;
};

// 게시글 삭제
export const deleteBoard = async (boardId) => {
    const response = await axios.delete(`/boards/${boardId}`);
    return response.data;
};

// 게시글 검색
export const searchBoards = async (keyword, page = 0, size = 10) => {
    const response = await axios.get(`/boards/search?keyword=${keyword}&page=${page}&size=${size}`);
    return response.data;
};

// 카테고리 별 게시글 조회
export const getBoardsByCategory = async (categoryId, page = 0, size = 10) => {
    const response = await axios.get(`/boards/category/${categoryId}?page=${page}$size=${size}`);
    return response.data;
};

// 좋아요 토글
export const toggleLike = async (boardId) => {
    const response = await axios.post(`/boards/${boardId}/like`);
    return response.data;
};