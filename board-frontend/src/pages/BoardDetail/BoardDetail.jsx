import { useNavigate, useParams } from "react-router-dom";
import "./BoardDetail.css";
import { useEffect, useState } from "react";
import { deleteBoard, getBoardDetail } from "../../api/board";
import { getComments } from "../../api/comment";
import { formatDate } from "date-fns";
import Favorite_Outline from "../../assets/icons/Favorite_Outline.svg";
import Favorite_Fill from "../../assets/icons/Favorite_Fill.svg";

const BoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // 현재 로그인한 유저 정보
        const userData = localStorage.getItem('user');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }

        fetchBoardDetail();
        fetchComments();
    }, [id]);

    const fetchBoardDetail = async () => {
        try {
            const data = await getBoardDetail(id);
            setBoard(data);
            setIsLiked(data.isLiked);
            setLoading(false);
        } catch (error) {
            console.error('게시글 조회 실패: ', error);
            alert('게시글을 불러올 수 없습니다.');
            navigate('/');
        }
    }

    const fetchComments = async () => {
        try {
            const data = await getComments(id);
            setComments(data);
        } catch (error) {
            console.error('댓글 조회 실패: ', error);
        }
    }

    const isAuthor = currentUser && currentUser.id === board.authorId;

    const handleEdit = () => {
        navigate(`/boards/edit/${id}`);
    }

    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteBoard(id);
            alert('게시글이 삭제되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('게시글 삭제 실패: ', error);
            alert('게시글 삭제에 실패했습니다.')
        }
    }

    return (
        <div className="board-detail-container">
            <div className="board-detail">
                {/* 헤더 */}
                <div className="board-header">
                    {board.categoryName && (
                        <span className="board-category">[{board.categoryName}]</span>
                    )}
                    <h1 className="board-title">{board.title}</h1>
                </div>
                {/* 작성자 정보 */}
                <div className="board-meta">
                    <div className="author-info">
                        {board.authorProfileImageUrl ? (
                            <img
                                src={`http:/localhost:8080${board.authorProfileImageUrl}`}
                                alt="프로필"
                                className="author-avatar"
                            />
                        ) : (
                            <div className="author-avatar-default">
                                {board.authorNickname.charAt(0)}
                            </div> 
                        )}
                        <div>
                            <div className="author-name">{board.authorNickname}</div>
                            <div className="board-date">{formatDate(board.createdAt)}</div>
                        </div>
                    </div>
                    <div className="board-stats">
                        <span>조회 {board.viewCount}</span>
                        <span>좋아요 {board.likeCount}</span>
                        <span>댓글 {board.commentContent}</span>
                    </div>
                </div>
                {/* 본문 */}
                <div className="board-content">
                    {board.content}
                </div>
                {/* 이미지 */}
                {board.images && board.images.length > 0 && (
                    <div className="board-images">
                        {board.images.map(image => (
                            <img 
                                key={image.id}
                                src={`http://localhost:8080${image.imageUrl}`}
                                alt={image.originalFileName}
                            />
                        ))}
                    </div>
                )}
                {/* 액션 버튼 */}
                <div className="board-actions">
                    <button className={`like-button ${isLiked ? 'liked' : ''}`}>
                        {isLiked ? Favorite_Fill : Favorite_Outline} ({board.likeCount})
                    </button>
                    {isAuthor && (
                        <div className="author-actions">
                            <button className="edit-button" onCLick={handleEdit}>수정</button>
                            <button className="delete-button" onCLick={handleDelete}>수정</button>
                        </div>
                    )}
                </div>
                {/* 댓글 작성 */}
            </div>
        </div>
    );
}

export default BoardDetail;