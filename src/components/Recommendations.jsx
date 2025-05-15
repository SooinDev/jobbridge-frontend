// src/components/Recommendations.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Recommendations.css';

export default function Recommendations({ resumeId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // resumeId가 없으면 호출하지 않음
    if (!resumeId) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const token = localStorage.getItem('token');
        // resumeId를 쿼리 파라미터로 전달
        const res = await axios.get(
          `http://localhost:8080/api/match/jobs?resumeId=${resumeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMatches(res.data);
      } catch (err) {
        console.error('[Error] 추천 API 호출 실패:', err);
        alert('추천을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [resumeId]);  // resumeId가 바뀔 때마다 다시 호출

  if (loading) return <div className="recommendations-loading">로딩 중...</div>;

  if (matches.length === 0) {
    return (
      <div className="recommendations">
        <h2>이력서 #{resumeId} 일치 상위 5개</h2>
        <p>추천 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="recommendations">
      <h2>이력서 #{resumeId} 일치 상위 5개</h2>
      <ul>
        {matches.map((job, idx) => (
          <li key={job.id} className="match-item">
            <span className="rank">{idx + 1}.</span>
            <span className="title">{job.title}</span>
            <span className="rate">{Math.round(job.matchRate)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
