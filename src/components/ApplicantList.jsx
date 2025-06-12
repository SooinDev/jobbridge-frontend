import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyJobPostings.css';

const ApplicantList = ({ jobPostingId }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/applications/company/${jobPostingId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setApplicants(response.data);
            } catch (err) {
                console.error(err);
                setError('지원자 목록을 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [jobPostingId]);

    if (loading) return <div className="loading-text">지원자 정보를 불러오는 중...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (applicants.length === 0) return <div className="empty-jobs"><p>아직 지원한 사용자가 없습니다.</p></div>;

    return (
        <div className="recommendation-section">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1a202c' }}>
                지원자 목록
            </h2>
            {applicants.map((applicant, index) => (
                <div
                    key={index}
                    className="job-card"
                    style={{ padding: '1.5rem', marginBottom: '1rem' }}
                >
                    <div className="job-card-header" style={{ marginBottom: '1rem' }}>
                        <h3 className="job-title" style={{ fontSize: '1.25rem' }}>
                            🧑‍💼 {applicant.name}
                        </h3>
                    </div>
                    <div className="job-details" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="job-detail-item">
                            <span className="detail-label">이메일</span>
                            <span className="detail-value">{applicant.email}</span>
                        </div>
                        <div className="job-detail-item">
                            <span className="detail-label">지원일</span>
                            <span className="detail-value">
                {new Date(applicant.appliedAt).toLocaleString('ko-KR')}
              </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ApplicantList;
