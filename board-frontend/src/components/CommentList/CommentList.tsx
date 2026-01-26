import { useState } from "react";
import { Comment, User } from "../../types";
import "./CommentList.css";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface CommentListProps {
    comments: Comment[];
    currentUser: User | null;
    onUpdate: (commentId: number, newContent: string) => void;
    onDelete: (commentId: number) => void;
}

const CommentList = ({ comments, currentUser, onUpdate, onDelete }: CommentListProps) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState<string>('');

    const formatDate = (dateString: string): string => {
        try {
            return format(new Date(dateString), 'yyyy.MM.dd HH:mm', { locale: ko });
        } catch  {
            return dateString;
        }
    }

    if (!comments || comments.length === 0) {
        return <div className="no-comments">첫 댓글을 작성해보세요!</div>
    }

    const handleEditSubmit = (commentId: number) => {
        if (!editContent.trim()) {
            alert('댓글 내용을 입력해주세요');
            return;
        }
        onUpdate(commentId, editContent);
        setEditingId(null);
        setEditContent('');
    }

    const handleEditCancel = () => {
        setEditingId(null);
        setEditContent('');
    }

    const handleEditStart = (comment: Comment) => {
        setEditingId(comment.id);
        setEditContent(comment.content);
    }

    return (
        <div className="comment-list">
            {comments.map(comment => (
                <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                        <div className="comment-author">
                            {comment.authorProfileImageUrl ? (
                                <img 
                                    src={`http://localhost:8080${comment.authorProfileImageUrl}`}
                                    alt="프로필"
                                    className="comment-avatar"
                                />
                            ) : (
                                <div className="comment-avatar-default">
                                    {comment.authorNickname.charAt(0)}
                                </div>
                            )}
                            <div>
                                <div className="comment-author-name">{comment.authorNickname}</div>
                                <div className="comment-date">{formatDate(comment.createdAt)}</div>
                            </div>
                            {currentUser && currentUser.nickname === comment.authorNickname && (
                                <div className="comment-actions">
                                    {editingId === comment.id ? (
                                        <>
                                            <button onClick={() => handleEditSubmit(comment.id)}>저장</button>
                                            <button onClick={handleEditCancel}>삭제</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEditStart(comment)}>수정</button>
                                            <button onClick={() => onDelete(comment.id)}>삭제</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {editingId === comment.id ? (
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="comment-edit-textarea"
                                rows={3}
                                />
                        ) : (
                            <div className="comment-content">{comment.content}</div>
                        )}
                        {comment.images && comment.images.length > 0 && (
                            <div className="comment-images">
                                {comment.images.map(image => (
                                    <img
                                        key={image.id}
                                        src={`http://localhost:8080${image.imageUrl}`}
                                        alt={image.originalFileName || '이미지'}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CommentList;