import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeedbackBanner from '../components/FeedbackBanner';
import LeaguesTable from '../components/LeaguesTable';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../context/AuthContext';
import {
  acceptInvitation,
  joinLeague,
  listLeagues,
  listMyLeagues,
  requestToJoin
} from '../services/leaguesService';

function LeaguesPage() {
  const { isAuthenticated } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [joinedLeagueIds, setJoinedLeagueIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: 'info', message: '' });

  const fetchLeagues = async () => {
    if (isAuthenticated) {
      const [leaguesResult, myLeaguesResult] = await Promise.allSettled([
        listLeagues(),
        listMyLeagues()
      ]);

      if (leaguesResult.status === 'fulfilled') {
        setLeagues(leaguesResult.value?.data || []);
      } else {
        throw leaguesResult.reason;
      }

      if (myLeaguesResult.status === 'fulfilled') {
        setJoinedLeagueIds(new Set(myLeaguesResult.value?.data || []));
      }
      // if listMyLeagues rejects, gracefully default to empty set (already initialized)
    } else {
      const response = await listLeagues();
      setLeagues(response?.data || []);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <LeaguesTable
        leagues={leagues}
        joinedLeagueIds={joinedLeagueIds}
        onJoin={handleJoin}
        onRequestJoin={handleRequestJoin}
        onAcceptInvitation={handleAcceptInvitation}
      />
    </section>
  );
}

export default LeaguesPage;

