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
    const [applications, setApplications] = useState([]); // ✅ 추가됨
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
                    fetchMyApplications(); // ✅ 개인이면 지원내역도 가져오기
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

    // ✅ 지원 내역 불러오기
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
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
    };

    const navigateToResumes = () => navigate('/my-resumes');
    const navigateToJobPostings = () => navigate('/my-job-postings');
    const navigateToCreateJobPosting = () => navigate('/job-posting/create');
    const navigateToJobs = () => navigate('/jobs');

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
                                        <span className="stat-number">{applications.length}</span>
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

                {/* ✅ 최근 지원 내역 */}
                {user?.userType === 'INDIVIDUAL' && (
                    <div className="recent-activity-section">
                        <h3>내 지원 내역</h3>
                        {applications.length === 0 ? (
                            <p>아직 지원한 공고가 없습니다.</p>
                        ) : (
                            <ul className="application-list">
                                {applications.map((app, index) => (
                                    <li
                                        key={index}
                                        className="application-item"
                                        onClick={() => navigate(`/job-posting/${app.jobPostingId}`)}
                                    >
                                        <h4>{app.jobTitle}</h4>
                                        <p>회사명: {app.companyName}</p>
                                        <p>지원일: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

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
