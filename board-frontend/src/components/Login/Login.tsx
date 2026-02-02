import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import "./Login.css";
import { LoginRequest } from '../../types';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginRequest>({
        userId: '',
        password: ''
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData);

            // 토큰과 유저 정보 저장
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // 홈으로 이동
            navigate('/');
            window.location.reload();   // Header 업데이트 용으로
        } catch (error: any) {
            setError(error.response?.data?.message || '로그인에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>로그인</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userId">아이디</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                            placeholder="아이디를 입력하세요"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                <div className="login-footer">
                    <p>계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;