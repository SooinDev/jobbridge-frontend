import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResumeForm.css';

const ResumeForm = ({ resumeToEdit, setShowForm }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: resumeToEdit?.title || '',
        content: resumeToEdit?.content || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.content) {
            setError('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            let response;
            if (resumeToEdit) {
                // 이력서 수정
                response = await axios.put(
                    `http://localhost:8080/api/resume/${resumeToEdit.id}`,
                    form,
                    config
                );
            } else {
                // 새 이력서 작성
                response = await axios.post(
                    'http://localhost:8080/api/resume',
                    form,
                    config
                );
            }

            alert(resumeToEdit ? '이력서가 수정되었습니다!' : '이력서가 등록되었습니다!');
            if (setShowForm) {
                setShowForm(false);
            } else {
                navigate('/my-resumes');
            }
        } catch (err) {
            console.error('Resume submission error:', err);
            setError(err.response?.data || '이력서 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="resume-form-container">
            <form className="resume-form" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {resumeToEdit ? '이력서 수정' : '새 이력서 작성'}
                </h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="title">이력서 제목</label>
                    <input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="이력서 제목을 입력하세요"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">이력서 내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        placeholder="이력서 내용을 입력하세요"
                        rows="15"
                        required
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setShowForm ? setShowForm(false) : navigate(-1)}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? '저장 중...' : resumeToEdit ? '수정하기' : '저장하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResumeForm;