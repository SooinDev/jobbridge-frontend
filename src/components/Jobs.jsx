import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Jobs.css';

const Jobs = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // State for search parameters
    const [searchParams, setSearchParams] = useState({
        keyword: queryParams.get('keyword') || '',
        location: queryParams.get('location') || '',
        experienceLevel: queryParams.get('experienceLevel') || '',
        activeOnly: queryParams.get('activeOnly') === 'true'
    });

    // State for job listings and UI
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [user, setUser] = useState(null);

    // Get user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Initial search (either based on URL params or get recent jobs)
        searchJobs();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        searchJobs();

        // Update URL with search parameters for shareable links
        const params = new URLSearchParams();
        if (searchParams.keyword) params.append('keyword', searchParams.keyword);
        if (searchParams.location) params.append('location', searchParams.location);
        if (searchParams.experienceLevel) params.append('experienceLevel', searchParams.experienceLevel);
        if (searchParams.activeOnly) params.append('activeOnly', searchParams.activeOnly);

        navigate({ search: params.toString() });
    };

    // Clear search parameters
    const handleClearSearch = () => {
        setSearchParams({
            keyword: '',
            location: '',
            experienceLevel: '',
            activeOnly: false
        });
        navigate('/jobs');
        searchJobs(true); // Get recent jobs
    };

    // Function to search jobs
    const searchJobs = async (getRecent = false) => {
        setLoading(true);
        setError('');

        try {
            let response;

            if (getRecent) {
                // Get recent jobs
                response = await axios.get('http://localhost:8080/api/jobs/recent');
            } else if (!searchParams.keyword && !searchParams.location &&
                !searchParams.experienceLevel && !searchParams.activeOnly) {
                // Get recent jobs if no search parameters
                response = await axios.get('http://localhost:8080/api/jobs/recent');
            } else {
                // Search with parameters
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

    // Navigate to job detail page
    const navigateToJobDetail = (jobId) => {
        navigate(`/job-posting/${jobId}`);
    };

    return (
        <div className="jobs-container">
            <div className="jobs-header">
                <div className="header-content">
                    <h1>일자리 찾기</h1>
                    <div className="header-actions">
                        <button className="home-link" onClick={() => navigate('/')}>홈으로</button>
                        {user && user.userType === 'COMPANY' && (
                            <button
                                className="post-job-button"
                                onClick={() => navigate('/job-posting/create')}
                            >
                                새 채용공고 등록
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
                                placeholder="직무, 기술 또는 회사명 검색"
                                className="search-input"
                            />
                            <button type="submit" className="search-button">검색</button>
                        </div>

                        <div className="search-actions">
                            <button
                                type="button"
                                className="advanced-search-toggle"
                                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            >
                                {showAdvancedSearch ? '기본 검색' : '상세 검색'}
                            </button>
                            {(searchParams.keyword || searchParams.location ||
                                searchParams.experienceLevel || searchParams.activeOnly) && (
                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={handleClearSearch}
                                >
                                    초기화
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
                        <div className="loading-container">일자리를 불러오는 중...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : jobs.length === 0 ? (
                        <div className="no-jobs">
                            <p>검색 결과가 없습니다. 다른 검색어를 시도해보세요.</p>
                        </div>
                    ) : (
                        <div className="jobs-list">
                            <div className="results-count">
                                총 {jobs.length}개의 일자리를 찾았습니다.
                            </div>

                            {jobs.map(job => (
                                <div
                                    className="job-card"
                                    key={job.id}
                                    onClick={() => navigateToJobDetail(job.id)}
                                >
                                    <div className="job-header">
                                        <h3 className="job-title">{job.title}</h3>
                                        <div className="company-name">{job.companyName}</div>
                                    </div>

                                    <div className="job-details">
                                        <div className="detail-item">
                                            <span className="detail-icon">📍</span>
                                            <span className="detail-text">{job.location || '미정'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">🧑‍💻</span>
                                            <span className="detail-text">{job.position}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">💼</span>
                                            <span className="detail-text">{job.experienceLevel || '무관'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-icon">💰</span>
                                            <span className="detail-text">{job.salary || '회사 내규에 따름'}</span>
                                        </div>
                                    </div>

                                    {job.requiredSkills && (
                                        <div className="job-skills">
                                            {job.requiredSkills.split(',').map((skill, index) => (
                                                <span className="skill-tag" key={index}>
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="job-footer">
                                        <div className="posted-date">
                                            등록일: {job.createdAt}
                                        </div>
                                        {job.deadline && (
                                            <div className="deadline">
                                                마감일: {job.deadline}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;