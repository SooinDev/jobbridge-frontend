import React, { useState, useEffect } from 'react';
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
        phonenumber: '',
        userType: 'individual'
    });

    const [codeSent, setCodeSent] = useState(false);
    const [verifyingCode, setVerifyingCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 타이머 관련 상태 추가
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    // 타이머 설정 - 인증번호 발송 시 시작
    useEffect(() => {
        let intervalId;

        if (timerActive && timeLeft > 0) {
            intervalId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
            // 시간이 다 되면 인증번호 재발송 필요
            if (!emailVerified) {
                setCodeSent(false);
            }
        }

        return () => clearInterval(intervalId);
    }, [timerActive, timeLeft, emailVerified]);

    // 시간 형식 변환 함수 (초 -> 분:초)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'email') {
            setEmailVerified(false);
            setCodeSent(false);
            setTimerActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailVerified) {
            setError('이메일 인증이 필요합니다.');
            return;
        }

        if (form.pw !== form.pwConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { pwConfirm: _, ...submitData } = form;

            submitData.userType = submitData.userType.toUpperCase();
            await axios.post('http://localhost:8080/api/user/signup', submitData);
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (err) {
            setError(`회원가입 실패: ${err.response?.data || '서버 오류'}`);
            console.error('Signup error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerificationCode = async () => {
        if (!form.email) {
            setError('이메일을 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setError('');
        try {
            await axios.post('http://localhost:8080/api/user/send-code', { email: form.email });

            setCodeSent(true);

            // 타이머 설정 (5분 = 300초)
            setTimeLeft(300);
            setTimerActive(true);

            alert('인증번호가 이메일로 전송되었습니다.');
        } catch (err) {
            setError('인증번호 전송에 실패했습니다.');
            console.error(err);
        }
    };

    const handleVerifyCode = async () => {
        setVerifyingCode(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/user/verify', {
                email: form.email,
                code: verificationCode
            });

            alert(response.data); // "이메일 인증이 완료되었습니다!"
            setEmailVerified(true);
            setTimerActive(false); // 인증 성공 시 타이머 중지
        } catch (err) {
            console.error('인증 실패:', err);
            setError(err.response?.data || '인증 중 오류가 발생했습니다.');
        } finally {
            setVerifyingCode(false);
        }
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
                                onClick={handleSendVerificationCode}
                                disabled={codeSent || !form.email}
                            >
                                {codeSent ? '발송됨' : '인증번호 발송'}
                            </button>
                        </div>
                    </div>

                    {codeSent && (
                        <div className="form-group">
                            <label htmlFor="verificationCode">
                                인증번호 입력
                                {timerActive && !emailVerified && (
                                    <span className="verification-timer">
                                        {` (남은 시간: ${formatTime(timeLeft)})`}
                                    </span>
                                )}
                            </label>
                            <div className="input-container">
                                <input
                                    id="verificationCode"
                                    name="verificationCode"
                                    type="text"
                                    placeholder="6자리 숫자 입력"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    disabled={emailVerified}
                                />
                                <button
                                    type="button"
                                    className="verify-button"
                                    onClick={handleVerifyCode}
                                    disabled={verifyingCode || verificationCode.length !== 6 || emailVerified || timeLeft === 0}
                                >
                                    {verifyingCode ? '확인 중...' : emailVerified ? '인증됨' : '인증 확인'}
                                </button>
                            </div>
                            {timeLeft === 0 && !emailVerified && codeSent && (
                                <div className="verification-expired">
                                    인증 시간이 만료되었습니다. 인증번호를 재발송 해주세요.
                                    <button
                                        type="button"
                                        className="resend-button"
                                        onClick={handleSendVerificationCode}
                                    >
                                        재발송
                                    </button>
                                </div>
                            )}
                            {emailVerified && (
                                <div className="email-verified-message">
                                    ✓ 인증된 이메일입니다
                                </div>
                            )}
                        </div>
                    )}

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
                        <label htmlFor="phonenumber">전화번호</label>
                        <input
                            id="phonenumber"
                            name="phonenumber"
                            placeholder="전화번호를 입력하세요"
                            value={form.phonenumber}
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