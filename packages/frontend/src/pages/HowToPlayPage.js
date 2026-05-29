import React, { useEffect, useState } from 'react';
import { getHowToPlaySections } from '../services/howToPlayService';

function HowToPlayPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getHowToPlaySections()
      .then((response) => {
        const ordered = [...(response?.data || [])].sort((a, b) => a.sequence - b.sequence);
        setSections(ordered);
      })
      .catch(() => {
        setError('How to Play content is unavailable right now.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <section className="page-card">Loading guide...</section>;
  }

  if (error) {
    return <section className="page-card">{error}</section>;
  }

  return (
    <section className="page-card">
      <h1>How to Play</h1>
      <ol className="how-to-list">
        {sections.map((section) => (
          <li key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default HowToPlayPage;
