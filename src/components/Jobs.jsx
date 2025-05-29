import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Jobs.css';

// 아이콘 컴포넌트들
const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
);

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const FilterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
    </svg>
);

const ClearIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const BriefcaseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7,7 17,7 17,17"></polyline>
    </svg>
);

const ChevronLeftIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
);

const Jobs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // 이력서 ID (MyResumes에서 전달)
    const resumeId = location.state?.resumeId;

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const itemsPerPage = 12; // 페이지당 아이템 수

    // 상태 관리
    const [searchParams, setSearchParams] = useState({
        keyword: queryParams.get('keyword') || '',
        location: queryParams.get('location') || '',
        experienceLevel: queryParams.get('experienceLevel') || '',
        activeOnly: queryParams.get('activeOnly') === 'true'
    });

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || '전체');
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [recommendations, setRecommendations] = useState([]);

    // 카테고리 목록
    const categories = ['전체', '개발', '마케팅', '디자인', '기획', '경영', '영업', 'HR', '금융', 'IT'];

    // 초기 데이터 로드
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // 페이지나 검색 조건이 변경될 때마다 데이터 다시 로드
    useEffect(() => {
        fetchJobPostings();
    }, [currentPage, location.search]);

    // URL 파라미터 변경 시 상태 업데이트
    useEffect(() => {
        const newPage = parseInt(queryParams.get('page')) || 1;
        const newKeyword = queryParams.get('keyword') || '';
        const newLocation = queryParams.get('location') || '';
        const newExperienceLevel = queryParams.get('experienceLevel') || '';
        const newActiveOnly = queryParams.get('activeOnly') === 'true';
        const newCategory = queryParams.get('category') || '전체';

        setCurrentPage(newPage);
        setSelectedCategory(newCategory);
        setSearchParams({
            keyword: newKeyword,
            location: newLocation,
            experienceLevel: newExperienceLevel,
            activeOnly: newActiveOnly
        });
    }, [location.search]);

    // 일자리 데이터 가져오기 (페이지네이션 포함)
    const fetchJobPostings = async () => {
        setLoading(true);
        setError('');

        try {
            // URL에서 현재 검색 조건 가져오기
            const currentKeyword = queryParams.get('keyword') || '';
            const currentLocation = queryParams.get('location') || '';
            const currentExperienceLevel = queryParams.get('experienceLevel') || '';
            const currentActiveOnly = queryParams.get('activeOnly') === 'true';
            const page = parseInt(queryParams.get('page')) || 1;

            const urlParams = new URLSearchParams();

            // 페이지 파라미터 추가 (백엔드가 0-based인지 1-based인지 확인 필요)
            urlParams.append('page', (page - 1).toString()); // 대부분의 Spring Boot는 0-based
            urlParams.append('size', itemsPerPage.toString());

            // 검색 조건 추가
            if (currentKeyword) urlParams.append('keyword', currentKeyword);
            if (currentLocation) urlParams.append('location', currentLocation);
            if (currentExperienceLevel) urlParams.append('experienceLevel', currentExperienceLevel);
            if (currentActiveOnly) urlParams.append('activeOnly', currentActiveOnly.toString());

            let response;

            // 검색 조건이 있으면 검색 API, 없으면 전체 목록 API 호출
            if (currentKeyword || currentLocation || currentExperienceLevel || currentActiveOnly) {
                response = await axios.get(`http://localhost:8080/api/jobs/search?${urlParams.toString()}`);
            } else {
                response = await axios.get(`http://localhost:8080/api/jobs/all-simple?${urlParams.toString()}`);
            }

            console.log('API 응답:', response.data); // 디버깅용

            // Spring Boot Page 응답 형식 처리
            if (response.data.content) {
                setJobs(response.data.content);
                setTotalPages(response.data.totalPages);
                setTotalJobs(response.data.totalElements);
            } else if (Array.isArray(response.data)) {
                // 페이지네이션이 적용되지 않은 배열 응답의 경우
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedJobs = response.data.slice(startIndex, endIndex);

                setJobs(paginatedJobs);
                setTotalPages(Math.ceil(response.data.length / itemsPerPage));
                setTotalJobs(response.data.length);
            } else {
                // 예상하지 못한 응답 형식
                console.error('예상하지 못한 API 응답 형식:', response.data);
                setJobs([]);
                setTotalPages(1);
                setTotalJobs(0);
            }
        } catch (err) {
            console.error('일자리 데이터 로드 실패:', err);
            setError('일자리 정보를 불러오는데 실패했습니다.');
            setJobs([]);
            setTotalPages(1);
            setTotalJobs(0);
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경 함수
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        // URL 업데이트
        const params = new URLSearchParams(location.search);
        params.set('page', newPage.toString());
        navigate({ search: params.toString() }, { replace: true });

        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 경력 추천 API 호출
    const handleRecommendCareer = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/match/career?resumeId=${resumeId}&jobPostingId=${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedJobId(jobId);
            setRecommendations(response.data);
        } catch (err) {
            console.error('경력 추천 실패:', err);
            alert('경력 추천을 가져오는 중 오류가 발생했습니다.');
        }
    };

    // 입력 변경 처리
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 검색 실행
    const handleSearch = (e) => {
        e.preventDefault();

        // URL 업데이트 (페이지를 1로 리셋)
        const params = new URLSearchParams();
        params.set('page', '1');

        if (searchParams.keyword) params.set('keyword', searchParams.keyword);
        if (searchParams.location) params.set('location', searchParams.location);
        if (searchParams.experienceLevel) params.set('experienceLevel', searchParams.experienceLevel);
        if (searchParams.activeOnly) params.set('activeOnly', searchParams.activeOnly.toString());
        if (selectedCategory !== '전체') params.set('category', selectedCategory);

        navigate({ search: params.toString() });
    };

    // 검색 초기화
    const handleClearSearch = () => {
        setSearchParams({
            keyword: '',
            location: '',
            experienceLevel: '',
            activeOnly: false
        });
        setSelectedCategory('전체');

        navigate('/jobs?page=1');
    };

    // 카테고리 선택
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);

        const params = new URLSearchParams();
        params.set('page', '1');

        if (category === '전체') {
            setSearchParams({
                keyword: '',
                location: '',
                experienceLevel: '',
                activeOnly: false
            });
        } else {
            const newParams = { ...searchParams, keyword: category };
            setSearchParams(newParams);

            params.set('keyword', category);
            params.set('category', category);
            if (newParams.location) params.set('location', newParams.location);
            if (newParams.experienceLevel) params.set('experienceLevel', newParams.experienceLevel);
            if (newParams.activeOnly) params.set('activeOnly', newParams.activeOnly.toString());
        }

        navigate({ search: params.toString() });
    };

    // 일자리 상세 페이지로 이동
    const navigateToJobDetail = (jobId) => {
        navigate(`/job-posting/${jobId}`);
    };

    // 날짜 포맷팅
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

    // 마감일 포맷팅
    const formatDeadline = (dateString) => {
        if (!dateString) return '상시채용';

        const deadline = new Date(dateString);
        const now = new Date();
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return '마감됨';
        if (diffDays === 0) return '오늘 마감';
        if (diffDays <= 7) return `D-${diffDays}`;

        return deadline.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric'
        }) + ' 마감';
    };

    // 회사 이니셜
    const getCompanyInitials = (companyName) => {
        if (!companyName) return '?';
        return companyName.charAt(0).toUpperCase();
    };

    // 마감 임박 여부
    const isUrgent = (dateString) => {
        if (!dateString) return false;
        const deadline = new Date(dateString);
        const now = new Date();
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
    };

    // 신규 공고 여부
    const isNew = (dateString) => {
        if (!dateString) return false;
        const posted = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
        return diffDays <= 3;
    };

    // 페이지네이션 컴포넌트
    const Pagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                <button
                    className="pagination-btn pagination-prev"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="이전 페이지"
                >
                    <ChevronLeftIcon />
                    <span>이전</span>
                </button>

                <div className="pagination-numbers">
                    {startPage > 1 && (
                        <>
                            <button
                                className="pagination-number"
                                onClick={() => handlePageChange(1)}
                                aria-label="1페이지로 이동"
                            >
                                <span>1</span>
                            </button>
                            {startPage > 2 && <span className="pagination-ellipsis">•••</span>}
                        </>
                    )}

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                            onClick={() => handlePageChange(number)}
                            aria-label={`${number}페이지로 이동`}
                            aria-current={currentPage === number ? 'page' : undefined}
                        >
                            <span>{number}</span>
                        </button>
                    ))}

                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="pagination-ellipsis">•••</span>}
                            <button
                                className="pagination-number"
                                onClick={() => handlePageChange(totalPages)}
                                aria-label={`${totalPages}페이지로 이동`}
                            >
                                <span>{totalPages}</span>
                            </button>
                        </>
                    )}
                </div>

                <button
                    className="pagination-btn pagination-next"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="다음 페이지"
                >
                    <span>다음</span>
                    <ChevronRightIcon />
                </button>
            </div>
        );
    };

    // 로딩 스켈레톤
    const SkeletonCard = () => (
        <div className="job-card skeleton">
            <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-company"></div>
                </div>
            </div>
            <div className="skeleton-details">
                <div className="skeleton-detail"></div>
                <div className="skeleton-detail"></div>
                <div className="skeleton-detail"></div>
            </div>
            <div className="skeleton-skills">
                <div className="skeleton-skill"></div>
                <div className="skeleton-skill"></div>
                <div className="skeleton-skill"></div>
            </div>
        </div>
    );

    return (
        <div className="jobs-page">
            {/* 헤더 */}
            <header className="page-header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-text">
                            <h1>일자리 찾기</h1>
                            <p>나에게 딱 맞는 채용정보를 찾아보세요</p>
                            {resumeId && (
                                <div className="resume-notice">
                                    <span>선택된 이력서로 경력 추천을 받을 수 있습니다</span>
                                </div>
                            )}
                        </div>
                        <div className="header-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/')}
                            >
                                <HomeIcon />
                                홈으로
                            </button>
                            {user?.userType === 'COMPANY' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/job-posting/create')}
                                >
                                    <PlusIcon />
                                    채용공고 등록
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="page-main">
                <div className="container">
                    {/* 검색 섹션 */}
                    <section className="search-section">
                        <form onSubmit={handleSearch} className="search-form">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    name="keyword"
                                    value={searchParams.keyword}
                                    onChange={handleInputChange}
                                    placeholder="직무, 기술, 회사명으로 검색하세요"
                                    className="search-input"
                                />
                                <button type="submit" className="search-btn">
                                    <SearchIcon />
                                    검색
                                </button>
                            </div>

                            <div className="search-controls">
                                <button
                                    type="button"
                                    className="filter-toggle"
                                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                                >
                                    <FilterIcon />
                                    상세 검색
                                    <ChevronDownIcon />
                                </button>

                                {(searchParams.keyword || searchParams.location ||
                                    searchParams.experienceLevel || searchParams.activeOnly) && (
                                    <button
                                        type="button"
                                        className="clear-btn"
                                        onClick={handleClearSearch}
                                    >
                                        <ClearIcon />
                                        초기화
                                    </button>
                                )}
                            </div>

                            {showAdvancedSearch && (
                                <div className="advanced-search">
                                    <div className="form-grid">
                                        <div className="form-field">
                                            <label>근무지</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={searchParams.location}
                                                onChange={handleInputChange}
                                                placeholder="예: 서울, 경기, 재택근무"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <label>경력</label>
                                            <input
                                                type="text"
                                                name="experienceLevel"
                                                value={searchParams.experienceLevel}
                                                onChange={handleInputChange}
                                                placeholder="예: 신입, 3년 이상"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="activeOnly"
                                                checked={searchParams.activeOnly}
                                                onChange={handleInputChange}
                                            />
                                            진행 중인 공고만 보기
                                        </label>
                                    </div>
                                </div>
                            )}
                        </form>
                    </section>

                    {/* 카테고리 필터 */}
                    <section className="category-section">
                        <div className="category-list">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 결과 섹션 */}
                    <section className="results-section">
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>일자리를 찾고 있습니다...</p>
                                <div className="skeleton-grid">
                                    {Array(6).fill().map((_, i) => (
                                        <SkeletonCard key={i} />
                                    ))}
                                </div>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <div className="error-icon">⚠️</div>
                                <h3>오류가 발생했습니다</h3>
                                <p>{error}</p>
                                <button className="btn btn-primary" onClick={() => fetchJobPostings()}>
                                    다시 시도
                                </button>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🔍</div>
                                <h3>검색 결과가 없습니다</h3>
                                <p>다른 검색어를 입력하거나 필터를 조정해보세요</p>
                                <button className="btn btn-primary" onClick={handleClearSearch}>
                                    검색 조건 초기화
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="results-header">
                                    <span className="results-count">
                                        총 <strong>{totalJobs}</strong>개의 일자리 (페이지 {currentPage}/{totalPages})
                                    </span>
                                </div>

                                <div className="jobs-grid">
                                    {jobs.map(job => (
                                        <article
                                            key={job.id}
                                            className="job-card"
                                            onClick={() => navigateToJobDetail(job.id)}
                                        >
                                            <div className="job-header">
                                                <div className="company-avatar">
                                                    {getCompanyInitials(job.companyName)}
                                                </div>
                                                <div className="job-info">
                                                    <h3 className="job-title">
                                                        {job.title}
                                                        {isNew(job.createdAt) && (
                                                            <span className="badge badge-new">NEW</span>
                                                        )}
                                                    </h3>
                                                    <p className="company-name">{job.companyName}</p>
                                                </div>
                                                <div className="deadline-info">
                                                    <span className={`deadline ${isUrgent(job.deadline) ? 'urgent' : ''}`}>
                                                        {formatDeadline(job.deadline)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="job-details">
                                                <div className="detail-item">
                                                    <LocationIcon />
                                                    <span>{job.location || '위치 미정'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <BriefcaseIcon />
                                                    <span>{job.experienceLevel || '경력 무관'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <CalendarIcon />
                                                    <span>{formatDate(job.createdAt)}</span>
                                                </div>
                                            </div>

                                            {job.requiredSkills && (
                                                <div className="job-skills">
                                                    {job.requiredSkills.split(',').slice(0, 4).map((skill, index) => (
                                                        <span key={index} className="skill-tag">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                    {job.requiredSkills.split(',').length > 4 && (
                                                        <span className="skill-tag more">
                                                            +{job.requiredSkills.split(',').length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="job-footer">
                                                <div className="posted-date">
                                                    <CalendarIcon />
                                                    <span>{formatDate(job.createdAt)}</span>
                                                </div>
                                                <div className="view-link">
                                                    자세히 보기
                                                    <ArrowRightIcon />
                                                </div>
                                            </div>

                                            {/* 경력 추천 버튼 */}
                                            {resumeId && (
                                                <div className="career-section">
                                                    <button
                                                        className="career-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRecommendCareer(job.id);
                                                        }}
                                                    >
                                                        경력 추천 받기
                                                    </button>

                                                    {selectedJobId === job.id && recommendations.length > 0 && (
                                                        <div className="career-recommendations">
                                                            <h4>추천 경력 경로</h4>
                                                            <ol>
                                                                {recommendations.map((step, index) => (
                                                                    <li key={index}>{step}</li>
                                                                ))}
                                                            </ol>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </article>
                                    ))}
                                </div>

                                {/* 페이지네이션 */}
                                {totalPages > 1 && <Pagination />}
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Jobs;