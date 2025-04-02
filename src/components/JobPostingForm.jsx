import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobPostingForm.css';

const JobPostingForm = ({ jobToEdit, setShowForm }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: jobToEdit?.title || '',
        position: jobToEdit?.position || '',
        description: jobToEdit?.description || '',
        requiredSkills: jobToEdit?.requiredSkills || '',
        experienceLevel: jobToEdit?.experienceLevel || '',
        location: jobToEdit?.location || '',
        salary: jobToEdit?.salary || '',
        deadline: jobToEdit?.deadline ? jobToEdit.deadline.substring(0, 10) : ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.title || !form.position || !form.description) {
            setError('제목, 직무, 설명은 필수 입력 항목입니다.');
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

            // deadline 형식 변환
            const formData = {
                ...form,
                deadline: form.deadline ? new Date(form.deadline + 'T23:59:59') : null
            };

            if (jobToEdit) {
                // 채용공고 수정
                await axios.put(
                    `http://localhost:8080/api/job-posting/${jobToEdit.id}`,
                    formData,
                    config
                );
            } else {
                // 새 채용공고 작성
                await axios.post(
                    'http://localhost:8080/api/job-posting',
                    formData,
                    config
                );
            }

            alert(jobToEdit ? '채용공고가 수정되었습니다!' : '채용공고가 등록되었습니다!');
            if (setShowForm) {
                setShowForm(false);
            } else {
                navigate('/my-job-postings');
            }
        } catch (err) {
            console.error('Job posting submission error:', err);
            setError(err.response?.data || '채용공고 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="job-form-container">
            <form className="job-form" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {jobToEdit ? '채용공고 수정' : '새 채용공고 작성'}
                </h2>

                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="title">공고 제목</label>
                    <input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="채용공고 제목을 입력하세요"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="position">직무</label>
                        <input
                            id="position"
                            name="position"
                            value={form.position}
                            onChange={handleChange}
                            placeholder="백엔드 개발자, 마케팅 매니저 등"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="experienceLevel">경력 요건</label>
                        <input
                            id="experienceLevel"
                            name="experienceLevel"
                            value={form.experienceLevel}
                            onChange={handleChange}
                            placeholder="신입, 경력 3년 이상 등"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="location">근무지</label>
                        <input
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="서울 강남구, 재택근무 등"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="salary">급여</label>
                        <input
                            id="salary"
                            name="salary"
                            value={form.salary}
                            onChange={handleChange}
                            placeholder="회사 내규에 따름, 3600만원 이상 등"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="requiredSkills">필요 기술</label>
                    <input
                        id="requiredSkills"
                        name="requiredSkills"
                        value={form.requiredSkills}
                        onChange={handleChange}
                        placeholder="Java, Spring, React 등"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="deadline">마감일</label>
                    <input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={form.deadline}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">상세 내용</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="직무 내용, 자격 요건, 우대사항 등을 상세히 입력해주세요"
                        rows="12"
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
                        {loading ? '저장 중...' : jobToEdit ? '수정하기' : '저장하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobPostingForm;