import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner';
import PrivateLeagueActions from '../components/PrivateLeagueActions';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import {
  acceptInvitation,
  joinLeague,
  listLeagues,
  requestToJoin
} from '../services/leaguesService';

function LeaguesPage() {
  const { isAuthenticated } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: 'info', message: '' });

  const fetchLeagues = async () => {
    const response = await listLeagues();
    setLeagues(response?.data || []);
  };

  useEffect(() => {
    fetchLeagues()
      .catch(() => {
        setFeedback({
          type: 'error',
          message: 'Could not load leagues right now. Try again shortly.'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const joinableLeagues = useMemo(
    () => leagues.filter((league) => league.accessType === 'joinable'),
    [leagues]
  );
  const privateLeagues = useMemo(
    () => leagues.filter((league) => league.accessType === 'private'),
    [leagues]
  );

  const handleJoin = async (leagueId) => {
    if (!isAuthenticated) {
      setFeedback({
        type: 'warning',
        message: 'Please sign in to join leagues.'
      });
      return;
    }

    try {
      await joinLeague(leagueId);
      setFeedback({ type: 'success', message: 'League joined successfully.' });
      await fetchLeagues();
    } catch (error) {
      const message = error?.response?.data?.error?.message || 'Unable to join this league.';
      setFeedback({ type: 'error', message });
    }
  };

  const handleAcceptInvitation = async (invitationToken) => {
    if (!isAuthenticated) {
      setFeedback({
        type: 'warning',
        message: 'Please sign in to accept invitations.'
      });
      return;
    }

    try {
      await acceptInvitation(invitationToken);
      setFeedback({ type: 'success', message: 'Invitation accepted.' });
      await fetchLeagues();
    } catch (error) {
      const message = error?.response?.data?.error?.message || 'Invitation could not be accepted.';
      setFeedback({ type: 'error', message });
    }
  };

  const handleRequestJoin = async (leagueId) => {
    if (!isAuthenticated) {
      setFeedback({
        type: 'warning',
        message: 'Please sign in to submit a join request.'
      });
      return;
    }

    try {
      await requestToJoin(leagueId);
      setFeedback({ type: 'success', message: 'Join request submitted and pending review.' });
    } catch (error) {
      const message = error?.response?.data?.error?.message || 'Join request failed.';
      setFeedback({ type: 'error', message });
    }
  };

  if (loading) {
    return <section className="page-card">Loading leagues...</section>;
  }

  return (
    <section className="page-card">
      <h1>Leagues</h1>
      <p>
        Guests can browse leagues. Sign in to join open leagues or access private leagues through
        invitation and requests.
      </p>
      {!isAuthenticated && (
        <p>
          You are currently browsing as a guest. <Link to={ROUTES.login}>Sign in to join leagues.</Link>
        </p>
      )}
      <FeedbackBanner type={feedback.type} message={feedback.message} />

      <h2>Joinable Leagues</h2>
      <ul className="league-list">
        {joinableLeagues.map((league) => (
          <li key={league.id} className="league-card">
            <h3>{league.name}</h3>
            <p>
              Status: {league.status} | Members: {league.memberCount}/{league.maxEntrants}
            </p>
            <button type="button" onClick={() => handleJoin(league.id)}>
              Join League
            </button>
          </li>
        ))}
      </ul>

      <h2>Private Leagues</h2>
      <ul className="league-list">
        {privateLeagues.map((league) => (
          <li key={league.id} className="league-card">
            <h3>{league.name}</h3>
            <p>
              Status: {league.status} | Members: {league.memberCount}/{league.maxEntrants}
            </p>
            <PrivateLeagueActions
              leagueId={league.id}
              isAuthenticated={isAuthenticated}
              onAcceptInvitation={handleAcceptInvitation}
              onRequestJoin={() => handleRequestJoin(league.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default LeaguesPage;
