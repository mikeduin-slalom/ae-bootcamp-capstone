import React from 'react';
import { Link } from 'react-router-dom';

function PrimaryCtaButton({ ctaId, label, to, variant = 'primary', icon, onActivate }) {
  function handleActivate() {
    if (onActivate) {
      onActivate(ctaId);
    }
  }

  return (
    <Link
      className={`primary-cta primary-cta-${variant}`}
      data-cta-id={ctaId}
      data-cta-variant={variant}
      to={to}
      onClick={handleActivate}
    >
      {icon}
      {label}
    </Link>
  );
}

export default PrimaryCtaButton;
