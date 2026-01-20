import { useNavigate } from "react-router-dom";
import "./Signup.css"
import { useState } from "react";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};

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

    const handleSubmit = async (e) => {

    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2>회원가입</h2>
            </div>
        </div>
    )
}

export default Signup;