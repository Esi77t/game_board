import { useNavigate, useParams } from "react-router-dom";
import "./BoardEdit.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BoardUpdateRequest, Category } from "../../types";
import { getCategories } from "../../api/category";
import { getBoardDetail, updateBoard } from "../../api/board";
import { getImageUrl } from "../../config/imageUrl";
import { uploadImages } from "../../api/upload";

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
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        fetchCategories();
        fetchBoardDetail();
    }, [id]);

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
            const board = await getBoardDetail(parseInt(id), false);

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
            setExistingImages(existingImgUrls);
        } catch (error) {
            console.error('게시글 조회 실패: ', error);
            alert('게시글을 불러오는데 실패했습니다.');
            navigate('/');
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id) return;

        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        setLoading(true);

        try {
            let newImageUrl: string[] = [];

            // 새로 추가된 이미지가 있으면 업로드
            if (selectedFiles.length > 0) {
                const uploadResults = await uploadImages(selectedFiles);
                newImageUrl = uploadResults.map(result => result.imageUrl);
            }

            // 기존 이미지 + 새 이미지 합치기
            const allImagesUrls = [...formData.imageUrls, ...newImageUrl];

            const boardData: BoardUpdateRequest = {
                title: formData.title,
                content: formData.content,
                imageUrls: allImagesUrls
            };

            await updateBoard(parseInt(id), boardData);
            alert('게시글이 수정되었습니다.');
            navigate(`/boards/${id}`);
        } catch (error) {
            console.error('게시글 수정 실패: ', error);
            alert('게시글 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index)
        }));
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        setSelectedFiles(prev => [...prev, ...fileArray]);

        // 미리보기 URL 생성
        const newPreviewUrls = fileArray.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }

    const removeNewImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        })
    }

    const handleCancel = () => {
        if (window.confirm('수정을 취소하시겠습니까?')) {
            navigate(`/boards/${id}`);
        }
    }

    return (
        <div className="board-write-container">
            <div className="board-write-wrapper">
                <h2>게시글 수정</h2>
                <form onSubmit={handleSubmit} className="write-form">
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
                    {/* 기존 이미지 */}
                    {existingImages.length > 0 && (
                        <div className="form-group">
                            <label>기존 이미지</label>
                            <div className="image-preview-list">
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="image-preview-item">
                                        <img src={url} alt={`기존 이미지 ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeExistingImage(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* 새 이미지 추가 */}
                    <div className="form-group">
                        <label htmlFor="images">이미지 추가</label>
                        <input 
                            type="file"
                            id="images"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        {previewUrls.length > 0 && (
                            <div className="image-preview-list">
                                {previewUrls.map((url, index) => (
                                    <div 
                                        key={`new-${index}`}
                                        className="image-preview-item"
                                    >
                                        <img src={url} alt={`새 이미지 ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={() => removeNewImage(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? '수정 중' : '수정하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BoardEdit;