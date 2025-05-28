import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobRecommendations.css';

// SVG Icons
const LocationIcon = () => (
    <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

const SalaryIcon = () => (
    <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
);

const ExperienceIcon = () => (
    <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
);

const ClockIcon = () => (
    <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="7" y1="17" x2="17" y2="7"/>
        <polyline points="7 7 17 7 17 17"/>
    </svg>
);

const JobRecommendations = ({ user }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.userType === 'INDIVIDUAL') {
            fetchRecommendations();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/jobs/recent');
            setRecommendations(response.data.slice(0, 6)); // Get top 6 jobs
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch job recommendations:', err);
            setError('추천 일자리를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };

    const navigateToJobDetail = (jobId) => {
        navigate(`/job-posting/${jobId}`);
    };

    const seeAllJobs = () => {
        navigate('/jobs');
    };

    const getCompanyInitials = (companyName) => {
        if (!companyName) return '?';
        const words = companyName.split(' ');
        if (words.length >= 2) {
            return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
        }
        return companyName.charAt(0).toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = today - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        if (diffDays < 7) return `${diffDays}일 전`;
        return date.toLocaleDateString('ko-KR');
    };

    const getJobBadges = (job) => {
        const badges = [];

        // 신규 일자리 체크 (7일 이내)
        const createdDate = new Date(job.createdAt);
        const daysSinceCreated = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated <= 7) {
            badges.push({ text: '신규', type: 'success' });
        }

        // 마감임박 체크
        if (job.deadline) {
            const deadline = new Date(job.deadline);
            const daysUntilDeadline = Math.floor((deadline - new Date()) / (1000 * 60 * 60 * 24));
            if (daysUntilDeadline <= 3 && daysUntilDeadline >= 0) {
                badges.push({ text: '마감임박', type: 'warning' });
            }
        }

        // 추천 뱃지 (랜덤하게 일부에만)
        if (Math.random() > 0.7) {
            badges.push({ text: '추천', type: 'primary' });
        }

        return badges;
    };

    // 로딩 스켈레톤 렌더링
    const renderSkeletons = () => {
        return Array(6).fill().map((_, index) => (
            <div key={`skeleton-${index}`} className="job-card-skeleton">
                <div className="skeleton-header">
                    <div className="skeleton-avatar loading-skeleton"></div>
                    <div className="skeleton-info">
                        <div className="skeleton-title loading-skeleton"></div>
                        <div className="skeleton-company loading-skeleton"></div>
                        <div className="skeleton-badges">
                            <div className="skeleton-badge loading-skeleton"></div>
                            <div className="skeleton-badge loading-skeleton"></div>
                        </div>
                    </div>
                </div>
                <div className="skeleton-details">
                    <div className="skeleton-detail loading-skeleton"></div>
                    <div className="skeleton-detail loading-skeleton"></div>
                    <div className="skeleton-detail loading-skeleton"></div>
                    <div className="skeleton-detail loading-skeleton"></div>
                </div>
                <div className="skeleton-skills">
                    <div className="skeleton-skill loading-skeleton"></div>
                    <div className="skeleton-skill loading-skeleton"></div>
                    <div className="skeleton-skill loading-skeleton"></div>
                </div>
                <div className="skeleton-footer">
                    <div className="skeleton-date loading-skeleton"></div>
                    <div className="skeleton-link loading-skeleton"></div>
                </div>
            </div>
        ));
    };

    if (!user || user.userType !== 'INDIVIDUAL') {
        return null;
    }

    if (loading) {
        return (
            <div className="recommendations-grid animate-fade-in">
                {renderSkeletons()}
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
            </div>
        );
    }

    return (
        <>
            {recommendations.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        현재 추천 일자리가 없습니다
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                        더 많은 일자리를 확인해보세요
                    </p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={seeAllJobs}
                    >
                        일자리 둘러보기
                    </button>
                </div>
            ) : (
                <>
                    <div className="recommendations-grid animate-fade-in">
                        {recommendations.map((job, index) => {
                            const badges = getJobBadges(job);

                            return (
                                <div
                                    key={job.id}
                                    className="modern-job-card"
                                    onClick={() => navigateToJobDetail(job.id)}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="job-card-header">
                                        <div className="company-avatar">
                                            {getCompanyInitials(job.companyName)}
                                        </div>
                                        <div className="job-info">
                                            <h3 className="job-title">{job.title}</h3>
                                            <div className="company-name">{job.companyName}</div>
                                            {badges.length > 0 && (
                                                <div className="job-badges">
                                                    {badges.map((badge, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`badge badge-${badge.type}`}
                                                        >
                                                            {badge.text}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="job-details-grid">
                                        <div className="detail-item">
                                            <LocationIcon />
                                            <span>{job.location || '미정'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <SalaryIcon />
                                            <span>{job.salary || '회사 내규에 따름'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <ExperienceIcon />
                                            <span>{job.experienceLevel || '무관'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <ClockIcon />
                                            <span>{formatDate(job.createdAt)}</span>
                                        </div>
                                    </div>

                                    {job.requiredSkills && (
                                        <div className="job-skills">
                                            {job.requiredSkills.split(',').slice(0, 4).map((skill, idx) => (
                                                <span key={idx} className="skill-tag">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                            {job.requiredSkills.split(',').length > 4 && (
                                                <span className="skill-tag" style={{
                                                    background: 'var(--gray-200)',
                                                    color: 'var(--gray-600)'
                                                }}>
                                                    +{job.requiredSkills.split(',').length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="job-card-footer">
                                        <span className="job-date">
                                            {job.deadline ? `마감: ${formatDate(job.deadline)}` : '상시채용'}
                                        </span>
                                        <div className="view-job-link">
                                            자세히 보기
                                            <ArrowRightIcon />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="see-all-jobs">
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={seeAllJobs}
                        >
                            더 많은 일자리 보기
                            <ArrowRightIcon />
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default JobRecommendations;