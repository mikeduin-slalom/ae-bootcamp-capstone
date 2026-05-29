import React from 'react';

function FeedbackBanner({ type = 'info', message }) {
  if (!message) {
    return null;
  }

  return (
    <div className={`feedback-banner feedback-${type}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}

export default FeedbackBanner;
