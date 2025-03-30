import React, { useState } from 'react';
import SignupForm from './components/SignupForm';
import './App.css';

function App() {
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Welcome to JobBridge</h1>
                <p>AI 기반 구인구직 플랫폼에 오신 걸 환영합니다!</p>
                <button
                    className="toggle-button"
                    onClick={handleToggleForm}
                >
                    {showForm ? '가입 폼 닫기' : '회원가입'}
                </button>
            </header>

            {showForm && <SignupForm />}
        </div>
    );
}

export default App;