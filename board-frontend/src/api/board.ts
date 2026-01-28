// 게시판 API
import axios from "axios"
import { Board, BoardCreateRequest, BoardListItem, BoardUpdateRequest, PageResponse } from "../types";

// 게시물 목록 조회
export const getBoardList = async (page: number = 0, size: number = 10): Promise<PageResponse<BoardListItem>> => {
    const response = await axios.get<PageResponse<BoardListItem>>(`/boards?page=${page}&size=${size}`);
    return response.data;
};

// 게시글 상세 조회
export const getBoardDetail = async (boardId: number): Promise<Board> => {
    const response = await axios.get<Board>(`/boards/${boardId}`);
    return response.data;
};

// 게시글 작성
export const createBoard = async (boardData: BoardCreateRequest): Promise<Board> => {
    const response = await axios.post<Board>(`/boards`, boardData);
    return response.data;
};

// 게시글 수정
export const updateBoard = async (boardId: number, boardData: BoardUpdateRequest): Promise<Board> => {
    const response = await axios.put<Board>(`/boards/${boardId}`, boardData);
    return response.data;
};

// 게시글 삭제
export const deleteBoard = async (boardId: number): Promise<void> => {
    const response = await axios.delete(`/boards/${boardId}`);
    return response.data;
};

// 게시글 검색
export const searchBoards = async (keyword: string, page: number = 0, size: number = 10): Promise<PageResponse<BoardListItem>> => {
    const response = await axios.get<PageResponse<BoardListItem>>(`/boards/search?keyword=${keyword}&page=${page}&size=${size}`);
    return response.data;
};

// 카테고리 별 게시글 조회
export const getBoardsByCategory = async (categoryId: number, page: number = 0, size: number = 10): Promise<PageResponse<BoardListItem>> => {
    const response = await axios.get<PageResponse<BoardListItem>>(`/boards/category/${categoryId}?page=${page}&size=${size}`);
    return response.data;
};

// 좋아요 토글
export const toggleLike = async (boardId: number): Promise<boolean> => {
    const response = await axios.post<boolean>(`/boards/${boardId}/like`);
    return response.data;
};