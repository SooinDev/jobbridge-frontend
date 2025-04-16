import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobPostingDetail.css';
import "../styles/common.css"; // 공통 스타일

// 아이콘 컴포넌트
const IconBack = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const IconDelete = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const IconApply = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const IconLocation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const IconExperience = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const IconSalary = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const IconPosition = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-3a2 2 0 0 0-2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 0-2-2H0"></path>
        <rect x="8" y="2" width="8" height="5" rx="1"></rect>
    </svg>
);

const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const IconSkill = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const IconHash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <line x1="4" y1="15" x2="20" y2="15"></line>
        <line x1="10" y1="3" x2="8" y2="21"></line>
        <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
);

const IconWarning = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const ErrorIllustration = () => (
    <svg className="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
        <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
        <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
    </svg>
);

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

    const handleApply = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            await axios.post(
                `http://localhost:8080/api/apply/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("지원이 완료되었습니다.");
        } catch (error) {
            console.error("지원 오류:", error);
            alert("지원에 실패했습니다. 나중에 다시 시도해주세요.");
        }
    };

    // 회사 이니셜 가져오기
    const getCompanyInitials = (companyName) => {
        if (!companyName) return '?';
        return companyName.charAt(0).toUpperCase();
    };

    // 날짜 형식화
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 마감일까지 남은 일수 계산
    const getDaysRemaining = (dateString) => {
        if (!dateString) return null;

        const deadline = new Date(dateString);
        const today = new Date();

        // 시간 제거하고 날짜만 비교
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);

        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    // 스킬 태그 분리
    const getSkillTags = (skillsString) => {
        if (!skillsString) return [];
        return skillsString.split(',').map(skill => skill.trim());
    };

    // 스켈레톤 로딩 UI
    const renderSkeleton = () => (
        <>
            <div className="job-detail-skeleton">
                <div className="skeleton-title"></div>
                <div className="skeleton-company">
                    <div className="skeleton-badge"></div>
                    <div className="skeleton-name"></div>
                </div>
                <div className="skeleton-actions">
                    <div className="skeleton-button skeleton-button-1"></div>
                    <div className="skeleton-button skeleton-button-2"></div>
                </div>
            </div>

            <div className="job-detail-skeleton">
                <div className="skeleton-overview">
                    <div className="skeleton-item">
                        <div className="skeleton-label"></div>
                        <div className="skeleton-value"></div>
                    </div>
                    <div className="skeleton-item">
                        <div className="skeleton-label"></div>
                        <div className="skeleton-value"></div>
                    </div>
                    <div className="skeleton-item">
                        <div className="skeleton-label"></div>
                        <div className="skeleton-value"></div>
                    </div>
                    <div className="skeleton-item">
                        <div className="skeleton-label"></div>
                        <div className="skeleton-value"></div>
                    </div>
                </div>

                <div className="skeleton-section-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
            </div>
        </>
    );

    if (loading) {
        return (
            <div className="job-detail-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p className="loading-text">채용공고를 불러오는 중...</p>
                </div>
                {renderSkeleton()}
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <ErrorIllustration />
                <h3>채용공고를 불러올 수 없습니다</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>
                    <IconBack /> 이전 페이지로 돌아가기
                </button>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="error-container">
                <ErrorIllustration />
                <h3>채용공고를 찾을 수 없습니다</h3>
                <p>요청하신 채용공고가 존재하지 않거나 삭제되었을 수 있습니다.</p>
                <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
                    <IconBack /> 일자리 목록으로 돌아가기
                </button>
            </div>
        );
    }

    // 로그인한 사용자가 채용공고 작성자인지 확인 (companyEmail이 있으면 그걸로, 없으면 이름으로)
    const isCompanyOwner = user &&
        user.userType === 'COMPANY' &&
        (job.companyEmail ?
            user.email === job.companyEmail :
            user.name === job.companyName);

    const isIndividual = user && user.userType === 'INDIVIDUAL';

    // 채용 마감 여부 확인
    const daysRemaining = job.deadline ? getDaysRemaining(job.deadline) : null;
    const isDeadlinePassed = daysRemaining !== null && daysRemaining < 0;
    const isUrgent = daysRemaining !== null && daysRemaining <= 3 && daysRemaining >= 0;

    return (
        <div className="job-detail-container">
            <div className="job-detail-header">
                <h1 className="job-detail-title">{job.title}</h1>
                <div className="company-info">
                    <div className="company-name-container">
                        <div className="company-badge">{getCompanyInitials(job.companyName)}</div>
                        <span className="company-name">{job.companyName}</span>
                    </div>
                    <span className="post-date">
                        <IconClock /> 등록일: {formatDate(job.createdAt)}
                    </span>
                </div>

                <div className="job-actions">
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <IconBack /> 목록으로
                    </button>

                    {isCompanyOwner && (
                        <>
                            <button
                                className="edit-button"
                                onClick={handleEdit}
                            >
                                <IconEdit /> 수정
                            </button>
                            <button
                                className="delete-button"
                                onClick={handleDelete}
                            >
                                <IconDelete /> 삭제
                            </button>
                        </>
                    )}

                    {isIndividual && !isDeadlinePassed && (
                        <button
                            className="apply-button"
                            onClick={handleApply}
                        >
                            <IconApply /> 지원하기
                        </button>
                    )}

                    {isIndividual && isDeadlinePassed && (
                        <button
                            className="apply-button-closed"
                            disabled
                        >
                            마감된 공고
                        </button>
                    )}
                </div>
            </div>

            <div className="job-detail-content">
                <div className="job-overview">
                    <div className="overview-item">
                        <div className="overview-label">
                            <div className="overview-icon"><IconPosition /></div> 직무
                        </div>
                        <div className="overview-value">{job.position}</div>
                    </div>
                    <div className="overview-item">
                        <div className="overview-label">
                            <div className="overview-icon"><IconExperience /></div> 경력
                        </div>
                        <div className="overview-value">{job.experienceLevel || '무관'}</div>
                    </div>
                    <div className="overview-item">
                        <div className="overview-label">
                            <div className="overview-icon"><IconLocation /></div> 근무지
                        </div>
                        <div className="overview-value">{job.location || '미정'}</div>
                    </div>
                    <div className="overview-item">
                        <div className="overview-label">
                            <div className="overview-icon"><IconSalary /></div> 급여
                        </div>
                        <div className="overview-value">{job.salary || '회사 내규에 따름'}</div>
                    </div>
                    {job.requiredSkills && (
                        <div className="overview-item">
                            <div className="overview-label">
                                <div className="overview-icon"><IconSkill /></div> 기술 스택
                            </div>
                            <div className="overview-value">
                                <div className="skill-tags">
                                    {getSkillTags(job.requiredSkills).map((skill, index) => (
                                        <span className="skill-tag" key={index}>
                                            <IconHash /> {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {job.deadline && (
                        <div className="overview-item">
                            <div className="overview-label">
                                <div className="overview-icon"><IconCalendar /></div> 마감일
                            </div>
                            <div className={`overview-value ${isDeadlinePassed ? 'deadline-passed' : ''}`}>
                                {formatDate(job.deadline)}
                                {isUrgent && !isDeadlinePassed && (
                                    <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }}>
                                        {daysRemaining === 0 ? '오늘 마감' : `D-${daysRemaining}`}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <h3 className="section-title">상세 내용</h3>
                <div className="description-section">
                    {job.description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>

                {isIndividual && !isDeadlinePassed && (
                    <div className="apply-section">
                        <button
                            className="apply-button-large"
                            onClick={handleApply}
                        >
                            <IconApply /> 이 공고에 지원하기
                        </button>
                    </div>
                )}

                {isIndividual && isDeadlinePassed && (
                    <div className="apply-section">
                        <div className="deadline-notice">
                            <IconWarning />
                            이 채용공고는 마감되었습니다
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPostingDetail;