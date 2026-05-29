import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.leagues, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  function validate() {
    const errors = {};

    if (!displayName.trim()) {
      errors.displayName = 'Display name is required.';
    } else if (displayName.trim().length < 2 || displayName.trim().length > 20) {
      errors.displayName = 'Display name must be between 2 and 20 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email is required.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    return errors;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await register({ displayName: displayName.trim(), email: email.trim(), password });
      navigate(ROUTES.leagues);
    } catch (requestError) {
      const message =
        requestError?.response?.data?.error?.message || 'Registration failed. Please try again.';
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <h1>Create an Account</h1>
      <p>Sign up to join and manage fantasy football leagues.</p>
      <FeedbackBanner type="error" message={serverError} />
      <form className="stacked-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          autoComplete="nickname"
        />
        {fieldErrors.displayName && (
          <p className="field-error">{fieldErrors.displayName}</p>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
        {fieldErrors.email && (
          <p className="field-error">{fieldErrors.email}</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
        {fieldErrors.password && (
          <p className="field-error">{fieldErrors.password}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </section>
  );
}

export default RegisterPage;
