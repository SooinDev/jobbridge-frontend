import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-background">
                <div className="bg-circle bg-circle-1"></div>
                <div className="bg-circle bg-circle-2"></div>
                <div className="bg-circle bg-circle-3"></div>
            </div>

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

                    <div className="home-buttons">
                        <Link to="/signup" className="home-button signup-button">회원가입</Link>
                        <Link to="/login" className="home-button login-button">로그인</Link>
                    </div>
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