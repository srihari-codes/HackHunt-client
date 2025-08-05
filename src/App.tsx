import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import WaitingRoom from './components/WaitingRoom';
import ChallengePage from './components/ChallengePage';
import WinnerPage from './components/WinnerPage';
import GlobalTimer from './components/GlobalTimer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import './styles/cyberpunk.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="cyber-loader">
          <div className="cyber-spinner"></div>
          <p className="text-cyan-400 mt-4 font-mono">INITIALIZING SYSTEM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="matrix-rain"></div>
      </div>
      
      {/* Grid overlay */}
      <div className="fixed inset-0 opacity-5">
        <div className="cyber-grid"></div>
      </div>

      {user && <GlobalTimer />}
      
      <main className="relative z-10">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <LoginPage /> : <Navigate to="/waiting" replace />} 
          />
          <Route 
            path="/waiting" 
            element={user ? <WaitingRoom /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/challenge" 
            element={user ? <ChallengePage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/winner" 
            element={user ? <WinnerPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/waiting" : "/login"} replace />} 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;