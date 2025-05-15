import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ResumeRecommendation.css';

export default function ResumeRecommendations({ jobPostingId }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!jobPostingId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:8080/api/match/resumes?jobPostingId=${jobPostingId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setResumes(res.data);
      } catch (err) {
        console.error('[Error] 추천 이력서 API 호출 실패:', err);
        alert('추천 이력서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jobPostingId]);

  if (loading) return <div className="resume-recommendations-loading">로딩 중...</div>;

  if (!resumes.length) {
    return (
      <div className="resume-recommendations">
        <h2>추천 이력서 Top 5</h2>
        <p>추천 결과가 없습니다. 기업 공고가 등록되었는지, 이력서가 충분히 등록되었는지 확인해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="resume-recommendations">
      <h2>추천 이력서 Top 5</h2>
      <ul>
        {resumes.map((resume, idx) => (
          <li key={resume.id} className="resume-item">
            <span className="rank">{idx + 1}.</span>
            <span className="title">{resume.title}</span>
            <span className="applicant">
              by {resume.userName || '알 수 없음'}
            </span>
            <span className="rate">{Math.round(resume.matchRate)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}