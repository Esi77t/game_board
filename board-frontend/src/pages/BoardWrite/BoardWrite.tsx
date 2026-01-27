import { useNavigate } from "react-router-dom";
import "./BoardWrite.css";
import { FormEvent, useEffect, useState } from "react";
import { BoardCreateRequest, Category } from "../../types";
import { getCategories } from "../../api/category";
import { uploadImages } from "../../api/upload";
import { createBoard } from "../../api/board";

interface FormData {
    title: string;
    content: string;
    categoryId: string;
    imageUrls: string[];
}

const BoardWrite = () => {
    const navigate = useNavigate();
    const [categories, setCategoires] = useState<Category[]>([]);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        categoryId: '',
        imageUrls: []
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategoires(data);
        } catch (error) {
            console.error('카테고리 조회 실패: ', error);
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('제목을 입력하세요.');
            return;
        }

        if (!formData.content.trim()) {
            alert('내용을 입력하세요.');
            return;
        }

        setLoading(true);

        try {
            let imageUrls: string[] = [];

            if (selectedFiles.length > 0) {
                const uploadData = await uploadImages(selectedFiles);
                imageUrls = uploadData.map(img => img.imageUrl);
            }

            const boardData: BoardCreateRequest = {
                title: formData.title,
                content: formData.content,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
                imageUrls
            };

            const response = await createBoard(boardData);
            alert('게시글이 작성되었습니다.')
            navigate(`/board/${response.id}`);
        } catch (error) {
            console.error('게시글 작성 실패: ', error);
            alert('게시글 작성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="board-write-conatainer">
            <div className="board-write">
                <h2>게시글 작성</h2>
                <form onSubmit={handleSubmit}>

                </form>
            </div>
        </div>
    );
}