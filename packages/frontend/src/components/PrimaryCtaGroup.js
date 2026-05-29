import React from 'react';
import PrimaryCtaButton from './PrimaryCtaButton';

function PrimaryCtaGroup({ ctas, layoutMode = 'responsive', onCtaActivate }) {
  const normalizedLayout = ['horizontal', 'stacked', 'responsive'].includes(layoutMode)
    ? layoutMode
    : 'responsive';

  return (
    <div
      className={`primary-cta-group primary-cta-group-${normalizedLayout}`}
      role="group"
      aria-label="Primary actions"
    >
      {ctas.map((cta) => (
        <PrimaryCtaButton
          key={cta.id}
          ctaId={cta.id}
          label={cta.label}
          to={cta.destinationRoute}
          variant={cta.styleVariant || 'primary'}
          onActivate={onCtaActivate}
        />
      ))}
    </div>
  );
}

export default PrimaryCtaGroup;
