import React from 'react';

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function DraftPickTimer({ secondsLeft, currentPickIndex }) {
  return (
    <div className="draft-pick-timer" aria-live="polite" aria-label="Pick timer">
      <span className="draft-pick-timer__label">
        Pick {currentPickIndex + 1}
      </span>
      <span className="draft-pick-timer__countdown">
        {formatTime(secondsLeft)}
      </span>
    </div>
  );
}

export default DraftPickTimer;
