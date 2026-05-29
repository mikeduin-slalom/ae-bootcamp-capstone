import React, { useState } from 'react';

function PrivateLeagueActions({ leagueId, isAuthenticated, onAcceptInvitation, onRequestJoin }) {
  const [inviteToken, setInviteToken] = useState('');
  const inputId = `invite-token-${leagueId}`;

  return (
    <div className="private-actions">
      <div className="private-actions-card">
        <label htmlFor={inputId}>Invitation Token</label>
        <input
          id={inputId}
          type="text"
          value={inviteToken}
          onChange={(event) => setInviteToken(event.target.value)}
          placeholder="Paste invitation token"
          disabled={!isAuthenticated}
        />
        <button
          type="button"
          onClick={() => onAcceptInvitation(inviteToken)}
          disabled={!isAuthenticated || !inviteToken.trim()}
        >
          Accept Invitation
        </button>
      </div>

      <div className="private-actions-card">
        <p>Request to join a private league if you do not have an invitation.</p>
        <button type="button" onClick={onRequestJoin} disabled={!isAuthenticated}>
          Request to Join
        </button>
      </div>
    </div>
  );
}

export default PrivateLeagueActions;
