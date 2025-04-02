import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ResumeDetail.css';

const ResumeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchResume = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/resume/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setResume(response.data);
            } catch (err) {
                console.error('Failed to fetch resume details:', err);
                setError('이력서를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id, navigate]);

    const handleEdit = () => {
        navigate(`/resume/edit/${id}`, { state: { resume } });
    };

    const handleDelete = async () => {
        if (!window.confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/resume/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('이력서가 삭제되었습니다.');
            navigate('/my-resumes');
        } catch (err) {
            console.error('Failed to delete resume:', err);
            alert('이력서 삭제에 실패했습니다.');
        }
    };

    if (loading) {
        return <div className="loading-container">이력서를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (!resume) {
        return <div className="error-container">이력서를 찾을 수 없습니다.</div>;
    }

    // 로그인한 사용자의 이메일과 이력서 작성자의 이메일 비교하여 수정/삭제 권한 확인
    const isOwner = user && user.email === resume.userEmail;

    return (
        <div className="resume-detail-container">
            <div className="resume-detail-header">
                <h1 className="resume-detail-title">{resume.title}</h1>
                <div className="resume-meta">
                    <span className="resume-author">작성자: {resume.userName}</span>
                    <span className="resume-date">최종 수정일: {resume.updatedAt}</span>
                </div>

                <div className="resume-actions">
                    <button
                        className="back-button"
                        onClick={() => navigate('/my-resumes')}
                    >
                        목록으로
                    </button>

                    {isOwner && (
                        <>
                            <button
                                className="edit-button"
                                onClick={handleEdit}
                            >
                                수정
                            </button>
                            <button
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                삭제
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="resume-detail-content">
                <div className="content-section">
                    {resume.content.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeDetail;