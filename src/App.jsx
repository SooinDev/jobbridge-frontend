import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import MyPage from './components/MyPage';
import ResumeForm from './components/ResumeForm';
import MyResumes from './components/MyResumes';
import ResumeDetail from './components/ResumeDetail';
import JobPostingForm from './components/JobPostingForm';
import MyJobPostings from './components/MyJobPostings';
import JobPostingDetail from './components/JobPostingDetail';
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

                    {/* Resume Routes */}
                    <Route path="/resume/create" element={<ResumeForm />} />
                    <Route path="/resume/edit/:id" element={<ResumeForm />} />
                    <Route path="/resume/:id" element={<ResumeDetail />} />
                    <Route path="/my-resumes" element={<MyResumes />} />

                    {/* Job Posting Routes */}
                    <Route path="/job-posting/create" element={<JobPostingForm />} />
                    <Route path="/job-posting/edit/:id" element={<JobPostingForm />} />
                    <Route path="/job-posting/:id" element={<JobPostingDetail />} />
                    <Route path="/my-job-postings" element={<MyJobPostings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;