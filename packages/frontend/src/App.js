import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [healthState, setHealthState] = useState({
    loading: true,
    status: 'checking',
    message: 'Checking backend connection...'
  });

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error(`Unexpected status: ${response.status}`);
        }

        const payload = await response.json();
        setHealthState({
          loading: false,
          status: payload.status,
          message: `Backend healthy at ${new Date(payload.timestamp).toLocaleTimeString()}`
        });
      } catch (error) {
        setHealthState({
          loading: false,
          status: 'error',
          message: 'Could not reach backend. Start the API and refresh.'
        });
      }
    };

    checkBackendHealth();
  }, []);

  return (
    <div className="app">
      <main className="app-main">
        <section className="hero">
          <h1>Capstone Starter Workspace</h1>
          <p>
            This frontend and backend are now a clean baseline. Define your product in docs,
            then implement features from your SpecKit workflow.
          </p>
        </section>

        <section className="status-card" aria-live="polite">
          <h2>Backend Status</h2>
          <p className="status-label">State: {healthState.loading ? 'checking' : healthState.status}</p>
          <p>{healthState.message}</p>
        </section>

        <section className="next-steps">
          <h2>Suggested Next Steps</h2>
          <ol>
            <li>Finalize project overview and requirements in docs.</li>
            <li>Define initial API routes from user workflows.</li>
            <li>Implement one vertical slice end-to-end.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}

export default App;