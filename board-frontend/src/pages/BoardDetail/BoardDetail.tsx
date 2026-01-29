import { useNavigate, useParams } from "react-router-dom";
import "./BoardDetail.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { deleteBoard, getBoardDetail, toggleLike } from "../../api/board";
import { createComment, deleteComment, getComments, updateComment } from "../../api/comment";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Favorite_Outline from "../../assets/icons/Favorite_Outline.svg";
import Favorite_Fill from "../../assets/icons/Favorite_Fill.svg";
import { Board, Comment, User } from "../../types";
import CommentList from "../../components/CommentList/CommentList";
import { getImageUrl } from "../../config/imageUrl";

const BoardDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [board, setBoard] = useState<Board | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentContent, setCommentContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

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
        if (!id) return;

        try {
            const data = await getBoardDetail(parseInt(id));
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
        if (!id) return;

        try {
            const data = await getComments(parseInt(id));
            setComments(data);
        } catch (error) {
            console.error('댓글 조회 실패: ', error);
        }
    }

    const isAuthor = currentUser && board && currentUser.id === board.authorId;

    const handleEdit = () => {
        navigate(`/boards/edit/${id}`);
    }

    const formatDate = (dateString: string): string => {
        try {
            return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
        } catch {
            return dateString;
        }
    }

    const handleDelete = async () => {
        if (!id) return;

        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await deleteBoard(parseInt(id));
            alert('게시글이 삭제되었습니다.');
            navigate('/');
        } catch (error) {
            console.error('게시글 삭제 실패: ', error);
            alert('게시글 삭제에 실패했습니다.')
        }
    }

    const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id) return;

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (!commentContent.trim()) {
            alert('댓글 내용을 입력하세요.');
            return;
        }

        try {
            await createComment(parseInt(id), { content: commentContent, imageUrls: [] });
            setCommentContent('');
            fetchComments();
            setBoard(prev => prev ? ({
                ...prev,
                commentCount: prev.commentCount + 1
            }) : null);
        } catch (error) {
            console.error('댓글 작성 실패: ', error);
            alert('댓글 작성에 실패했습니다.');
        }
    }

    const handleCommentUpdate = async (commentId: number, newContent: string) => {
        if (!id) return;

        try {
            await updateComment(parseInt(id), commentId, { content: newContent, imageUrls: [] });
            fetchComments();
        } catch (error) {
            console.error('댓글 수정 실패: ', error);
            alert('댓글 수정에 실패했습니다.');
        }
    }

    const handleCommentDelete = async (commentId: number) => {
        if (!id) return;

        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            await deleteComment(parseInt(id), commentId);
            fetchComments();
            setBoard(prev => prev ? ({
                ...prev,
                commentCount: prev.commentCount - 1
            }) : null);
        } catch (error) {
            console.error('댓글 삭제 실패: ', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    const handleLikeToggle = async () => {
        if (!id) return;

        if (!currentUser) {
            alert('로그인이 필요한 기능입니다.');
            navigate('/login');
            return;
        }

        try {
            const isNowLiked = await toggleLike(parseInt(id));

            setIsLiked(isNowLiked);

            setBoard(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    likeCount: isNowLiked ? prev.likeCount + 1 : prev.likeCount - 1
                }
            });
        } catch (error) {
            console.error('좋아요 처리 실패: ', error);
            alert('좋아요 처리에 실패했습니다.');
        }
    };

    if (loading) {
        return <div className="loading">불러오는 중</div>;
    };

    if (!board) {
        return <div className="error">게시글을 찾을 수 없습니다.</div>;
    };

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
                                src={getImageUrl(board.authorProfileImageUrl) || ''}
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
                        <span>댓글 {board.commentCount}</span>
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
                                src={getImageUrl(image.imageUrl) || ''}
                                alt={image.originalFileName || '이미지'}
                            />
                        ))}
                    </div>
                )}
                {/* 액션 버튼 */}
                <div className="board-actions">
                    <button 
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        onClick={handleLikeToggle}
                    >
                        <img
                            src={isLiked ? Favorite_Fill : Favorite_Outline}
                            alt="좋아요"
                            className="like-icon"
                        />
                        <span>좋아요 {board.likeCount}</span>
                    </button>
                    {isAuthor && (
                        <div className="author-actions">
                            <button className="edit-button" onClick={handleEdit}>수정</button>
                            <button className="delete-button" onClick={handleDelete}>삭제</button>
                        </div>
                    )}
                </div>
                {/* 댓글 작성 */}
                <div className="comment-section">
                    <h3>댓글 {board.commentCount}</h3>
                    {currentUser ? (
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <textarea
                                value={commentContent}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentContent(e.target.value)}
                                placeholder="댓글을 입력하세요"
                                rows={3}
                            />
                            <button className="comment-submit" type="submit">댓글 작성</button>
                        </form>
                    ) : (
                        <div className="login-required">
                            댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
                        </div>
                    )}
                    <CommentList
                        comments={comments}
                        currentUser={currentUser}
                        onUpdate={handleCommentUpdate}
                        onDelete={handleCommentDelete}
                    />
                </div>
            </div>
        </div>
    );
}

export default BoardDetail;