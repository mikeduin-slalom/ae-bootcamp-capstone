import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import MainNav from './components/MainNav';
import { ROUTES } from './constants/routes';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import HowToPlayPage from './pages/HowToPlayPage';
import LeaguesPage from './pages/LeaguesPage';
import LoginPage from './pages/LoginPage';

function AppShell() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app">
        <main className="app-main">Checking session...</main>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="orb orb-left" aria-hidden="true" />
      <div className="orb orb-right" aria-hidden="true" />
      <main className="app-main">
        <MainNav />
        <Routes>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.leagues} element={<LeaguesPage />} />
          <Route path={ROUTES.howToPlay} element={<HowToPlayPage />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;