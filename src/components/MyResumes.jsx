import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResumeForm from './ResumeForm';
import Recommendations from './Recommendations';
import './MyResumes.css';

// 아이콘 컴포넌트들
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const CompareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="6" height="6"></rect>
        <rect x="15" y="3" width="6" height="6"></rect>
        <rect x="9" y="15" width="6" height="6"></rect>
        <line x1="9" y1="6" x2="15" y2="6"></line>
        <line x1="12" y1="9" x2="12" y2="15"></line>
    </svg>
);

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
    </svg>
);

const MyResumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [resumeToEdit, setResumeToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [visibleResumeId, setVisibleResumeId] = useState(null);
    const navigate = useNavigate();

    const toggleRecommendations = (id) => {
        setVisibleResumeId(prev => (prev === id ? null : id));
    };

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
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    navigate('/login');
                } else {
                    setError('이력서를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
                }
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
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
        const confirmDelete = window.confirm(
            '정말로 이 이력서를 삭제하시겠습니까?\n삭제된 이력서는 복구할 수 없습니다.'
        );

        if (!confirmDelete) {
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

            // 성공 알림을 더 사용자 친화적으로 표시
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success';
            successAlert.innerHTML = '✅ 이력서가 성공적으로 삭제되었습니다.';
            successAlert.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
                color: #155724;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                border: 1px solid #c3e6cb;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            document.body.appendChild(successAlert);

            setTimeout(() => {
                if (document.body.contains(successAlert)) {
                    document.body.removeChild(successAlert);
                }
            }, 3000);

        } catch (err) {
            console.error('Failed to delete resume:', err);
            setError('이력서 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
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
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '오늘';
        if (diffDays === 1) return '어제';
        if (diffDays < 7) return `${diffDays}일 전`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;

        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateContent = (content, maxLength = 150) => {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

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

    // 빈 상태 SVG 아이콘
    const EmptyStateIcon = () => (
        <svg width="120" height="120" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="300" r="200" fill="#f1f5f9" opacity="0.5"/>
            <rect x="190" y="170" width="220" height="260" rx="20" fill="white" stroke="#e2e8f0" strokeWidth="8"/>
            <line x1="230" y1="220" x2="370" y2="220" stroke="#cbd5e0" strokeWidth="8" strokeLinecap="round"/>
            <line x1="230" y1="260" x2="370" y2="260" stroke="#cbd5e0" strokeWidth="8" strokeLinecap="round"/>
            <line x1="230" y1="300" x2="370" y2="300" stroke="#cbd5e0" strokeWidth="8" strokeLinecap="round"/>
            <line x1="230" y1="340" x2="290" y2="340" stroke="#cbd5e0" strokeWidth="8" strokeLinecap="round"/>
            <circle cx="350" cy="350" r="30" fill="#4299e1" opacity="0.2"/>
            <path d="M340 350h20M350 340v20" stroke="#4299e1" strokeWidth="4" strokeLinecap="round"/>
        </svg>
    );

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
                <div className="nav-logo" onClick={() => navigate('/')}>
                    JobBridge
                </div>
                <div className="nav-links">
                    <button className="nav-button" onClick={() => navigate('/')}>
                        <HomeIcon />
                        홈으로
                    </button>
                </div>
            </nav>

            {/* 메인 콘텐츠 */}
            <div className="resumes-content">
                {/* 헤더 섹션 */}
                <div className="resumes-header">
                    <h1 className="resumes-title">
                        나의 <span className="highlight">이력서</span> 관리
                    </h1>
                    <p className="resumes-subtitle">
                        작성한 이력서를 체계적으로 관리하고, AI 추천을 통해 더 나은 기회를 찾아보세요.
                    </p>
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <div className="alert alert-danger">
                        <AlertIcon />
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
                                <SearchIcon className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="이력서 제목이나 내용으로 검색..."
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
                                    <PlusIcon />
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
                                        <EmptyStateIcon />
                                        <h3>
                                            {searchTerm
                                                ? `"${searchTerm}"에 대한 검색 결과가 없습니다`
                                                : '등록된 이력서가 없습니다'
                                            }
                                        </h3>
                                        <p>
                                            {searchTerm
                                                ? '다른 검색어로 시도해보거나 새 이력서를 작성해보세요.'
                                                : '첫 번째 이력서를 작성하여 구직 활동을 시작해보세요!'
                                            }
                                        </p>
                                        <button className="create-first-button" onClick={handleAddNew}>
                                            <PlusIcon />
                                            {searchTerm ? '새 이력서 작성' : '첫 이력서 작성하기'}
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
                                                            <ClockIcon />
                                                            {formatDate(resume.updatedAt)}
                                                        </span>
                                                        <span className="resume-status">활성</span>
                                                    </div>
                                                </div>

                                                <div className="resume-content">
                                                    <p className="resume-excerpt">
                                                        {truncateContent(resume.content)}
                                                    </p>
                                                </div>

                                                <div className="resume-stats">
                                                    <div className="resume-stat">
                                                        <span className="resume-stat-number">0</span>
                                                        <span className="resume-stat-label">조회수</span>
                                                    </div>
                                                    <div className="resume-stat">
                                                        <span className="resume-stat-number">0</span>
                                                        <span className="resume-stat-label">지원수</span>
                                                    </div>
                                                    <div className="resume-stat">
                                                        <span className="resume-stat-number">0</span>
                                                        <span className="resume-stat-label">관심</span>
                                                    </div>
                                                </div>

                                                <div className="resume-skills">
                                                    <h4 className="resume-skills-title">주요 키워드</h4>
                                                    <div className="skills-list">
                                                        <span className="skill-tag">이력서</span>
                                                        <span className="skill-tag">경력</span>
                                                        <span className="skill-tag">채용</span>
                                                        <span className="skill-tag">취업</span>
                                                    </div>
                                                </div>

                                                <div className="resume-actions">
                                                    <button
                                                        className="view-button"
                                                        onClick={() => navigate(`/resume/${resume.id}`)}
                                                        title="이력서 상세보기"
                                                    >
                                                        <EyeIcon />
                                                        상세보기
                                                    </button>

                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(resume)}
                                                        title="이력서 수정"
                                                    >
                                                        <EditIcon />
                                                        수정하기
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(resume.id)}
                                                        title="이력서 삭제"
                                                    >
                                                        <TrashIcon />
                                                        삭제하기
                                                    </button>

                                                    <button
                                                        className="resume-compare-button"
                                                        onClick={() => toggleRecommendations(resume.id)}
                                                        title="이력서 비교 분석"
                                                    >
                                                        <CompareIcon />
                                                        이력서 비교
                                                    </button>

                                                    <button
                                                        className="recommend-career-button"
                                                        onClick={() => {
                                                            navigate('/jobs', { state: { resumeId: resume.id } });
                                                        }}
                                                        title="맞춤 경력 경로 추천받기"
                                                    >
                                                        <TargetIcon />
                                                        경력 추천받기
                                                    </button>
                                                </div>

                                                {visibleResumeId === resume.id && (
                                                    <div className="recommendation-section">
                                                        <Recommendations resumeId={resume.id} />
                                                    </div>
                                                )}
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