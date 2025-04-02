import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: '',
        pw: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.pw) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/user/login', form);

            localStorage.setItem('user', JSON.stringify({
                email: form.email,
                name: response.data.name, // 백엔드에서 제공하는 이름
                userType: response.data.userType // 백엔드에서 제공하는 사용자 유형
            }));

            navigate('/');
        } catch (err) {
            console.error('Login error:', err);

            if (err.response && err.response.status === 401) {
                const message = err.response.data;
                if (typeof message === 'string' && message.includes('이메일 인증')) {
                    setError('이메일 인증이 필요합니다. 메일함에서 인증을 완료해주세요.');
                } else {
                    setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
                }
            } else {
                setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="login-title">JobBridge 로그인</h1>
                    <p className="login-subtitle">계정에 로그인하고 서비스를 이용하세요</p>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="email@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pw">비밀번호</label>
                        <input
                            id="pw"
                            name="pw"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={form.pw}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="remember-forgot">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>로그인 상태 유지</span>
                        </label>
                        <a href="#" className="forgot-password">비밀번호를 잊으셨나요?</a>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>

                    <p className="signup-link">
                        계정이 없으신가요? <Link to="/signup">회원가입</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;