import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeForm from './ResumeForm';
import './MyResumes.css';

const MyResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [resumeToEdit, setResumeToEdit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/resume/my', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setResumes(response.data);
            } catch (err) {
                console.error('Failed to fetch resumes:', err);
                setError('이력서를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, [navigate, showForm]);

    const handleEdit = (resume) => {
        setResumeToEdit(resume);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
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

            setResumes(resumes.filter(resume => resume.id !== id));
            alert('이력서가 삭제되었습니다.');
        } catch (err) {
            console.error('Failed to delete resume:', err);
            alert('이력서 삭제에 실패했습니다.');
        }
    };

    const handleAddNew = () => {
        setResumeToEdit(null);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setResumeToEdit(null);
    };

    if (loading) {
        return <div className="loading-container">이력서를 불러오는 중...</div>;
    }

    return (
        <div className="my-resumes-container">
            <div className="my-resumes-header">
                <h1>내 이력서 관리</h1>
                {!showForm && (
                    <button className="add-resume-button" onClick={handleAddNew}>
                        새 이력서 작성
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm ? (
                <ResumeForm
                    resumeToEdit={resumeToEdit}
                    setShowForm={handleFormClose}
                />
            ) : (
                <>
                    {resumes.length === 0 ? (
                        <div className="empty-resumes">
                            <p>등록된 이력서가 없습니다. 새 이력서를 작성해보세요.</p>
                        </div>
                    ) : (
                        <div className="resume-list">
                            {resumes.map(resume => (
                                <div className="resume-card" key={resume.id}>
                                    <div className="resume-card-header">
                                        <h3 className="resume-title">{resume.title}</h3>
                                        <span className="resume-date">수정일: {resume.updatedAt}</span>
                                    </div>
                                    <div className="resume-content-preview">
                                        {resume.content.substring(0, 200)}
                                        {resume.content.length > 200 && '...'}
                                    </div>
                                    <div className="resume-actions">
                                        <button
                                            className="view-button"
                                            onClick={() => navigate(`/resume/${resume.id}`)}
                                        >
                                            상세보기
                                        </button>
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(resume)}
                                        >
                                            수정
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(resume.id)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyResumes;