import React, { useState } from 'react';
import SignupForm from './components/SignupForm';

function App() {
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h1 style={{ fontSize: '2.5rem', color: '#333' }}>Welcome to JobBridge</h1>
            <p style={{ color: '#555' }}>AI 기반 구인구직 플랫폼에 오신 걸 환영합니다!</p>
            <button
                onClick={handleToggleForm}
                style={{
                    padding: '0.8rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer',
                    marginTop: '1rem'
                }}
            >
                {showForm ? '가입 폼 닫기' : '회원가입'}</button>

            {showForm && <SignupForm />}
        </div>
    );
}

export default App;