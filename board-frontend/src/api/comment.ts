// 댓글 API
import axios from "axios"

// 댓글 목록 조회
export const getComments = async (boardId) => {
    const response = await axios.get(`/boards/${boardId}/comments`);
    return response.data;
};

// 댓글 작성
export const createComment = async (boardId, commetData) => {
    const response = await axios.post(`/boards/${boardId}/comments`, commetData);
    return response.data;
};

// 댓글 수정
export const updateComment = async (boardId, commentId, commentData) => {
    const response = await axios.put(`/boards/${boardId}/commnets/${commentId}`, commentData);
    return response.data;
};

// 댓글 삭제
export const deleteComment = async (boardId, commentId) => {
    const response = await axios.delete(`/boards/${boardId}/comments/${commentId}`);
    return response.data;
};