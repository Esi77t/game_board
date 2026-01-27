import { Link, useNavigate } from "react-router-dom";
import "./Signup.css"
import { ChangeEvent, FormEvent, useState } from "react";
import { signup } from "../../api/auth";
import { SignUpRequest } from "../../types";

interface FormData extends SignUpRequest {
    passwordConfirm: string;
}

interface FormErrors {
    [key: string]: string;
}

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        userId: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        email: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const validate = () => {
        const newErrors: FormErrors = {};

        if (formData.userId.length < 4 || formData.userId.length > 20) {
            newErrors.userId = '아이디는 4-20자여야 합니다.';
        }

        if (formData.password.length < 8 || formData.password.length > 20) {
            newErrors.password = '비밀번호는 8-20자여야 합니다.';
        }

        if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        }

        if (formData.nickname.length < 2 || formData.nickname.length > 20) {
            newErrors.nickname = '닉네임은 2-20자여야 합니다.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }

        return newErrors;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validate();
        if (Object.keys(validationError).length > 0) {
            setErrors(validationError);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const { passwordConfirm, ...signupData } = formData;
            await signup(signupData);

            alert("회원가입이 완료되었습니다.");
            navigate("/login");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "회원가입에 실패했습니다.";
            setErrors({ submit: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e :ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 에러 메시지 제거
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>회원가입</h2>
                {errors.submit && <div className="error-message">{errors.submit}</div>}
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
                            placeholder="4~20자 이내로 입력해주세요."
                        />
                        {errors.userId && <span className="field-error">{errors.userId}</span>}
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
                            placeholder="8~20자 이내로 입력해주세요."
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordConfirm">비밀번호 확인</label>
                        <input
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                            placeholder="비밀번호를 다시 입력해주세요."
                        />
                        {errors.passwordConfirm && <span className="field-error">{errors.passwordConfirm}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="nickname">닉네임</label>
                        <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            required
                            placeholder="2~20자 이내로 입력해주세요."
                        />
                        {errors.nickname && <span className="field-error">{errors.nickname}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">아이디</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@email.com"
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? '회원가입 중...' : '회원가입'}
                    </button>
                </form>
                <div className="signup-footer">
                    <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup;