// 댓글 API
import { Comment, CommentCreateRequest, CommentUpdateRequest } from "../types";
import instance from "./axios";

// 댓글 목록 조회
export const getComments = async (boardId: number): Promise<Comment[]> => {
    const response = await instance.get<Comment[]>(`/boards/${boardId}/comments`);
    return response.data;
};

// 댓글 작성
export const createComment = async (boardId: number, commetData: CommentCreateRequest): Promise<Comment> => {
    const response = await instance.post<Comment>(`/boards/${boardId}/comments`, commetData);
    return response.data;
};

// 댓글 수정
export const updateComment = async (boardId: number, commentId: number, commentData: CommentUpdateRequest): Promise<Comment> => {
    const response = await instance.put<Comment>(`/boards/${boardId}/comments/${commentId}`, commentData);
    return response.data;
};

// 댓글 삭제
export const deleteComment = async (boardId:number, commentId: number): Promise<void> => {
    const response = await instance.delete(`/boards/${boardId}/comments/${commentId}`);
    return response.data;
};