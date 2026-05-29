import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate(ROUTES.leagues);
    } catch (requestError) {
      const message = requestError?.response?.data?.error?.message || 'Invalid login credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <h1>Login</h1>
      <p>Sign in with your email and password to join leagues.</p>
      <FeedbackBanner type="error" message={error} />
      <form className="stacked-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </section>
  );
}

export default LoginPage;
