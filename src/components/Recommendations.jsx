// src/components/Recommendations.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Recommendations.css';

export default function Recommendations() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        console.log('[Debug] 토큰:', token);

        const res = await axios.get('http://localhost:8080/api/job-matches', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('[Debug] /api/job-matches 응답:', res.status, res.data);
        setMatches(res.data);
      } catch (err) {
        console.error('[Error] 추천 API 호출 실패:', err);
        alert('추천을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="recommendations-loading">로딩 중...</div>;
  }

  if (matches.length === 0) {
    return (
      <div className="recommendations">
        <h2>내 이력서 궁합 상위 5개</h2>
        <p>추천 결과가 없습니다. 이력서가 등록되었는지 확인해 보세요.</p>
      </div>
    );
  }

  return (
    <div className="recommendations">
      <h2>내 이력서 궁합 상위 5개</h2>
      <ul>
        {matches.map((m, i) => (
          <li key={m.jobId} className="match-item">
            <span className="rank">{i + 1}.</span>
            <span className="title">{m.title}</span>
            <span className="company">{m.companyName}</span>
            <span className="rate">{Math.round(m.matchRate)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
