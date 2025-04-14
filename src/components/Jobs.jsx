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

const IconChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const IconChevronUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
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
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 카테고리 목록
    const categories = ['전체', '개발', '마케팅', '디자인', '기획', '경영', '영업', 'HR', '금융', 'IT'];

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
        const {name, value, type, checked} = e.target;
        setSearchParams({
            ...searchParams,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // 검색 제출 처리
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1); // 검색 시 페이지 초기화
        setHasMore(true);
        searchJobs();

        // 공유 가능한 링크를 위해 URL 업데이트
        const params = new URLSearchParams();
        if (searchParams.keyword) params.append('keyword', searchParams.keyword);
        if (searchParams.location) params.append('location', searchParams.location);
        if (searchParams.experienceLevel) params.append('experienceLevel', searchParams.experienceLevel);
        if (searchParams.activeOnly) params.append('activeOnly', searchParams.activeOnly);

        navigate({search: params.toString()});
    };

    // 검색 파라미터 초기화
    const handleClearSearch = () => {
        setSearchParams({
            keyword: '',
            location: '',
            experienceLevel: '',
            activeOnly: false
        });
        setSelectedCategory('전체');
        setPage(1);
        setHasMore(true);
        navigate('/jobs');
        searchJobs(true); // 최근 일자리 가져오기
    };

    // 카테고리 선택 처리
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        if (category !== '전체') {
            setSearchParams({
                ...searchParams,
                keyword: category
            });
            searchJobs();
        } else if (searchParams.keyword) {
            // 전체 카테고리 선택 시 키워드 초기화
            const newParams = {...searchParams, keyword: ''};
            setSearchParams(newParams);

            // URL 파라미터 업데이트
            const urlParams = new URLSearchParams();
            if (newParams.location) urlParams.append('location', newParams.location);
            if (newParams.experienceLevel) urlParams.append('experienceLevel', newParams.experienceLevel);
            if (newParams.activeOnly) urlParams.append('activeOnly', newParams.activeOnly);

            navigate({search: urlParams.toString()});
            searchJobs();
        }
    };

    // 더 보기 버튼 처리
    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
        searchJobs(false, true);
    };

    // 일자리 검색 함수
    const searchJobs = async (getRecent = false, isLoadMore = false) => {
        if (!isLoadMore) {
            setLoading(true);
        }
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
                params.append('page', page); // 페이지 정보 추가

                response = await axios.get(`http://localhost:8080/api/jobs/search?${params.toString()}`);
            }

            const newJobs = response.data;

            if (isLoadMore) {
                // 더 보기 시 기존 목록에 추가
                if (newJobs.length === 0) {
                    setHasMore(false);
                } else {
                    setJobs(prevJobs => [...prevJobs, ...newJobs]);
                }
            } else {
                // 새 검색 시 목록 교체
                setJobs(newJobs);
                // 검색 결과가 적으면 더 보기 비활성화
                if (newJobs.length < 10) {
                    setHasMore(false);
                }
            }
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
        if (!dateString) return '';

        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // 오늘 등록된 경우
        if (date.toDateString() === today.toDateString()) {
            return '오늘';
        }
        // 어제 등록된 경우
        else if (date.toDateString() === yesterday.toDateString()) {
            return '어제';
        }
        // 그 외의 경우
        else {
            return date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
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

    // 마감일 텍스트 포맷팅
    const formatDeadline = (dateString) => {
        if (!dateString) return '상시 채용';

        const daysRemaining = getDaysRemaining(dateString);

        if (daysRemaining < 0) {
            return '마감됨';
        } else if (daysRemaining === 0) {
            return '오늘 마감';
        } else if (daysRemaining <= 3) {
            return `D-${daysRemaining}`;
        } else {
            const date = new Date(dateString);
            return `${date.getMonth() + 1}월 ${date.getDate()}일 마감`;
        }
    };

    // 마감 임박 여부
    const isUrgent = (dateString) => {
        if (!dateString) return false;
        const daysRemaining = getDaysRemaining(dateString);
        return daysRemaining !== null && daysRemaining <= 3 && daysRemaining >= 0;
    };

    // 신규 여부 (일주일 이내 등록)
    const isNewJob = (dateString) => {
        if (!dateString) return false;

        const postedDate = new Date(dateString);
        const today = new Date();
        const diffTime = today - postedDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays <= 7;
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
            {/* 상단 헤더 */}
            <div className="jobs-header">
                <div className="header-content">
                    <div className="header-title-group">
                        <h1>일자리 찾기</h1>
                        <p className="header-subtitle">나에게 딱 맞는 채용정보를 찾아보세요</p>
                    </div>
                    <div className="header-actions">
                        <button className="home-link" onClick={() => navigate('/')}>
                            <IconHome/> 홈으로
                        </button>
                        {user && user.userType === 'COMPANY' && (
                            <button
                                className="post-job-button"
                                onClick={() => navigate('/job-posting/create')}
                            >
                                <IconPlus/> 새 채용공고 등록
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="jobs-content">
                {/* 검색 섹션 - 향상된 디자인 */}
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
                                aria-label="검색어 입력"
                            />
                            <button type="submit" className="search-button">
                                <IconSearch/> 검색
                            </button>
                        </div>

                        <div className="search-actions">
                            <button
                                type="button"
                                className="advanced-search-toggle"
                                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            >
                                <IconFilter/>
                                {showAdvancedSearch ? '기본 검색으로 돌아가기' : '상세 검색 열기'}
                                {showAdvancedSearch ? <IconChevronUp/> : <IconChevronDown/>}
                            </button>
                            {(searchParams.keyword || searchParams.location ||
                                searchParams.experienceLevel || searchParams.activeOnly) && (
                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={handleClearSearch}
                                >
                                    <IconClear/> 검색 초기화
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

                {/* 카테고리 필터 */}
                <div className="category-filter">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategorySelect(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="jobs-results">
                    {loading && !jobs.length ? (
                        <div>
                            <div className="loading-container">
                                <div className="spinner"></div>
                                <p className="loading-text">일자리를 찾고 있어요...</p>
                            </div>
                            {renderSkeletons()}
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                 strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="no-jobs">
                            <EmptySearchIllustration/>
                            <h3>검색 결과가 없습니다</h3>
                            <p>다른 검색어를 입력하시거나 상세 검색 조건을 변경해 보세요.</p>
                            <button className="btn btn-primary" onClick={handleClearSearch}>검색 초기화하기</button>
                        </div>
                    ) : (
                        <div className="jobs-list">
                            <div className="results-count">
                                총 <span className="highlight-count">{jobs.length}</span>개의 일자리를 찾았습니다
                            </div>

                            {jobs.map(job => {
                                const daysRemaining = job.deadline ? getDaysRemaining(job.deadline) : null;
                                const jobIsUrgent = isUrgent(job.deadline);
                                const jobIsNew = isNewJob(job.createdAt);

                                return (
                                    <div
                                        className="job-card"
                                        key={job.id}
                                        onClick={() => navigateToJobDetail(job.id)}
                                    >
                                        <div className="job-header">
                                            <div className="job-title-container">
                                                <div
                                                    className="company-badge">{getCompanyInitials(job.companyName)}</div>
                                                <div className="job-title-group">
                                                    <h3 className="job-title">
                                                        {job.title}
                                                        {jobIsNew && <span className="tag tag-new">신규</span>}
                                                        {jobIsUrgent && <span className="tag tag-urgent">마감임박</span>}
                                                    </h3>
                                                    <div className="company-name">
                                                        {job.companyName}
                                                    </div>
                                                </div>
                                                <div className="deadline-badge">
                                                    {job.deadline && (
                                                        <span className={`deadline-text ${
                                                            daysRemaining !== null && daysRemaining < 0
                                                                ? 'closed'
                                                                : daysRemaining !== null && daysRemaining <= 3
                                                                    ? 'urgent'
                                                                    : 'active'
                                                        }`}>
                                                        {formatDeadline(job.deadline)}
                                                    </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="job-details">
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconLocation/>
                                                </div>
                                                <span className="detail-text">{job.location || '미정'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconPosition/>
                                                </div>
                                                <span className="detail-text">{job.position}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconExperience/>
                                                </div>
                                                <span className="detail-text">{job.experienceLevel || '무관'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-icon">
                                                    <IconSalary/>
                                                </div>
                                                <span className="detail-text">{job.salary || '회사 내규에 따름'}</span>
                                            </div>
                                        </div>

                                        {job.requiredSkills && (
                                            <div className="job-skills">
                                                {job.requiredSkills.split(',').map((skill, index) => (
                                                    <span className="skill-tag" key={index}>
                                                    <IconHash/> {skill.trim()}
                                                </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="job-footer">
                                            <div className="posted-date">
                                                <IconClock/> 등록일: {formatDate(job.createdAt)}
                                            </div>
                                            <div className="view-details">
                                                자세히 보기
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {hasMore && (
                                <div className="load-more-container">
                                    <button
                                        className="load-more-button"
                                        onClick={handleLoadMore}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="spinner-sm"></div>
                                                불러오는 중...
                                            </>
                                        ) : (
                                            <>
                                                더 많은 채용공고 보기
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Jobs;
