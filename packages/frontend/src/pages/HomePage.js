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
      styleVariant: 'secondary'
    },
    {
      id: 'how_to_play',
      label: 'How to Play',
      destinationRoute: ROUTES.howToPlay,
      styleVariant: 'secondary'
    }
  ];

  return (
    <LandingHeroSection
      badgeLabel={LANDING_THEME.badgeLabel}
      headline={LANDING_THEME.headline}
      subheadline={LANDING_THEME.subheadline}
      ctas={ctas}
      assets={LANDING_ASSETS}
      onCtaActivate={handleCtaActivate}
    />
  );
}

export default HomePage;
