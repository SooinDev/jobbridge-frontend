import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import JobPostingForm from './JobPostingForm';
import './MyJobPostings.css';

const MyJobPostings = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [jobToEdit, setJobToEdit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/job-posting/my', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setJobPostings(response.data);
            } catch (err) {
                console.error('Failed to fetch job postings:', err);
                setError('채용공고를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobPostings();
    }, [navigate, showForm]);

    const handleEdit = (job) => {
        setJobToEdit(job);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('정말로 이 채용공고를 삭제하시겠습니까?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/job-posting/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setJobPostings(jobPostings.filter(job => job.id !== id));
            alert('채용공고가 삭제되었습니다.');
        } catch (err) {
            console.error('Failed to delete job posting:', err);
            alert('채용공고 삭제에 실패했습니다.');
        }
    };

    const handleAddNew = () => {
        setJobToEdit(null);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setJobToEdit(null);
    };

    if (loading) {
        return <div className="loading-container">채용공고를 불러오는 중...</div>;
    }

    return (
        <div className="my-jobs-container">
            <div className="my-jobs-header">
                <h1>채용공고 관리</h1>
                {!showForm && (
                    <button className="add-job-button" onClick={handleAddNew}>
                        새 채용공고 등록
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm ? (
                <JobPostingForm
                    jobToEdit={jobToEdit}
                    setShowForm={handleFormClose}
                />
            ) : (
                <>
                    {jobPostings.length === 0 ? (
                        <div className="empty-jobs">
                            <p>등록된 채용공고가 없습니다. 새 채용공고를 등록해보세요.</p>
                        </div>
                    ) : (
                        <div className="job-list">
                            {jobPostings.map(job => (
                                <div className="job-card" key={job.id}>
                                    <div className="job-card-header">
                                        <h3 className="job-title">{job.title}</h3>
                                        <div className="job-tags">
                                            <span className="job-position">{job.position}</span>
                                            {job.deadline && (
                                                <span className="job-deadline">마감일: {job.deadline}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="job-details">
                                        <div className="job-detail-item">
                                            <span className="detail-label">근무지:</span>
                                            <span className="detail-value">{job.location || '미정'}</span>
                                        </div>
                                        <div className="job-detail-item">
                                            <span className="detail-label">경력:</span>
                                            <span className="detail-value">{job.experienceLevel || '무관'}</span>
                                        </div>
                                        <div className="job-detail-item">
                                            <span className="detail-label">급여:</span>
                                            <span className="detail-value">{job.salary || '회사 내규에 따름'}</span>
                                        </div>
                                        <div className="job-detail-item">
                                            <span className="detail-label">기술:</span>
                                            <span className="detail-value">{job.requiredSkills || '-'}</span>
                                        </div>
                                    </div>
                                    <div className="job-description-preview">
                                        {job.description.substring(0, 150)}
                                        {job.description.length > 150 && '...'}
                                    </div>
                                    <div className="job-actions">
                                        <button
                                            className="view-button"
                                            onClick={() => navigate(`/job-posting/${job.id}`)}
                                        >
                                            상세보기
                                        </button>
                                        <button
                                            className="edit-button"
                                            onClick={() => handleEdit(job)}
                                        >
                                            수정
                                        </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDelete(job.id)}
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

export default MyJobPostings;