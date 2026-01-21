import './BoardCard.css';
import Person_Outline from '../../assets/icons/Person_Outline.svg';
import Comment_Outline from '../../assets/icons/Comment_Outline.svg';
import Favorite_Outline from '../../assets/icons/Favorite_Outline.svg';
import { useNavigate } from 'react-router-dom';
import { ko } from 'date-fns/locale';
import { format } from 'date-fns';

const BoardCard = ({ board }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/boards/${board.id}`);
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'yyyy-MM.dd HH:mm', { locale: ko });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="board-card" onClick={handleClick}>
            {board.thumbnailUrl && (
                <div className="board-thumbnail">
                    <img src={`http://localhost:8080${board.thumbnailUrl}`} alt="thumbnail" />
                </div>
            )}
            <div className="board-content">
                <div className="board-header">
                    {board.categoryName && (
                        <span className="board-category">[{board.categoryName}]</span>
                    )}
                    <h3 className="board-title">{board.title}</h3>
                </div>
                <div className="board-info">
                    <span className="board-author">{board.authorNickname}</span>
                    <span className="board-date">{formatDate(board.createdAt)}</span>
                </div>
                <div className="board-stats">
                    <span>
                        <img src={Person_Outline} alt="조회수" className="icon" />
                        {board.viewCount}
                    </span>
                    <span>
                        <img src={Favorite_Outline} alt="좋아요" className="icon" />
                        {board.likeCount}
                    </span>
                    <span>
                        <img src={Comment_Outline} alt="댓글" className="icon" />
                        {board.commentCount}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default BoardCard;