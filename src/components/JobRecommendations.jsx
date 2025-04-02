import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './JobRecommendations.css';

const JobRecommendations = ({ user }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Only fetch recommendations for individual users
        if (user && user.userType === 'INDIVIDUAL') {
            fetchRecommendations();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchRecommendations = async () => {
        try {
            // Get recent jobs as recommendations (can be enhanced with AI logic in the future)
            const response = await axios.get('http://localhost:8080/api/jobs/recent');
            setRecommendations(response.data.slice(0, 3)); // Get top 3 jobs
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch job recommendations:', err);
            setError('추천 일자리를 불러오는데 실패했습니다.');
            setLoading(false);
        }
    };

    // Navigate to job detail
    const navigateToJobDetail = (jobId) => {
        navigate(`/job-posting/${jobId}`);
    };

    // Navigate to jobs page
    const seeAllJobs = () => {
        navigate('/jobs');
    };

    if (!user || user.userType !== 'INDIVIDUAL') {
        return null;
    }

    if (loading) {
        return <div className="recommendations-loading">추천 일자리 불러오는 중...</div>;
    }

    if (error) {
        return <div className="recommendations-error">{error}</div>;
    }

    return (
        <div className="recommendations-container">
            <div className="recommendations-header">
                <h2>맞춤 추천 일자리</h2>
                <button className="see-all-button" onClick={seeAllJobs}>모든 일자리 보기</button>
            </div>

            {recommendations.length === 0 ? (
                <div className="no-recommendations">
                    <p>현재 추천 일자리가 없습니다.</p>
                </div>
            ) : (
                <div className="recommendations-list">
                    {recommendations.map(job => (
                        <div
                            className="recommendation-card"
                            key={job.id}
                            onClick={() => navigateToJobDetail(job.id)}
                        >
                            <div className="recommendation-header">
                                <h3 className="recommendation-title">{job.title}</h3>
                                <div className="recommendation-company">{job.companyName}</div>
                            </div>

                            <div className="recommendation-details">
                                <div className="recommendation-detail">
                                    <span className="detail-icon">📍</span>
                                    <span className="detail-text">{job.location || '미정'}</span>
                                </div>
                                <div className="recommendation-detail">
                                    <span className="detail-icon">💰</span>
                                    <span className="detail-text">{job.salary || '회사 내규에 따름'}</span>
                                </div>
                            </div>

                            {job.requiredSkills && (
                                <div className="recommendation-skills">
                                    {job.requiredSkills.split(',').slice(0, 3).map((skill, index) => (
                                        <span className="skill-badge" key={index}>
                                            {skill.trim()}
                                        </span>
                                    ))}
                                    {job.requiredSkills.split(',').length > 3 && (
                                        <span className="skill-badge-more">+{job.requiredSkills.split(',').length - 3}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobRecommendations;