import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignupForm.css';

const SignupForm = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        pw: '',
        pwConfirm: '',
        name: '',
        age: '',
        address: '',
        phone: '',
        userType: 'individual'
    });

    const [emailVerified, setEmailVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'email') {
            setEmailVerified(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailVerified) {
            setError('이메일 인증이 필요합니다.');
            return;
        }

        // 비밀번호 일치 확인
        if (form.pw !== form.pwConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 전송 데이터에서 pwConfirm 제외
            const { pwConfirm: _, ...submitData } = form;
            // userType을 대문자로 변환 (INDIVIDUAL, COMPANY)
            submitData.userType = submitData.userType.toUpperCase();
            await axios.post('http://localhost:8080/api/user/signup', submitData);
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');

            // 회원가입 성공 시 로그인 페이지로 이동
            navigate('/login');
        } catch (err) {
            setError(`회원가입 실패: ${err.response?.data || '서버 오류'}`);
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!form.email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setVerifying(true);
        setError('');

        // 실제 서버 인증 로직 대신 타이머로 시뮬레이션
        setTimeout(() => {
            setEmailVerified(true);
            setVerifying(false);
            alert('이메일 인증이 완료되었습니다.');
        }, 1500);
    };

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <h1 className="signup-title">JobBridge 회원가입</h1>
                    <p className="signup-subtitle">AI 기반 구인구직 플랫폼에서 새로운 기회를 만나보세요</p>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <div className="input-container">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="verify-button"
                                onClick={handleVerifyEmail}
                                disabled={verifying || emailVerified}
                            >
                                {verifying ? '인증 중...' : emailVerified ? '인증됨' : '인증'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="pw">비밀번호</label>
                        <input
                            id="pw"
                            name="pw"
                            type="password"
                            placeholder="8자 이상의 비밀번호"
                            value={form.pw}
                            onChange={handleChange}
                            required
                            minLength="8"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pwConfirm">비밀번호 확인</label>
                        <input
                            id="pwConfirm"
                            name="pwConfirm"
                            type="password"
                            placeholder="비밀번호 확인"
                            value={form.pwConfirm}
                            onChange={handleChange}
                            required
                            minLength="8"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-col">
                            <div className="form-group">
                                <label htmlFor="name">이름</label>
                                <input
                                    id="name"
                                    name="name"
                                    placeholder="이름"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-col">
                            <div className="form-group">
                                <label htmlFor="age">나이</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="나이"
                                    value={form.age}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">주소</label>
                        <input
                            id="address"
                            name="address"
                            placeholder="주소를 입력하세요"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">전화번호</label>
                        <input
                            id="phone"
                            name="phone"
                            placeholder="전화번호를 입력하세요"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>회원 유형</label>
                        <div className="user-type-container">
                            <label className="user-type-option">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="individual"
                                    checked={form.userType === 'individual'}
                                    onChange={handleChange}
                                />
                                <span>개인 회원</span>
                            </label>
                            <label className="user-type-option">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="company"
                                    checked={form.userType === 'company'}
                                    onChange={handleChange}
                                />
                                <span>기업 회원</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? '가입 중...' : '가입하기'}
                    </button>

                    <p className="login-link">
                        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;