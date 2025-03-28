import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = () => {
    const [form, setForm] = useState({
        email: '',
        pw: '',
        name: '',
        address: '',
        age: '',
        phonenumber: '',
        userType: 'individual'  // 기본값을 개인으로 설정
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/user/signup', form);
            alert('회원가입 성공!');
            // 폼 초기화
            setForm({
                email: '',
                pw: '',
                name: '',
                address: '',
                age: '',
                phonenumber: '',
                userType: 'individual'  // 초기화 시 기본값을 개인으로 설정
            });
        } catch (err) {
            alert(`회원가입 실패: ${err.response?.data || '서버 오류'}`);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2 className="signup-title">회원가입</h2>
                <input
                    name="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    name="pw"
                    type="password"
                    placeholder="비밀번호"
                    value={form.pw}
                    onChange={handleChange}
                    required
                />
                <input
                    name="name"
                    placeholder="이름"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    name="address"
                    placeholder="주소"
                    value={form.address}
                    onChange={handleChange}
                />
                <input
                    name="age"
                    type="number"
                    placeholder="나이"
                    value={form.age}
                    onChange={handleChange}
                />
                <input
                    name="phonenumber"
                    placeholder="전화번호"
                    value={form.phonenumber}
                    onChange={handleChange}
                />

                {/* 기업/개인 선택 추가 */}
                <div>
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            value="individual"
                            checked={form.userType === 'individual'}
                            onChange={handleChange}
                        />
                        개인
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            value="company"
                            checked={form.userType === 'company'}
                            onChange={handleChange}
                        />
                        기업
                    </label>
                </div>

                <button type="submit">가입하기</button>
            </form>
        </div>
    );
};

export default SignupForm;