import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResumeForm.css';

// 아이콘 컴포넌트들
const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17,21 17,13 7,13 7,21"></polyline>
        <polyline points="7,3 7,8 15,8"></polyline>
    </svg>
);

const EditIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12,19 5,12 12,5"></polyline>
    </svg>
);

const ResumeForm = ({ resumeToEdit, setShowForm }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: resumeToEdit?.title || '',
        content: resumeToEdit?.content || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    useEffect(() => {
        setCharacterCount(form.content.length);
    }, [form.content]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'content') {
            setCharacterCount(value.length);
        }

        // 에러 메시지 초기화
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        if (!form.title.trim()) {
            setError('이력서 제목을 입력해주세요.');
            return false;
        }

        if (form.title.trim().length < 2) {
            setError('이력서 제목은 최소 2글자 이상 입력해주세요.');
            return false;
        }

        if (!form.content.trim()) {
            setError('이력서 내용을 입력해주세요.');
            return false;
        }

        if (form.content.trim().length < 50) {
            setError('이력서 내용은 최소 50글자 이상 입력해주세요.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const submitData = {
                title: form.title.trim(),
                content: form.content.trim()
            };

            let response;
            if (resumeToEdit) {
                // 이력서 수정
                response = await axios.put(
                    `http://localhost:8080/api/resume/${resumeToEdit.id}`,
                    submitData,
                    config
                );
                setSuccess('이력서가 성공적으로 수정되었습니다!');
            } else {
                // 새 이력서 작성
                response = await axios.post(
                    'http://localhost:8080/api/resume',
                    submitData,
                    config
                );
                setSuccess('이력서가 성공적으로 등록되었습니다!');
            }

            // 성공 메시지를 잠시 보여준 후 페이지 이동
            setTimeout(() => {
                if (setShowForm) {
                    setShowForm(false);
                } else {
                    navigate('/my-resumes');
                }
            }, 2000);

        } catch (err) {
            console.error('Resume submission error:', err);

            if (err.response?.status === 401) {
                setError('로그인이 필요합니다. 다시 로그인해주세요.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.response?.status === 403) {
                setError('이력서 저장 권한이 없습니다.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('이력서 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (form.title.trim() || form.content.trim()) {
            const confirmLeave = window.confirm(
                '작성 중인 내용이 있습니다. 정말로 나가시겠습니까?\n(저장되지 않은 내용은 사라집니다.)'
            );
            if (!confirmLeave) return;
        }

        if (setShowForm) {
            setShowForm(false);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="resume-form-page">
            <div className="resume-form-container">
                {/* 헤더 섹션 */}
                <div className="form-header">
                    <h1 className="form-title">
                        {resumeToEdit ? '이력서 수정하기' : '새로운 이력서 작성'}
                    </h1>
                    <p className="form-subtitle">
                        {resumeToEdit
                            ? '기존 이력서를 수정하여 더 나은 이력서로 만들어보세요'
                            : '나만의 특별한 이력서를 작성하여 꿈의 직장에 한 걸음 더 가까워지세요'
                        }
                    </p>
                </div>

                {/* 메인 폼 */}
                <form className="resume-form" onSubmit={handleSubmit}>
                    {/* 상태 메시지들 */}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    {/* 이력서 제목 */}
                    <div className="form-group">
                        <label htmlFor="title">이력서 제목</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="예: 프론트엔드 개발자 김철수, 마케팅 전문가 이영희"
                            maxLength="100"
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* 이력서 내용 */}
                    <div className="form-group">
                        <label htmlFor="content">이력서 내용</label>
                        <div className="textarea-container" data-counter={`${characterCount.toLocaleString()}자`}>
                            <textarea
                                id="content"
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                placeholder="이력서 내용을 상세히 작성해주세요.

📋 포함하면 좋은 내용:
• 개인정보 (이름, 연락처, 이메일)
• 희망 직무 및 목표
• 학력 사항
• 경력 사항 (회사명, 기간, 담당 업무, 성과)
• 보유 기술 및 역량
• 프로젝트 경험
• 자격증 및 어학 능력
• 수상 경력
• 기타 특이사항

💡 작성 팁:
• 구체적인 수치와 성과를 포함하세요
• 간결하고 명확한 문장으로 작성하세요
• 희망하는 직무와 관련된 경험을 강조하세요"
                                rows="20"
                                maxLength="10000"
                                required
                            />
                        </div>
                    </div>

                    {/* 폼 액션 버튼들 */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            <ArrowLeftIcon />
                            취소
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading || !form.title.trim() || !form.content.trim()}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    저장 중...
                                </>
                            ) : resumeToEdit ? (
                                <>
                                    <EditIcon />
                                    수정하기
                                </>
                            ) : (
                                <>
                                    <SaveIcon />
                                    저장하기
                                </>
                            )}
                        </button>
                    </div>

                    {/* 도움말 섹션 */}
                    <div className="help-section">
                        <h3 className="help-title">이력서 작성 가이드</h3>
                        <div className="help-content">
                            <p><strong>효과적인 이력서 작성을 위한 팁:</strong></p>
                            <ul>
                                <li>명확하고 구체적인 제목을 사용하세요</li>
                                <li>최신 경력부터 시간 순서대로 작성하세요</li>
                                <li>정량적인 성과와 데이터를 포함하세요</li>
                                <li>지원하는 직무와 관련된 키워드를 활용하세요</li>
                                <li>맞춤법과 띄어쓰기를 꼼꼼히 확인하세요</li>
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResumeForm;