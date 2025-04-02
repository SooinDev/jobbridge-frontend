import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobPostingDetail.css';

const JobPostingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchJobPosting = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:8080/api/job-posting/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setJob(response.data);
            } catch (err) {
                console.error('Failed to fetch job posting details:', err);
                setError('채용공고를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobPosting();
    }, [id, navigate]);

    const handleEdit = () => {
        navigate(`/job-posting/edit/${id}`, { state: { job } });
    };

    const handleDelete = async () => {
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

            alert('채용공고가 삭제되었습니다.');
            navigate('/my-job-postings');
        } catch (err) {
            console.error('Failed to delete job posting:', err);
            alert('채용공고 삭제에 실패했습니다.');
        }
    };

    const handleApply = () => {
        alert('지원 기능은 아직 개발 중입니다.');
        // 추후 이력서 선택 및 지원 기능 개발
    };

    if (loading) {
        return <div className="loading-container">채용공고를 불러오는 중...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (!job) {
        return <div className="error-container">채용공고를 찾을 수 없습니다.</div>;
    }

    // 로그인한 사용자의 회사 여부 확인하여 수정/삭제 권한 부여
    const isCompanyOwner = user && user.userType === 'COMPANY' && user.email === job.companyEmail;
    const isIndividual = user && user.userType === 'INDIVIDUAL';

    return (
        <div className="job-detail-container">
            <div className="job-detail-header">
                <h1 className="job-detail-title">{job.title}</h1>
                <div className="company-info">
                    <span className="company-name">{job.companyName}</span>
                    <span className="post-date">등록일: {job.createdAt}</span>
                </div>

                <div className="job-actions">
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        목록으로
                    </button>

                    {isCompanyOwner && (
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

                    {isIndividual && (
                        <button
                            className="apply-button"
                            onClick={handleApply}
                        >
                            지원하기
                        </button>
                    )}
                </div>
            </div>

            <div className="job-detail-content">
                <div className="job-overview">
                    <div className="overview-item">
                        <div className="overview-label">직무</div>
                        <div className="overview-value">{job.position}</div>
                    </div>
                    <div className="overview-item">
                        <div className="overview-label">경력</div>
                        <div className="overview-value">{job.experienceLevel || '무관'}</div>
                    </div>
                    <div className="overview-item">
                        <div className="overview-label">근무지</div>
                        <div className="overview-value">{job.location || '미정'}</div>
                    </div>
                    <div className="overview-item">
                        <div className="overview-label">급여</div>
                        <div className="overview-value">{job.salary || '회사 내규에 따름'}</div>
                    </div>
                    {job.requiredSkills && (
                        <div className="overview-item">
                            <div className="overview-label">기술 스택</div>
                            <div className="overview-value">{job.requiredSkills}</div>
                        </div>
                    )}
                    {job.deadline && (
                        <div className="overview-item">
                            <div className="overview-label">마감일</div>
                            <div className="overview-value">{job.deadline}</div>
                        </div>
                    )}
                </div>

                <h3 className="section-title">상세 내용</h3>
                <div className="description-section">
                    {job.description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {isIndividual && (
                    <div className="apply-section">
                        <button
                            className="apply-button-large"
                            onClick={handleApply}
                        >
                            이 공고에 지원하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPostingDetail;