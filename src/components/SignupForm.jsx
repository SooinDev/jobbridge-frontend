import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css';
// FontAwesome 아이콘 사용 (실제 사용 시 설치 필요: npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons)
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser, faBuilding, faEnvelope, faLock, faPhone, faMapMarkerAlt, faIdCard, faBriefcase, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const SignupForm = () => {
    const [form, setForm] = useState({
        email: '',
        pw: '',
        pwConfirm: '', // 비밀번호 확인 필드 추가
        name: '',
        address: '',
        age: '',
        phonenumber: '',
        userType: 'individual',
        // 기업 관련 추가 필드
        companyName: '',
        businessNumber: '',
        industry: ''
    });

    const [emailVerified, setEmailVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true); // 비밀번호 일치 여부 상태

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // 이메일이 변경되면 인증 상태 초기화
        if (name === 'email') {
            setEmailVerified(false);
        }

        // 비밀번호 확인 필드 체크
        if (name === 'pw' || name === 'pwConfirm') {
            if (name === 'pw') {
                setPasswordMatch(value === form.pwConfirm || form.pwConfirm === '');
            } else {
                setPasswordMatch(value === form.pw);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!emailVerified) {
            alert('이메일 인증이 필요합니다.');
            return;
        }

        if (!passwordMatch) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 기업 선택 시 필수 필드 검증
        if (form.userType === 'company') {
            if (!form.companyName || !form.businessNumber) {
                alert('회사명과 사업자 번호는 필수 입력사항입니다.');
                return;
            }
        }

        // 전송 데이터에서 pwConfirm 제외
        const { pwConfirm: _, ...submitData } = form;

        try {
            await axios.post('http://localhost:8080/api/user/signup', submitData);
            alert('회원가입 성공!');
            // 폼 초기화
            setForm({
                email: '',
                pw: '',
                pwConfirm: '',
                name: '',
                address: '',
                age: '',
                phonenumber: '',
                userType: 'individual',
                companyName: '',
                businessNumber: '',
                industry: ''
            });
            setEmailVerified(false);
        } catch (err) {
            alert(`회원가입 실패: ${err.response?.data || '서버 오류'}`);
        }
    };

    const handleVerifyEmail = async () => {
        if (!form.email) {
            alert('이메일을 입력해주세요.');
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            alert('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setVerifying(true);

        // 실제 서버 인증 로직 대신 타이머로 시뮬레이션
        setTimeout(() => {
            setEmailVerified(true);
            setVerifying(false);
            alert('이메일 인증이 완료되었습니다.');
        }, 1500);

        // 실제 API 호출은 아래와 같이 구현할 수 있습니다
        /* try {
            await axios.post('http://localhost:8080/api/user/verify-email', { email: form.email });
            setEmailVerified(true);
            alert('인증 이메일이 발송되었습니다. 이메일을 확인해주세요.');
        } catch (err) {
            alert(`이메일 인증 실패: ${err.response?.data || '서버 오류'}`);
        } finally {
            setVerifying(false);
        } */
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2 className="signup-title">JobBridge 회원가입</h2>
                <p className="signup-subtitle">AI 기반 구인구직 플랫폼에서 새로운 기회를 만나보세요</p>

                {/* 이메일 및 인증 버튼 */}
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <div className="input-container">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
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
                            {verifying ? '인증 중...' : emailVerified ? '인증됨' : '이메일 인증'}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="pw">비밀번호</label>
                    <input
                        id="pw"
                        name="pw"
                        type="password"
                        placeholder="8자 이상의 비밀번호를 입력하세요"
                        value={form.pw}
                        onChange={handleChange}
                        required
                        minLength="8"
                    />
                </div>

                {/* 비밀번호 확인 필드 추가 */}
                <div className="form-group">
                    <label htmlFor="pwConfirm">비밀번호 확인</label>
                    <input
                        id="pwConfirm"
                        name="pwConfirm"
                        type="password"
                        placeholder="비밀번호를 다시 입력하세요"
                        value={form.pwConfirm}
                        onChange={handleChange}
                        required
                        minLength="8"
                        className={!passwordMatch && form.pwConfirm ? 'input-error' : ''}
                    />
                    {!passwordMatch && form.pwConfirm && (
                        <p className="error-message">비밀번호가 일치하지 않습니다.</p>
                    )}
                </div>

                {/* 이름과 나이를 한 줄에 배치 */}
                <div className="form-row">
                    <div className="form-col">
                        <div className="form-group">
                            <label htmlFor="name">이름</label>
                            <input
                                id="name"
                                name="name"
                                placeholder="이름을 입력하세요"
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
                                placeholder="나이를 입력하세요"
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
                        placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
                        value={form.phonenumber}
                        onChange={handleChange}
                    />
                </div>

                {/* 기업/개인 선택 영역 */}
                <div className="user-type-container">
                    <div className="user-type-option">
                        <input
                            id="individual"
                            type="radio"
                            name="userType"
                            value="individual"
                            checked={form.userType === 'individual'}
                            onChange={handleChange}
                        />
                        <label htmlFor="individual">개인</label>
                    </div>
                    <div className="user-type-option">
                        <input
                            id="company"
                            type="radio"
                            name="userType"
                            value="company"
                            checked={form.userType === 'company'}
                            onChange={handleChange}
                        />
                        <label htmlFor="company">기업</label>
                    </div>
                </div>

                {/* 기업 선택 시 추가 필드 표시 */}
                {form.userType === 'company' && (
                    <div className="company-fields">
                        <div className="form-group">
                            <label htmlFor="companyName">회사명</label>
                            <input
                                id="companyName"
                                name="companyName"
                                placeholder="회사명을 입력하세요"
                                value={form.companyName}
                                onChange={handleChange}
                                required={form.userType === 'company'}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="businessNumber">사업자 등록번호</label>
                            <input
                                id="businessNumber"
                                name="businessNumber"
                                placeholder="사업자 등록번호를 입력하세요 (예: 123-45-67890)"
                                value={form.businessNumber}
                                onChange={handleChange}
                                required={form.userType === 'company'}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="industry">업종</label>
                            <input
                                id="industry"
                                name="industry"
                                placeholder="업종을 입력하세요"
                                value={form.industry}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                )}

                <button type="submit" className="submit-button">가입하기</button>
            </form>
        </div>
    );
};

export default SignupForm;