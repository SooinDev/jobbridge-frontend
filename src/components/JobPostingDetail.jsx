import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobPostingDetail.css';
import "../styles/common.css";

// 아이콘 컴포넌트들 (기존과 동일)
const IconBack = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const IconEdit = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const IconDelete = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const IconApply = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const IconClock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const IconLocation = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const IconExperience = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2 2h-4a2 2 0 0 0-2-2v16"></path>
    </svg>
);

const IconSalary = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
);

const IconPosition = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2 2h-4a2 2 0 0 0-2-2v16"></path>
    </svg>
);

const IconCalendar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const IconSkill = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const IconHash = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="4" y1="9" x2="20" y2="9"></line>
        <line x1="4" y1="15" x2="20" y2="15"></line>
        <line x1="10" y1="3" x2="8" y2="21"></line>
        <line x1="16" y1="3" x2="14" y2="21"></line>
    </svg>
);

const IconWarning = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const IconRefresh = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 2v6h6"></path>
        <path d="M21 12A9 9 0 0 0 6 5.3L3 8"></path>
        <path d="M21 22v-6h-6"></path>
        <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7"></path>
    </svg>
);

const JobPostingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 기존 상태들
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    // 이력서 선택 모달 관련 상태 추가
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [loadingResumes, setLoadingResumes] = useState(false);
    const [applyingJob, setApplyingJob] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchJobPosting();
    }, [id]);

    const fetchJobPosting = async () => {
        setLoading(true);
        setError('');

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

    // 이력서 목록 조회
    const fetchUserResumes = async () => {
        setLoadingResumes(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/resume/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('이력서 목록:', response.data);
            setResumes(response.data);

            // 이력서가 1개면 자동 선택
            if (response.data.length === 1) {
                setSelectedResumeId(response.data[0].id);
            }
        } catch (err) {
            console.error('이력서 조회 실패:', err);
            alert('이력서를 불러오는데 실패했습니다.');
        } finally {
            setLoadingResumes(false);
        }
    };

    // 지원하기 버튼 클릭 (모달 열기)
    const handleApplyClick = async () => {
        console.log('지원하기 버튼 클릭됨');
        await fetchUserResumes();
        setShowResumeModal(true);
    };

    // 실제 지원 처리
    const handleApply = async () => {
        if (!selectedResumeId) {
            alert('지원할 이력서를 선택해주세요.');
            return;
        }

        setApplyingJob(true);

        try {
            const token = localStorage.getItem("token");

            console.log('지원 요청 데이터:', {
                jobId: id,
                resumeId: selectedResumeId,
                token: token ? 'exists' : 'missing'
            });

            const response = await axios.post(
                `http://localhost:8080/api/apply/${id}?resumeId=${selectedResumeId}`,
                {}, // 빈 body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            console.log('지원 성공:', response.data);
            alert("지원이 완료되었습니다.");
            setShowResumeModal(false);

        } catch (error) {
            console.error("지원 오류:", error);
            console.error("에러 상세:", {
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });

            if (error.response?.status === 403) {
                alert("권한이 없습니다. 개인 회원만 지원할 수 있습니다.");
            } else if (error.response?.status === 409) {
                alert("이미 지원한 채용공고입니다.");
            } else if (error.response?.status === 401) {
                alert("로그인이 필요합니다.");
                navigate('/login');
            } else {
                alert(`지원에 실패했습니다: ${error.response?.data || error.message}`);
            }
        } finally {
            setApplyingJob(false);
        }
    };

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

    // 이력서 선택 모달 컴포넌트
    const ResumeSelectionModal = () => {
        if (!showResumeModal) return null;

        return (
            <div className="modal-overlay" onClick={() => setShowResumeModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3>지원할 이력서 선택</h3>
                        <button
                            className="modal-close"
                            onClick={() => setShowResumeModal(false)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="modal-body">
                        {loadingResumes ? (
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p>이력서를 불러오는 중...</p>
                            </div>
                        ) : resumes.length === 0 ? (
                            <div className="empty-resumes">
                                <p>등록된 이력서가 없습니다.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowResumeModal(false);
                                        navigate('/my-resumes');
                                    }}
                                >
                                    이력서 작성하기
                                </button>
                            </div>
                        ) : (
                            <div className="resume-list">
                                {resumes.map(resume => (
                                    <div
                                        key={resume.id}
                                        className={`resume-item ${selectedResumeId === resume.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedResumeId(resume.id)}
                                    >
                                        <div className="resume-radio">
                                            <input
                                                type="radio"
                                                name="resume"
                                                value={resume.id}
                                                checked={selectedResumeId === resume.id}
                                                onChange={() => setSelectedResumeId(resume.id)}
                                            />
                                        </div>
                                        <div className="resume-info">
                                            <h4>{resume.title}</h4>
                                            <p>최종 수정: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                                            <p className="resume-preview">
                                                {resume.content.substring(0, 100)}...
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {resumes.length > 0 && (
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowResumeModal(false)}
                            >
                                취소
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleApply}
                                disabled={!selectedResumeId || applyingJob}
                            >
                                {applyingJob ? '지원 중...' : '지원하기'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
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
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        if (diffDays < 7) return `${diffDays}일 전`;

        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric'
        });
    };

    // 마감일까지 남은 일수 계산
    const getDaysRemaining = (dateString) => {
        if (!dateString) return null;
        const deadline = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // 스킬 태그 분리
    const getSkillTags = (skillsString) => {
        if (!skillsString) return [];
        return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    };

    if (loading) {
        return (
            <div className="job-detail-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">채용공고를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="job-detail-page">
                <div className="container">
                    <div className="error-container">
                        <div className="error-icon">⚠️</div>
                        <h3>채용공고를 불러올 수 없습니다</h3>
                        <p>{error || '요청하신 채용공고가 존재하지 않거나 삭제되었을 수 있습니다.'}</p>
                        <div className="error-actions">
                            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                                <IconBack />
                                이전
                            </button>
                            <button className="btn btn-secondary" onClick={fetchJobPosting}>
                                <IconRefresh />
                                다시 시도
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/jobs')}>
                                일자리 목록
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 로그인한 사용자가 채용공고 작성자인지 확인
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
        <div className="job-detail-page">
            <div className="container">
                {/* 상단 네비게이션 */}
                <nav className="breadcrumb" aria-label="페이지 경로">
                    <button
                        className="breadcrumb-link"
                        onClick={() => navigate('/jobs')}
                        aria-label="일자리 목록으로 이동"
                    >
                        일자리 목록
                    </button>
                    <span className="breadcrumb-separator" aria-hidden="true">›</span>
                    <span className="breadcrumb-current" aria-current="page">채용공고 상세</span>
                </nav>

                {/* 메인 컨텐츠 */}
                <main className="job-detail-content">
                    {/* 헤더 섹션 */}
                    <section className="job-header-section">
                        <div className="job-header-main">
                            <div
                                className="company-avatar-large"
                                aria-label={`${job.companyName} 회사 로고`}
                            >
                                {getCompanyInitials(job.companyName)}
                            </div>
                            <div className="job-header-info">
                                <div className="job-meta">
                                    <span className="company-name">{job.companyName}</span>
                                    <div className="job-badges">
                                        {isUrgent && !isDeadlinePassed && (
                                            <span
                                                className="badge badge-urgent"
                                                aria-label={`마감 ${daysRemaining === 0 ? '오늘' : `${daysRemaining}일 전`}`}
                                            >
                                                {daysRemaining === 0 ? '오늘 마감' : `D-${daysRemaining}`}
                                            </span>
                                        )}
                                        {isDeadlinePassed && (
                                            <span className="badge badge-closed" aria-label="마감된 채용공고">
                                                마감됨
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <h1 className="job-title">{job.title}</h1>
                                <div className="job-subtitle">
                                    <span className="post-date">
                                        <IconClock aria-hidden="true" />
                                        <time dateTime={job.createdAt}>
                                            {formatDate(job.createdAt)} 등록
                                        </time>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="job-actions">
                            {isCompanyOwner && (
                                <div className="company-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleEdit}
                                        aria-label="채용공고 수정"
                                    >
                                        <IconEdit aria-hidden="true" />
                                        수정
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleDelete}
                                        aria-label="채용공고 삭제"
                                    >
                                        <IconDelete aria-hidden="true" />
                                        삭제
                                    </button>
                                </div>
                            )}

                            {isIndividual && !isDeadlinePassed && (
                                <button
                                    className="btn btn-primary"
                                    onClick={handleApplyClick}  // ✅ 수정된 부분
                                    aria-label="이 채용공고에 지원하기"
                                >
                                    <IconApply aria-hidden="true" />
                                    지원하기
                                </button>
                            )}

                            {isIndividual && isDeadlinePassed && (
                                <button
                                    className="btn btn-disabled"
                                    disabled
                                    aria-label="마감된 채용공고 - 지원 불가"
                                >
                                    <IconWarning aria-hidden="true" />
                                    마감된 공고
                                </button>
                            )}
                        </div>
                    </section>

                    {/* 상세 정보 그리드 */}
                    <section className="job-details-grid">
                        {/* 기본 정보 카드 */}
                        <article className="info-card">
                            <h2 className="info-card-title">
                                <IconPosition aria-hidden="true" />
                                기본 정보
                            </h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-label">
                                        <IconPosition aria-hidden="true" />
                                        직무
                                    </div>
                                    <div className="info-value">{job.position || '미지정'}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">
                                        <IconExperience aria-hidden="true" />
                                        경력
                                    </div>
                                    <div className="info-value">{job.experienceLevel || '무관'}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">
                                        <IconLocation aria-hidden="true" />
                                        근무지
                                    </div>
                                    <div className="info-value">{job.location || '미정'}</div>
                                </div>
                                <div className="info-item">
                                    <div className="info-label">
                                        <IconSalary aria-hidden="true" />
                                        급여
                                    </div>
                                    <div className="info-value">{job.salary || '회사 내규에 따름'}</div>
                                </div>
                                {job.deadline && (
                                    <div className="info-item">
                                        <div className="info-label">
                                            <IconCalendar aria-hidden="true" />
                                            마감일
                                        </div>
                                        <div className={`info-value ${isDeadlinePassed ? 'deadline-passed' : ''}`}>
                                            <time dateTime={job.deadline}>
                                                {new Date(job.deadline).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                            {isUrgent && !isDeadlinePassed && (
                                                <span className="deadline-badge">
                                                    {daysRemaining === 0 ? '오늘 마감' : `D-${daysRemaining}`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </article>

                        {/* 스킬 요구사항 카드 */}
                        {job.requiredSkills && getSkillTags(job.requiredSkills).length > 0 && (
                            <article className="info-card">
                                <h2 className="info-card-title">
                                    <IconSkill aria-hidden="true" />
                                    요구 기술
                                </h2>
                                <div className="skills-container">
                                    {getSkillTags(job.requiredSkills).map((skill, index) => (
                                        <span className="skill-tag" key={index}>
                                            <IconHash aria-hidden="true" />
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        )}
                    </section>

                    {/* 상세 설명 */}
                    <article className="description-card">
                        <h2 className="description-title">상세 내용</h2>
                        <div className="description-content">
                            {job.description && job.description.trim() ? (
                                job.description.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && <p key={index}>{paragraph}</p>
                                ))
                            ) : (
                                <p>상세 내용이 제공되지 않았습니다.</p>
                            )}
                        </div>
                    </article>

                    {/* 하단 액션 */}
                    {isIndividual && (
                        <section className="bottom-action">
                            {!isDeadlinePassed ? (
                                <button
                                    className="btn btn-primary btn-xl"
                                    onClick={handleApplyClick}  // ✅ 수정된 부분
                                    aria-label="이 채용공고에 지원하기"
                                >
                                    <IconApply aria-hidden="true" />
                                    지원하기
                                </button>
                            ) : (
                                <div className="deadline-notice" role="alert">
                                    <IconWarning aria-hidden="true" />
                                    <span>마감된 채용공고입니다</span>
                                </div>
                            )}
                        </section>
                    )}
                </main>

                {/* 이력서 선택 모달 */}
                <ResumeSelectionModal />
            </div>
        </div>
    );
};

export default JobPostingDetail;