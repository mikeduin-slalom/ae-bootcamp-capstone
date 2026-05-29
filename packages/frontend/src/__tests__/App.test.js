import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders capstone starter heading', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok', timestamp: new Date().toISOString() })
    });

    render(<App />);

    expect(screen.getByText('Capstone Starter Workspace')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Backend healthy at/i)).toBeInTheDocument();
    });
  });

  test('shows backend connection failure message on fetch error', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('State: error')).toBeInTheDocument();
      expect(screen.getByText('Could not reach backend. Start the API and refresh.')).toBeInTheDocument();
    });
  });
});
