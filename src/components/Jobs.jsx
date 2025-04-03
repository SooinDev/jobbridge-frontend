import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Jobs.css';
import "../styles/common.css"; // 공통 스타일

// 아이콘 컴포넌트
const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const IconHome = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const IconFilter = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

const IconClear = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// 상세 아이콘
const IconLocation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const IconPosition = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7h-3a2 2 0 0 0-2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 0-2-2H0"></path>
        <rect x="8" y="2" width="8" height="5" rx="1"></rect>
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

const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
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

const EmptySearchIllustration = () => (
    <svg className="no-jobs-illustration" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="300" cy="300" r="200" fill="#F3F4F6" />
        <rect x="200" y="170" width="200" height="260" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="8" />
        <circle cx="300" cy="250" r="50" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="8" />
        <path d="M350 350H250" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
        <path d="M320 380H280" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
        <path d="M380 170L420 130" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
        <path d="M180 210L140 170" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
        <path d="M150 330L110 370" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
    </svg>
);

const Jobs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // 검색 파라미터 상태
    const [searchParams, setSearchParams] = useState({
        keyword: queryParams.get('keyword') || '',
        location: queryParams.get('location') || '',
        experienceLevel: queryParams.get('experienceLevel') || '',
        activeOnly: queryParams.get('activeOnly') === 'true'
    });

    // 리스트와 UI 상태
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [user, setUser] = useState(null);

    // localStorage에서 사용자 정보 가져오기
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // 초기 검색 (URL 파라미터 기반 또는 최근 일자리)
        searchJobs();
    }, []);

    // 입력 변경 처리
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // 검색 제출 처리
    const handleSearch = (e) => {
        e.preventDefault();
        searchJobs();

        // 공유 가능한 링크를 위해 URL 업데이트
        const params = new URLSearchParams();
        if (searchParams.keyword) params.append('keyword', searchParams.keyword);
        if (searchParams.location) params.append('location', searchParams.location);
        if (searchParams.experienceLevel) params.append('experienceLevel', searchParams.experienceLevel);
        if (searchParams.activeOnly) params.append('activeOnly', searchParams.activeOnly);

        navigate({ search: params.toString() });
    };

    // 검색 파라미터 초기화
    const handleClearSearch = () => {
        setSearchParams({
            keyword: '',
            location: '',
            experienceLevel: '',
            activeOnly: false
        });
        navigate('/jobs');
        searchJobs(true); // 최근 일자리 가져오기
    };

    // 일자리 검색 함수
    const searchJobs = async (getRecent = false) => {
        setLoading(true);
        setError('');

        try {
            let response;

            if (getRecent) {
                // 최근 일자리 가져오기
                response = await axios.get('http://localhost:8080/api/jobs/recent');
            } else if (!searchParams.keyword && !searchParams.location &&
                !searchParams.experienceLevel && !searchParams.activeOnly) {
                // 검색 파라미터가 없으면 최근 일자리 가져오기
                response = await axios.get('http://localhost:8080/api/jobs/recent');
            } else {
                // 파라미터로 검색
                const params = new URLSearchParams();
                if (searchParams.keyword) params.append('keyword', searchParams.keyword);
                if (searchParams.location) params.append('location', searchParams.location);
                if (searchParams.experienceLevel) params.append('experienceLevel', searchParams.experienceLevel);
                if (searchParams.activeOnly) params.append('activeOnly', searchParams.activeOnly);

                response = await axios.get(`http://localhost:8080/api/jobs/search?${params.toString()}`);
            }

            setJobs(response.data);
        } catch (err) {
            console.error('Failed to fetch jobs:', err);
            setError('일자리 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 일자리 상세 페이지로 이동
    const navigateToJobDetail = (jobId) => {
        navigate(`/job-posting/${jobId}`);
    };

    // 날짜 형식화
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 회사 이니셜 가져오기
    const getCompanyInitials = (companyName) => {
        if (!companyName) return '?';
        return companyName.charAt(0).toUpperCase();
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

    // 스켈레톤 로딩 UI
    const renderSkeletons = () => {
        return Array(3).fill().map((_, index) => (
            <div className="job-card-skeleton" key={`skeleton-${index}`}>
                <div className="skeleton-header">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-company"></div>
                </div>
                <div className="skeleton-details">
                    <div className="skeleton-detail">
                        <div className="skeleton-icon"></div>
                        <div className="skeleton-text"></div>
                    </div>
                    <div className="skeleton-detail">
                        <div className="skeleton-icon"></div>
                        <div className="skeleton-text"></div>
                    </div>
                    <div className="skeleton-detail">
                        <div className="skeleton-icon"></div>
                        <div className="skeleton-text"></div>
                    </div>
                    <div className="skeleton-detail">
                        <div className="skeleton-icon"></div>
                        <div className="skeleton-text"></div>
                    </div>
                </div>
                <div className="skeleton-skills">
                    <div className="skeleton-skill"></div>
                    <div className="skeleton-skill"></div>
                    <div className="skeleton-skill"></div>
                </div>
                <div className="skeleton-footer">
                    <div className="skeleton-date"></div>
                    <div className="skeleton-date"></div>
                </div>
            </div>
        ));
    };

    return (
        <div className="jobs-container">
            <div className="jobs-header">
                <div className="header-content">
                    <h1>일자리 찾기</h1>
                    <div className="header-actions">
                        <button className="home-link" onClick={() => navigate('/')}>
                            <IconHome /> 홈으로
                        </button>
                        {user && user.userType === 'COMPANY' && (
                            <button
                                className="post-job-button"
                                onClick={() => navigate('/job-posting/create')}
                            >
                                <IconPlus /> 새 채용공고 등록
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="jobs-content">
                <div className="search-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-bar">
                            <input
                                type="text"
                                name="keyword"
                                value={searchParams.keyword}
                                onChange={handleInputChange}
                                placeholder="직무, 기술, 회사명으로 검색"
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                <IconSearch /> 검색
                            </button>
                        </div>

                        <div className="search-actions">
                            <button
                                type="button"
                                className="advanced-search-toggle"
                                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            >
                                <IconFilter /> {showAdvancedSearch ? '기본 검색' : '상세 검색'}
                            </button>
                            {(searchParams.keyword || searchParams.location ||
                                searchParams.experienceLevel || searchParams.activeOnly) && (
                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={handleClearSearch}
                                >
                                    <IconClear /> 검색 초기화
                                </button>
                            )}
                        </div>

                        {showAdvancedSearch && (
                            <div className="advanced-search">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="location">근무지</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={searchParams.location}
                                            onChange={handleInputChange}
                                            placeholder="서울, 경기, 재택근무 등"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="experienceLevel">경력</label>
                                        <input
                                            type="text"
                                            id="experienceLevel"
                                            name="experienceLevel"
                                            value={searchParams.experienceLevel}
                                            onChange={handleInputChange}
                                            placeholder="신입, 경력 3년 이상 등"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="activeOnly"
                                            checked={searchParams.activeOnly}
                                            onChange={handleInputChange}
                                        />
                                        <span>진행 중인 공고만 보기</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="jobs-results">
                    {loading ? (
                        <div>
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p className="loading-text">일자리를 찾고 있어요...</p>
                            </div>
                            {renderSkeletons()}
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="no-jobs">
                            <EmptySearchIllustration />
                            <h3>검색 결과가 없습니다</h3>
                            <p>다른 검색어를 입력하시거나 상세 검색 조건을 변경해 보세요.</p>
                            <button className="btn btn-primary" onClick={handleClearSearch}>검색 초기화하기</button>
                        </div>
                    ) : (
                        <div className="jobs-list">
                            <div className="results-count">
                                총 <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{jobs.length}</span>개의 일자리를 찾았습니다
                            </div>

                            {jobs.map(job => {
                                const daysRemaining = job.deadline ? getDaysRemaining(job.deadline) : null;
                                const isUrgent = daysRemaining !== null && daysRemaining <= 3 && daysRemaining >= 0;

                                return (
                                    <div
                                        className="job-card"
                                        key={job.id}
                                        onClick={() => navigateToJobDetail(job.id)}
                                    >
                                        <div className="job-header">
                                            <div className="job-title-container">
                                                <h3 className="job-title">{job.title}</h3>
                                                <div className="company-name">
                                                    <div className="company-badge">{getCompanyInitials(job.companyName)}</div>
                                                    {job.companyName}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="job-details">
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconLocation />
                                                </div>
                                                <span className="detail-text">{job.location || '미정'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconPosition />
                                                </div>
                                                <span className="detail-text">{job.position}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconExperience />
                                                </div>
                                                <span className="detail-text">{job.experienceLevel || '무관'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconSalary />
                                                </div>
                                                <span className="detail-text">{job.salary || '회사 내규에 따름'}</span>
                                            </div>
                                        </div>

                                        {job.requiredSkills && (
                                            <div className="job-skills">
                                                {job.requiredSkills.split(',').map((skill, index) => (
                                                    <span className="skill-tag" key={index}>
                                                        <IconHash /> {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="job-footer">
                                            <div className="posted-date">
                                                <IconClock /> 등록일: {formatDate(job.createdAt)}
                                            </div>
                                            {job.deadline && (
                                                <div className={`deadline ${isUrgent ? 'urgent' : ''}`}>
                                                    <IconCalendar /> 마감일: {formatDate(job.deadline)}
                                                    {isUrgent && daysRemaining >= 0 && ` (${daysRemaining === 0 ? '오늘 마감' : `${daysRemaining}일 남음`})`}
                                                    {daysRemaining !== null && daysRemaining < 0 && ' (마감됨)'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;