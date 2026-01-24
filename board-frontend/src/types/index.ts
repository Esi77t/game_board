export interface User {
    id: number;
    userId: string;
    nickname: string;
    email: string;
    profileImageUrl: string;
    role: string;
    createdAt: string;
}

export interface Category {
    id: number;
    name: string;
    description: string | null;
    displayOrder: number;
    createdAt: string;
}

export interface ImageInfo {
    id: number;
    imageUrl: string;
    originalFileName: string | null;
    orderIndex: number;
}

export interface Board {
    id: number;
    title: string;
    content: string;
    authorNickname: string;
    authorProfileImageUrl: string | null;
    viewCount: number;
    likeCount: number;
    isLiked: boolean;
    images: ImageInfo[];
    commentCount: number;
    categoryName: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BoardListItem {
    id: number;
    title: string;
    authorNickname: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnailUrl: string | null;
    categoryName: string | null;
    createdAt: string;
}

export interface Comment {
    id: number;
    content: string;
    authorNickname: string;
    authorProfileImageUrl: string | null;
    images: ImageInfo[];
    createdAt: string;
    updatedAt: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    userId: string;
    password: string;
}

export interface SignUpRequest {
    userId: string;
    password: string;
    nickname: string;
    email: string;
}

export interface BoardCreateRequest {
    title: string;
    content: string;
    categoryId?: number | null;
    imageUrls: string[];
}

export interface BoardUpdateRequest {
    title: string;
    content: string;
    categoryId?: number | null;
    imageUrls: string[];
}

export interface CommentCreateRequest {
    content: string;
    imageUrls: string[];
}

export interface CommentUpdateRequest {
    content: string;
    imageUrls: string[];
}

export interface UploadResponse {
    imageUrl: string;
    originalFileName: string;
}