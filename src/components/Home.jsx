import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import JobRecommendations from './JobRecommendations';
import './Home.css';
import '../styles/common.css';

// SVG Icons Components
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
);

const BriefcaseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const DocumentIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14,2 14,8 20,8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
);

const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const LogoutIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const Home = () => {
    const [user, setUser] = useState(null);
    const [isNavScrolled, setIsNavScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 가져오기
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("사용자 정보 파싱 오류:", error);
                localStorage.removeItem('user');
            }
        }

        // 스크롤 이벤트 리스너
        const handleScroll = () => {
            setIsNavScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="modern-home-container">
            {/* 배경 애니메이션 요소들 */}
            <div className="modern-home-background">
                <div className="floating-element floating-element-1"></div>
                <div className="floating-element floating-element-2"></div>
                <div className="floating-element floating-element-3"></div>
            </div>

            {/* 모던 네비게이션 */}
            <nav className={`modern-nav ${isNavScrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <div className="nav-content">
                        <Link to="/" className="modern-logo">
                            <div className="logo-icon">J</div>
                            <span className="logo-text">JobBridge</span>
                        </Link>

                        <div className="nav-menu">
                            <Link to="/" className="nav-link active">홈</Link>
                            <Link to="/jobs" className="nav-link">일자리</Link>
                            {user && user.userType === 'INDIVIDUAL' && (
                                <Link to="/my-resumes" className="nav-link">이력서</Link>
                            )}
                            {user && user.userType === 'COMPANY' && (
                                <Link to="/my-job-postings" className="nav-link">채용관리</Link>
                            )}
                            <Link to="/mypage" className="nav-link">마이페이지</Link>
                        </div>

                        <div className="nav-actions">
                            {user ? (
                                <div className="user-menu">
                                    <div className="welcome-text">
                                        안녕하세요, <span
                                        className="user-name"
                                        onClick={() => navigate('/mypage')}
                                    >
                                            {user.name}
                                        </span>님
                                    </div>
                                    <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                                        <LogoutIcon />
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="btn btn-ghost">로그인</Link>
                                    <Link to="/signup" className="btn btn-primary">회원가입</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* 히어로 섹션 */}
            <section className="modern-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            <span className="hero-highlight">AI가 찾아주는</span><br />
                            완벽한 일자리
                        </h1>
                        <p className="hero-subtitle">
                            JobBridge에서 당신의 커리어를 한 단계 업그레이드하세요.<br />
                            인공지능 기반 맞춤 매칭으로 최적의 기회를 만나보세요.
                        </p>

                        {/* 주요 특징 */}
                        <div className="hero-features">
                            <div className="hero-feature">
                                <div className="feature-icon">
                                    <CheckIcon />
                                </div>
                                <span>AI 기반 맞춤 추천</span>
                            </div>
                            <div className="hero-feature">
                                <div className="feature-icon">
                                    <CheckIcon />
                                </div>
                                <span>간편한 이력서 작성</span>
                            </div>
                            <div className="hero-feature">
                                <div className="feature-icon">
                                    <CheckIcon />
                                </div>
                                <span>스마트 매칭 시스템</span>
                            </div>
                        </div>

                        {/* 액션 버튼 */}
                        {!user ? (
                            <div className="hero-actions">
                                <Link to="/signup" className="btn btn-primary btn-lg">
                                    <BriefcaseIcon />
                                    지금 시작하기
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-lg">
                                    <HomeIcon />
                                    로그인
                                </Link>
                            </div>
                        ) : (
                            <div className="hero-actions">
                                <Link to="/jobs" className="btn btn-primary btn-lg">
                                    <BriefcaseIcon />
                                    일자리 검색
                                </Link>
                                {user.userType === 'INDIVIDUAL' ? (
                                    <Link to="/my-resumes" className="btn btn-secondary btn-lg">
                                        <DocumentIcon />
                                        이력서 관리
                                    </Link>
                                ) : (
                                    <Link to="/my-job-postings" className="btn btn-secondary btn-lg">
                                        <DocumentIcon />
                                        채용공고 관리
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 일자리 추천 섹션 */}
            {user && (
                <section className="recommendations-section">
                    <div className="container">
                        <div className="recommendations-header">
                            <h2 className="recommendations-title">
                                맞춤 <span className="gradient-text">추천 일자리</span>
                            </h2>
                            <p className="recommendations-subtitle">
                                AI가 분석한 당신을 위한 최고의 기회들
                            </p>
                        </div>

                        <JobRecommendations user={user} />
                    </div>
                </section>
            )}

            {/* 통계 섹션 */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-content">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">15,000+</span>
                                <span className="stat-label">활성 일자리</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">2,500+</span>
                                <span className="stat-label">파트너 기업</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">98%</span>
                                <span className="stat-label">매칭 만족도</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">50,000+</span>
                                <span className="stat-label">성공한 취업</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 신뢰받는 기업들 섹션 */}
            <section className="trusted-section">
                <div className="container">
                    <p className="trusted-text">2,000+ 기업들이 JobBridge를 통해 인재를 채용하고 있습니다</p>
                    <div className="company-logos">
                        <div className="company-logo">Samsung</div>
                        <div className="company-logo">LG</div>
                        <div className="company-logo">SK</div>
                        <div className="company-logo">Naver</div>
                        <div className="company-logo">Kakao</div>
                        <div className="company-logo">Coupang</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;