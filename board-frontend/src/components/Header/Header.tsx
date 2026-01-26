import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { User } from "../../types";

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // 로그인 상태 확인
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
    }

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <h1>게시판</h1>
                </Link>
                <nav className="header-nav">
                    {isLoggedIn ? (
                        <>
                            <span className="header-user">{user?.nickname}님</span>
                            <Link to="/boards/write" className="header-link">글쓰기</Link>
                            <Link to="/mypage" className="header-link">마이페이지</Link>
                            <button onClick={handleLogout} className="header-button">로그아웃</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="header-link">로그인</Link>
                            <Link to="/signup" className="header-link">회원가입</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;