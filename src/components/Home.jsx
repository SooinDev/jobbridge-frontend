import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobRecommendations from './JobRecommendations';
import './Home.css';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("사용자 정보 파싱 오류:", error);
                localStorage.removeItem('user'); // 잘못된 데이터인 경우 제거
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="home-container">
            <div className="home-background">
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-circle bg-circle-3"></div>
            </div>

            {/* 상단 네비게이션 바 추가 */}
            <nav className="home-nav">
                <div className="nav-logo">JobBridge</div>
                <div className="nav-links">
                    {user ? (
                        <div className="user-menu">
                            <div className="welcome-message">
                                환영합니다, <span className="user-name" onClick={() => navigate('/mypage')}>{user.name}</span>님
                            </div>
                            <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="nav-button login">로그인</Link>
                            <Link to="/signup" className="nav-button signup">회원가입</Link>
                        </div>
                    )}
                </div>
            </nav>

            <div className="home-content">
                <div className="home-left">
                    <h1 className="home-title">
                        <span className="highlight">JobBridge</span>에서<br />
                        새로운 커리어를 시작하세요
                    </h1>
                    <p className="home-subtitle">
                        AI 기반 맞춤형 채용 매칭 서비스로<br />
                        당신에게 딱 맞는 일자리를 찾아보세요
                    </p>

                    <div className="features">
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <div className="feature-text">인공지능 기반 맞춤 일자리 추천</div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <div className="feature-text">간편한 이력서 작성 및 지원</div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✓</div>
                            <div className="feature-text">기업과 구직자를 연결하는 스마트 매칭</div>
                        </div>
                    </div>

                    {!user && (
                        <div className="home-buttons">
                            <Link to="/signup" className="home-button signup-button">회원가입</Link>
                            <Link to="/login" className="home-button login-button">로그인</Link>
                        </div>
                    )}

                    {user && (
                        <div className="home-buttons">
                            <Link to="/jobs" className="home-button signup-button">일자리 검색</Link>
                            {user.userType === 'INDIVIDUAL' ? (
                                <Link to="/my-resumes" className="home-button login-button">이력서 관리</Link>
                            ) : (
                                <Link to="/my-job-postings" className="home-button login-button">채용공고 관리</Link>
                            )}
                        </div>
                    )}
                </div>

                <div className="home-right">
                    <div className="illustration">
                        <div className="illustration-element illustration-card illustration-card-1">
                            <div className="illustration-icon">💼</div>
                            <div className="illustration-bar"></div>
                            <div className="illustration-bar bar-short"></div>
                        </div>
                        <div className="illustration-element illustration-card illustration-card-2">
                            <div className="illustration-icon">🔍</div>
                            <div className="illustration-bar"></div>
                            <div className="illustration-bar bar-short"></div>
                        </div>
                        <div className="illustration-element illustration-card illustration-card-3">
                            <div className="illustration-icon">📊</div>
                            <div className="illustration-bar"></div>
                            <div className="illustration-bar bar-short"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Recommendations Section for logged in users */}
            {user && (
                <div className="home-recommendations">
                    <div className="recommendations-wrapper">
                        <JobRecommendations user={user} />
                    </div>
                </div>
            )}

            <div className="trusted-by">
                <p className="trusted-text">2,000+ 기업들이 JobBridge를 통해 인재를 채용하고 있습니다</p>
                <div className="company-logos">
                    <div className="company-logo">Company A</div>
                    <div className="company-logo">Company B</div>
                    <div className="company-logo">Company C</div>
                    <div className="company-logo">Company D</div>
                </div>
            </div>
        </div>
    );
};

export default Home;