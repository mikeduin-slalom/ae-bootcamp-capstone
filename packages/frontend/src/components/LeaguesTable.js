import React, { useState } from 'react';
import { LEAGUE_MOCK_METADATA } from '../constants/leaguesMockData';

function formatDraftStart(leagueId) {
  const meta = LEAGUE_MOCK_METADATA[leagueId];
  if (!meta) return '—';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(meta.draftStartTime));
  } catch {
    return '—';
  }
}

function BadgeCell({ accessType }) {
  if (accessType === 'joinable') {
    return (
      <span className="badge--public" aria-label="Public league">
        Public
      </span>
    );
  }
  if (accessType === 'private') {
    return (
      <span className="badge--private" aria-label="Private league">
        Private
      </span>
    );
  }
  return (
    <span className="badge--unknown" aria-label="Unknown league type">
      Unknown
    </span>
  );
}

function InviteToggle({ leagueId, onAcceptInvitation }) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');

  if (!open) {
    return (
      <button type="button" className="btn-link" onClick={() => setOpen(true)}>
        Have an invite? Enter code
      </button>
    );
  }

  return (
    <div className="invite-inline">
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        aria-label="Invitation token"
        placeholder="Paste invite code"
      />
      <button
        type="button"
        disabled={token.trim() === ''}
        onClick={() => onAcceptInvitation(token.trim())}
      >
        Accept Invitation
      </button>
    </div>
  );
}

function ActionCell({ league, joinedLeagueIds, onJoin, onRequestJoin, onAcceptInvitation }) {
  const isJoined = joinedLeagueIds.has(league.id);

  if (isJoined) {
    return <span>Joined</span>;
  }

  if (league.accessType === 'joinable') {
    return (
      <button
        type="button"
        onClick={() => onJoin(league.id)}
      >
        Sign Up
      </button>
    );
  }

  if (league.accessType === 'private') {
    return (
      <div>
        <button type="button" onClick={() => onRequestJoin(league.id)}>
          Request to Join
        </button>
        <InviteToggle leagueId={league.id} onAcceptInvitation={onAcceptInvitation} />
      </div>
    );
  }

  return null;
}

function LeaguesTable({ leagues, joinedLeagueIds, onJoin, onRequestJoin, onAcceptInvitation }) {
  return (
    <div className="leagues-table-container">
      <table className="leagues-table">
        <thead>
          <tr>
            <th scope="col">League Name</th>
            <th scope="col">Type</th>
            <th scope="col">Commissioner</th>
            <th scope="col">Draft Start</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {leagues.length === 0 ? (
            <tr>
              <td colSpan={5}>No leagues available.</td>
            </tr>
          ) : (
            leagues.map((league) => {
              const meta = LEAGUE_MOCK_METADATA[league.id];
              const commissioner = meta ? meta.commissioner : '—';
              const draftStart = formatDraftStart(league.id);

              return (
                <tr key={league.id}>
                  <td>{league.name}</td>
                  <td>
                    <BadgeCell accessType={league.accessType} />
                  </td>
                  <td>{commissioner}</td>
                  <td>{draftStart}</td>
                  <td>
                    <ActionCell
                      league={league}
                      joinedLeagueIds={joinedLeagueIds}
                      onJoin={onJoin}
                      onRequestJoin={onRequestJoin}
                      onAcceptInvitation={onAcceptInvitation}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LeaguesTable;
