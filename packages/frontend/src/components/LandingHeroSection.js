import React from 'react';
import PrimaryCtaGroup from './PrimaryCtaGroup';
import ThemedVisualAsset from './ThemedVisualAsset';

function LandingHeroSection({ badgeLabel, headline, subheadline, ctas, onCtaActivate, assets = [] }) {
  return (
    <section className="page-card landing-hero" aria-labelledby="landing-hero-title">
      <div className="landing-hero-content">
        <span className="landing-badge">{badgeLabel}</span>
        <h1 id="landing-hero-title" className="landing-headline">
          {headline}
        </h1>
        <p className="landing-subheadline">{subheadline}</p>
        <PrimaryCtaGroup ctas={ctas} layoutMode="responsive" onCtaActivate={onCtaActivate} />
      </div>
      <div className="themed-asset-wrap">
        {assets
          .filter((asset) => asset.placementArea === 'hero')
          .map((asset) => (
            <ThemedVisualAsset key={asset.id} asset={asset} />
          ))}
      </div>
    </section>
  );
}

export default LandingHeroSection;
