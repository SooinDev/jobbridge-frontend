import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';

// 아이콘 컴포넌트들
const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
);

const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const BriefcaseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const FileTextIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
);

const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeJobCount, setActiveJobCount] = useState(0);
    const [applicantsCount, setApplicantsCount] = useState(0);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                if (parsedUser.userType === 'COMPANY') {
                    fetchJobPostings();
                }

                if (parsedUser.userType === 'INDIVIDUAL') {
                    fetchMyApplications();
                }

                setLoading(false);
            } catch (error) {
                console.error("사용자 정보 파싱 오류:", error);
                localStorage.removeItem('user');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchJobPostings = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:8080/api/job-posting/my', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const currentDate = new Date();
            const activeJobs = response.data.filter(job => {
                return !job.deadline || new Date(job.deadline) > currentDate;
            });

            setActiveJobCount(activeJobs.length);
            setApplicantsCount(0);

        } catch (err) {
            console.error('채용공고 정보 조회 실패:', err);
            setError('채용공고 정보를 불러오는데 실패했습니다.');
        }
    };

    const fetchMyApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/applications/mine', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setApplications(response.data);
        } catch (err) {
            console.error('지원 내역 불러오기 실패:', err);
        }
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('정말로 로그아웃 하시겠습니까?');
        if (confirmLogout) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    const navigateToResumes = () => navigate('/my-resumes');
    const navigateToJobPostings = () => navigate('/my-job-postings');
    const navigateToCreateJobPosting = () => navigate('/job-posting/create');
    const navigateToJobs = () => navigate('/jobs');

    const getUserInitials = (name) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">정보를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="mypage-container">
            {/* 헤더 */}
            <div className="mypage-header">
                <div className="header-content">
                    <h1>마이페이지</h1>
                    <div className="header-actions">
                        <button className="home-link" onClick={() => navigate('/')}>
                            <HomeIcon />
                            홈으로
                        </button>
                        <button className="logout-button" onClick={handleLogout}>
                            <LogoutIcon />
                            로그아웃
                        </button>
                    </div>
                </div>
            </div>

            {/* 에러 메시지 */}
            {error && <div className="error-message">{error}</div>}

            <div className="mypage-content">
                {/* 사용자 프로필 섹션 */}
                <div className="user-profile-section">
                    <div className="profile-header">
                        <div className="profile-image">
                            {getUserInitials(user?.name)}
                        </div>
                        <div className="profile-info">
                            <h2>{user?.name || '사용자'}</h2>
                            <p className="user-email">{user?.email || ''}</p>
                            <div className={`user-type ${user?.userType === 'COMPANY' ? 'company-type' : 'individual-type'}`}>
                                {user?.userType === 'INDIVIDUAL' ? '개인 회원' : '기업 회원'}
                            </div>
                        </div>
                    </div>

                    <div className="profile-details">
                        {/* 기본 정보 카드 */}
                        <div className="detail-card">
                            <h3>기본 정보</h3>
                            <div className="detail-item">
                                <span className="detail-label">이름</span>
                                <span className="detail-value">{user?.name || '미입력'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">이메일</span>
                                <span className="detail-value">{user?.email || '미입력'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">회원 유형</span>
                                <span className="detail-value">
                                    {user?.userType === 'INDIVIDUAL' ? '개인 회원' : '기업 회원'}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">가입일</span>
                                <span className="detail-value">
                                    {user?.createdAt ? formatDate(user.createdAt) : '정보 없음'}
                                </span>
                            </div>
                            <button className="edit-button">
                                <EditIcon />
                                정보 수정
                            </button>
                        </div>

                        {/* 활동 통계 카드 */}
                        {user?.userType === 'INDIVIDUAL' ? (
                            <div className="detail-card individual-card">
                                <h3>구직 활동</h3>
                                <div className="activity-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{applications.length}</span>
                                        <span className="stat-label">지원한 공고</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">0</span>
                                        <span className="stat-label">저장한 공고</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">0</span>
                                        <span className="stat-label">면접 예정</span>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button className="action-button" onClick={navigateToResumes}>
                                        <FileTextIcon />
                                        이력서 관리
                                    </button>
                                    <button className="action-button" onClick={navigateToJobs}>
                                        <SearchIcon />
                                        일자리 검색
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="detail-card company-card">
                                <h3>채용 관리</h3>
                                <div className="activity-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">{activeJobCount}</span>
                                        <span className="stat-label">진행 중인 공고</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{applicantsCount}</span>
                                        <span className="stat-label">지원자</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">0</span>
                                        <span className="stat-label">면접 예정</span>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button className="action-button" onClick={navigateToJobPostings}>
                                        <BriefcaseIcon />
                                        공고 관리
                                    </button>
                                    <button className="action-button" onClick={navigateToCreateJobPosting}>
                                        <PlusIcon />
                                        새 채용공고
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 최근 지원 내역 (개인 회원만) */}
                {user?.userType === 'INDIVIDUAL' && (
                    <div className="recent-activity-section">
                        <h3>내 지원 내역</h3>
                        {applications.length === 0 ? (
                            <div className="empty-activity">
                                <p>아직 지원한 공고가 없습니다.</p>
                                <p>관심 있는 채용공고를 찾아 지원해보세요!</p>
                                <div className="activity-buttons">
                                    <button className="activity-button" onClick={navigateToJobs}>
                                        <SearchIcon />
                                        일자리 찾아보기
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ul className="application-list">
                                    {applications.slice(0, 5).map((app, index) => (
                                        <li
                                            key={index}
                                            className="application-item"
                                            onClick={() => navigate(`/job-posting/${app.jobPostingId}`)}
                                        >
                                            <h4>{app.jobTitle}</h4>
                                            <p><strong>회사:</strong> {app.companyName}</p>
                                            <p><strong>지원일:</strong> {formatDate(app.appliedAt)}</p>
                                        </li>
                                    ))}
                                </ul>
                                {applications.length > 5 && (
                                    <div className="activity-buttons">
                                        <button className="activity-button" onClick={() => navigate('/my-applications')}>
                                            전체 지원 내역 보기
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* 설정 섹션 */}
                <div className="settings-section">
                    <h3>계정 설정</h3>
                    <div className="settings-options">
                        <div className="settings-option" onClick={() => alert('비밀번호 변경 기능은 준비 중입니다.')}>
                            <span className="option-icon">🔒</span>
                            <span className="option-name">비밀번호 변경</span>
                        </div>
                        <div className="settings-option" onClick={() => alert('알림 설정 기능은 준비 중입니다.')}>
                            <span className="option-icon">🔔</span>
                            <span className="option-name">알림 설정</span>
                        </div>
                        <div className="settings-option" onClick={() => alert('프로필 설정 기능은 준비 중입니다.')}>
                            <span className="option-icon">👤</span>
                            <span className="option-name">프로필 설정</span>
                        </div>
                        <div className="settings-option" onClick={() => alert('개인정보 처리방침을 확인하세요.')}>
                            <span className="option-icon">📋</span>
                            <span className="option-name">개인정보 처리방침</span>
                        </div>
                        <div className="settings-option" onClick={() => alert('고객지원팀에 문의하세요.')}>
                            <span className="option-icon">💬</span>
                            <span className="option-name">고객 지원</span>
                        </div>
                        <div className="settings-option" onClick={() => alert('서비스 이용약관을 확인하세요.')}>
                            <span className="option-icon">📄</span>
                            <span className="option-name">이용약관</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;