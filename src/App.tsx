import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardHubPage } from './pages/DashboardHubPage';
import { NewResearchPage } from './pages/NewResearchPage';
import { SimplifiedResearchPage } from './pages/SimplifiedResearchPage';
import { DashboardPage } from './pages/DashboardPage';

// +++ NEW IMPORTS +++
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardHubPage />} />
            <Route path="/new-research" element={<NewResearchPage />} />
            <Route path="/research/:jobId" element={<SimplifiedResearchPage />} />
            <Route path="/dashboard/:jobId" element={<DashboardPage />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;