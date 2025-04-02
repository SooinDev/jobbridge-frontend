import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import MyPage from './components/MyPage';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignupForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/mypage" element={<MyPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;