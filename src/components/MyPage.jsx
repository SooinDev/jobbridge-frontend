import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';

const MyPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeJobCount, setActiveJobCount] = useState(0);
    const [applicantsCount, setApplicantsCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                // 사용자 정보 조회 API 호출 (Backend API 구현 필요)
                // fetchUserDetails(parsedUser.email);

                // 기업 회원인 경우 채용공고 데이터 가져오기
                if (parsedUser.userType === 'COMPANY') {
                    fetchJobPostings();
                }

                setLoading(false);
            } catch (error) {
                console.error("사용자 정보 파싱 오류:", error);
                localStorage.removeItem('user');
                navigate('/login');
            }
        } else {
            // 로그인되지 않은 경우
            navigate('/login');
        }
    }, [navigate]);

    // 사용자 상세 정보 가져오기 (백엔드 API 추가 구현 필요)
    // const fetchUserDetails = async (email) => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/user/${email}`);
    //         setUser(prevUser => ({ ...prevUser, ...response.data }));
    //     } catch (err) {
    //         console.error('사용자 정보 조회 실패:', err);
    //         setError('사용자 정보를 불러오는데 실패했습니다.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // 기업 회원의 채용공고 정보 가져오기
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

            // 현재 날짜 기준으로 마감되지 않은 채용공고 필터링
            const currentDate = new Date();
            const activeJobs = response.data.filter(job => {
                // 마감일이 없거나 현재 날짜보다 이후인 경우 활성 채용공고로 간주
                return !job.deadline || new Date(job.deadline) > currentDate;
            });

            setActiveJobCount(activeJobs.length);

            // 지원자 수는 현재 API에서 제공하지 않으므로 0으로 설정
            // 실제 지원자 API가 구현되면 해당 정보를 가져와 설정
            setApplicantsCount(0);

        } catch (err) {
            console.error('채용공고 정보 조회 실패:', err);
            setError('채용공고 정보를 불러오는데 실패했습니다.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    const navigateToResumes = () => {
        navigate('/my-resumes');
    };

    const navigateToJobPostings = () => {
        navigate('/my-job-postings');
    };

    const navigateToCreateResume = () => {
        navigate('/resume/create');
    };

    const navigateToCreateJobPosting = () => {
        navigate('/job-posting/create');
    };

    const navigateToJobs = () => {
        navigate('/jobs');
    };

    if (loading) {
        return <div className="loading-container">정보를 불러오는 중...</div>;
    }

    return (
        <div className="mypage-container">
            <div className="mypage-header">
                <div className="header-content">
                    <h1>마이페이지</h1>
                    <div className="header-actions">
                        <button className="home-link" onClick={() => navigate('/')}>홈으로</button>
                        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                    </div>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="mypage-content">
                <div className="user-profile-section">
                    <div className="profile-header">
                        <div className="profile-image">
                            {user?.name?.charAt(0) || '?'}
                        </div>
                        <div className="profile-info">
                            <h2>{user?.name || '사용자'}</h2>
                            <p className="user-email">{user?.email || ''}</p>
                            <p className="user-type">
                                {user?.userType === 'INDIVIDUAL' ? '개인 회원' : '기업 회원'}
                            </p>
                        </div>
                    </div>

                    <div className="profile-details">
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
                            <button className="edit-button">정보 수정</button>
                        </div>

                        {user?.userType === 'INDIVIDUAL' ? (
                            <div className="detail-card">
                                <h3>구직 활동</h3>
                                <div className="activity-stats">
                                    <div className="stat-item">
                                        <span className="stat-number">0</span>
                                        <span className="stat-label">지원한 공고</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">0</span>
                                        <span className="stat-label">저장한 공고</span>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button className="action-button" onClick={navigateToResumes}>이력서 관리</button>
                                    <button className="action-button" onClick={navigateToJobs}>일자리 검색</button>
                                </div>
                            </div>
                        ) : (
                            <div className="detail-card">
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
                                </div>
                                <div className="action-buttons">
                                    <button className="action-button" onClick={navigateToJobPostings}>공고 관리</button>
                                    <button className="action-button" onClick={navigateToCreateJobPosting}>새 채용공고 등록</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="recent-activity-section">
                    <h3>최근 활동</h3>
                    {user?.userType === 'INDIVIDUAL' ? (
                        <div className="activity-list">
                            <div className="empty-activity">
                                최근 이력서 활동 내역이 없습니다.
                                <div className="activity-buttons">
                                    <button className="activity-button" onClick={navigateToCreateResume}>
                                        새 이력서 작성하기
                                    </button>
                                    <button className="activity-button" onClick={navigateToJobs}>
                                        일자리 찾아보기
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="activity-list">
                            <div className="empty-activity">
                                최근 채용공고 활동 내역이 없습니다.
                                <div className="activity-buttons">
                                    <button className="activity-button" onClick={navigateToCreateJobPosting}>
                                        새 채용공고 등록하기
                                    </button>
                                    <button className="activity-button" onClick={navigateToJobPostings}>
                                        내 채용공고 관리하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 계정 설정 섹션 */}
                <div className="settings-section">
                    <h3>계정 설정</h3>
                    <div className="settings-options">
                        <div className="settings-option">
                            <span className="option-icon">🔒</span>
                            <span className="option-name">비밀번호 변경</span>
                        </div>
                        <div className="settings-option">
                            <span className="option-icon">🔔</span>
                            <span className="option-name">알림 설정</span>
                        </div>
                        <div className="settings-option">
                            <span className="option-icon">👤</span>
                            <span className="option-name">프로필 설정</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;