import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

function HomePage() {
  return (
    <section className="page-card">
      <h1>Welcome to Fantasy League HQ</h1>
      <p>
        Use this hub to sign in, browse leagues, and learn how each fantasy season works from draft
        to scoring.
      </p>
      <div className="home-actions">
        <Link className="cta" to={ROUTES.login}>
          Go to Login
        </Link>
        <Link className="cta" to={ROUTES.leagues}>
          Browse Leagues
        </Link>
        <Link className="cta" to={ROUTES.howToPlay}>
          How to Play
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
