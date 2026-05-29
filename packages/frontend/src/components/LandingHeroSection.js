import React from 'react';
import PrimaryCtaGroup from './PrimaryCtaGroup';

function LandingHeroSection({ headline, subheadline, ctas, onCtaActivate }) {
  return (
    <section className="page-card landing-hero" aria-labelledby="landing-hero-title">
      <div className="landing-hero-content">
        <h1 id="landing-hero-title" className="landing-headline">
          {headline}
        </h1>
        <p className="landing-subheadline">{subheadline}</p>
        <PrimaryCtaGroup ctas={ctas} layoutMode="responsive" onCtaActivate={onCtaActivate} />
      </div>
    </section>
  );
}

export default LandingHeroSection;
