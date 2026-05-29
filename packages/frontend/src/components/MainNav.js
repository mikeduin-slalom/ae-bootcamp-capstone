import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';

function MainNav() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.home);
  };

  return (
    <header className="main-nav-shell">
      <nav className="main-nav" aria-label="Primary">
        <NavLink to={ROUTES.home}>Home</NavLink>
        <NavLink to={ROUTES.login}>Login</NavLink>
        <NavLink to={ROUTES.leagues}>Leagues</NavLink>
        <NavLink to={ROUTES.howToPlay}>How to Play</NavLink>
      </nav>

      <div className="auth-chip" aria-live="polite">
        {isAuthenticated ? (
          <>
            <span>Signed in as {user?.displayName || user?.email}</span>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <span>Signed out</span>
        )}
      </div>
    </header>
  );
}

export default MainNav;
