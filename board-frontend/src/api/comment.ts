// 댓글 API
import axios from "axios"
import { Comment, CommentCreateRequest, CommentUpdateRequest } from "../types";

// 댓글 목록 조회
export const getComments = async (boardId: number): Promise<Comment[]> => {
    const response = await axios.get<Comment[]>(`/boards/${boardId}/comments`);
    return response.data;
};

// 댓글 작성
export const createComment = async (boardId: number, commetData: CommentCreateRequest): Promise<Comment> => {
    const response = await axios.post<Comment>(`/boards/${boardId}/comments`, commetData);
    return response.data;
};

// 댓글 수정
export const updateComment = async (boardId: number, commentId: number, commentData: CommentUpdateRequest): Promise<Comment> => {
    const response = await axios.put<Comment>(`/boards/${boardId}/comments/${commentId}`, commentData);
    return response.data;
};

// 댓글 삭제
export const deleteComment = async (boardId:number, commentId: number): Promise<void> => {
    const response = await axios.delete(`/boards/${boardId}/comments/${commentId}`);
    return response.data;
};