import { useNavigate } from "react-router-dom";
import "./BoardWrite.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
    };

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
            navigate(`/boards/${response.id}`);
        } catch (error) {
            console.error('게시글 작성 실패: ', error);
            alert('게시글 작성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        setSelectedFiles(fileArray);

        const urls = fileArray.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleRemoveImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((__, i) => i !== index));
    };

    return (
        <div className="board-write-container">
            <div className="board-write">
                <h2>게시글 작성</h2>
                <form onSubmit={handleSubmit}>
                    {categories.length > 0 && (
                        <div className="form-group">
                            <label htmlFor="categoryId">카테고리</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(category => (
                                    <option
                                        key={category.id} value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="title">제목</label>
                        <input 
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="제목을 입력하세요"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">내용</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="내용을 입력하세요"
                            rows={15}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="images">이미지</label>
                        <input 
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        <div className="file-info">최대 10MB, JPG, PNG, GIF 형식</div>
                    </div>
                    {previewUrls.length > 0 && (
                        <div className="image-preview">
                            {previewUrls.map((url, index) => (
                                <div key={index} className="preview-item">
                                    <img src={url} alt={`미리보기 ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate(-1)}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? '작성 중' : '작성 완료'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BoardWrite;