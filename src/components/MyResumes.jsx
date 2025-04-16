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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
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
                setTimeout(() => {
                    setLoading(false);
                }, 500); // 약간의 지연으로 부드러운 로딩 효과
            }
        };

        fetchResumes();
    }, [navigate, showForm]);

    const handleEdit = (resume) => {
        setResumeToEdit(resume);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormClose = () => {
        setShowForm(false);
        setResumeToEdit(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 검색어에 따른 이력서 필터링
    const filteredResumes = searchTerm
        ? resumes.filter(resume =>
            resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resume.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : resumes;

    // 정렬 순서에 따른 이력서 정렬
    const sortedResumes = [...filteredResumes].sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);

        if (sortOrder === 'newest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    // 검색어 입력 핸들러
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 정렬 순서 변경 핸들러
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    // 스켈레톤 로딩 UI
    const renderSkeletons = () => {
        return Array(4).fill().map((_, index) => (
            <div className="resume-skeleton" key={`skeleton-${index}`}>
                <div className="skeleton-header">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-meta"></div>
                </div>
                <div className="skeleton-content">
                    <div className="skeleton-line skeleton-line-1"></div>
                    <div className="skeleton-line skeleton-line-2"></div>
                    <div className="skeleton-line skeleton-line-3"></div>
                </div>
                <div className="skeleton-actions">
                    <div className="skeleton-button"></div>
                    <div className="skeleton-button"></div>
                    <div className="skeleton-button"></div>
                </div>
            </div>
        ));
    };

    return (
        <div className="my-resumes-container">
            {/* 배경 효과 */}
            <div className="resumes-background">
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-circle bg-circle-3"></div>
            </div>

            {/* 네비게이션 바 */}
            <nav className="resumes-nav">
                <div className="nav-logo" onClick={() => navigate('/')}>JobBridge</div>
                <div className="nav-links">
                    <button className="nav-button home" onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        &nbsp;홈으로
                    </button>
                </div>
            </nav>

            {/* 메인 콘텐츠 */}
            <div className="resumes-content">
                {/* 헤더 섹션 */}
                <div className="resumes-header">
                    <h1 className="resumes-title">
                        <span className="highlight">이력서</span> 관리
                    </h1>
                    <p className="resumes-subtitle">
                        작성한 이력서를 관리하고 구직 활동에 활용하세요. 맞춤형 이력서로 새로운 기회를 얻을 수 있습니다.
                    </p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {error}
                    </div>
                )}

                {showForm ? (
                    <ResumeForm
                        resumeToEdit={resumeToEdit}
                        setShowForm={handleFormClose}
                    />
                ) : (
                    <>
                        {/* 액션 영역 - 검색 및 정렬 */}
                        <div className="resumes-actions">
                            <div className="search-area">
                                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="이력서 검색..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="filter-sort">
                                <select
                                    className="sort-select"
                                    value={sortOrder}
                                    onChange={handleSortChange}
                                >
                                    <option value="newest">최신순</option>
                                    <option value="oldest">오래된순</option>
                                </select>

                                <button className="add-resume-button" onClick={handleAddNew}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    새 이력서 작성
                                </button>
                            </div>
                        </div>

                        {/* 이력서 목록 */}
                        {loading ? (
                            <div>
                                <div className="loading-container">
                                    <div className="spinner"></div>
                                    <p className="loading-text">이력서를 불러오는 중...</p>
                                </div>
                                <div className="resumes-grid">
                                    {renderSkeletons()}
                                </div>
                            </div>
                        ) : (
                            <>
                                {sortedResumes.length === 0 ? (
                                    <div className="empty-resumes">
                                        <svg width="120" height="120" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M300 500C411.046 500 500 411.046 500 300C500 188.954 411.046 100 300 100C188.954 100 100 188.954 100 300C100 411.046 188.954 500 300 500Z" fill="#F3F4F6" />
                                            <path d="M410 170H190C184.477 170 180 174.477 180 180V420C180 425.523 184.477 430 190 430H410C415.523 430 420 425.523 420 420V180C420 174.477 415.523 170 410 170Z" fill="white" stroke="#E5E7EB" strokeWidth="8" />
                                            <path d="M230 220H370" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round" />
                                            <path d="M230 260H370" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round" />
                                            <path d="M230 300H370" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round" />
                                            <path d="M230 340H290" stroke="#D1D5DB" strokeWidth="8" strokeLinecap="round" />
                                        </svg>
                                        <h3>등록된 이력서가 없습니다</h3>
                                        <p>새 이력서를 작성해 취업 활동을 시작해보세요!</p>
                                        <button className="create-first-button" onClick={handleAddNew}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            첫 이력서 작성하기
                                        </button>
                                    </div>
                                ) : (
                                    <div className="resumes-grid">
                                        {sortedResumes.map(resume => (
                                            <div className="resume-card" key={resume.id}>
                                                <div className="resume-card-header">
                                                    <h3 className="resume-title">{resume.title}</h3>
                                                    <div className="resume-meta">
                                                        <span className="resume-date">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <polyline points="12 6 12 12 16 14"></polyline>
                                                            </svg>
                                                            {formatDate(resume.updatedAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="resume-content">
                                                    <p className="resume-excerpt">{resume.content}</p>
                                                </div>
                                                <div className="resume-actions">
                                                    <button
                                                        className="view-button"
                                                        onClick={() => navigate(`/resume/${resume.id}`)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                        상세보기
                                                    </button>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(resume)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                        수정
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(resume.id)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                                        </svg>
                                                        삭제
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyResumes;