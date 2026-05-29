import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LandingHeroSection from '../components/LandingHeroSection';
import { LANDING_ASSETS } from '../constants/landingAssets';
import { LANDING_THEME } from '../constants/landingTheme';
import { ROUTES } from '../constants/routes';
import { trackLandingCtaClick, trackLandingPageView } from '../services/landingTelemetryService';

function HomePage() {
  const location = useLocation();
  const hasTrackedViewRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedViewRef.current) {
      trackLandingPageView(location.pathname);
      hasTrackedViewRef.current = true;
    }
  }, [location.pathname]);

  function handleCtaActivate(ctaId) {
    trackLandingCtaClick({
      pageRoute: location.pathname,
      ctaId
    });
  }

  const ctas = [
    {
      id: 'browse_leagues',
      label: 'Browse Leagues',
      destinationRoute: ROUTES.leagues,
      styleVariant: 'secondary',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1a5.002 5.002 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
      )
    },
    {
      id: 'how_to_play',
      label: 'How to Play',
      destinationRoute: ROUTES.howToPlay,
      styleVariant: 'secondary',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      )
    }
  ];

  return (
    <LandingHeroSection
      headline={LANDING_THEME.headline}
      subheadline={LANDING_THEME.subheadline}
      ctas={ctas}
      assets={LANDING_ASSETS}
      onCtaActivate={handleCtaActivate}
    />
  );
}

export default HomePage;
