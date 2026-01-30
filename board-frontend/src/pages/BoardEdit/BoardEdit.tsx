import { useNavigate, useParams } from "react-router-dom";
import "./BoardEdit.css";
import { useEffect, useState } from "react";
import { Category } from "../../types";
import { getCategories } from "../../api/category";
import { getBoardDetail } from "../../api/board";
import { getImageUrl } from "../../config/imageUrl";

interface FormData {
    title: string;
    content: string;
    categoryId: string;
    imageUrls: string[];
}

const BoardEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
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
    const [existingImgUrls, setExistingImgUrls] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        fetchCategories();
        fetchBoardDetail();
    });

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategoires(data);
        } catch (error) {
            console.error('카테고리 조회 실패: ', error);
        }
    };

    const fetchBoardDetail = async () => {
        if (!id) return;

        try {
            const board = await getBoardDetail(parseInt(id));

            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                if (currentUser.id !== board.authorId) {
                    alert('게시글 수정 권한이 없습니다.');
                    navigate(`/boards/${id}`);
                    return;
                }
            }

            setFormData({
                title: board.title,
                content: board.content,
                categoryId: board.categoryName || '',
                imageUrls: board.images.map(img => img.imageUrl)
            });

            const existingImgUrls = board.images.map(img => getImageUrl(img.imageUrl) || '');
            setExistingImgUrls(existingImgUrls);
        } catch (error) {
            console.error('게시글 조회 실패: ', error);
            alert('게시글을 불러오는데 실패했습니다.');
            navigate('/');
        }
    }

    return (
        <div>

        </div>
    );
}

export default BoardEdit;