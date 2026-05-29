import React from 'react';
import { render, screen } from '@testing-library/react';
import HowToPlayPage from '../pages/HowToPlayPage';
import * as howToPlayService from '../services/howToPlayService';

describe('HowToPlayPage', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders ordered instructional sections', async () => {
    jest.spyOn(howToPlayService, 'getHowToPlaySections').mockResolvedValue({
      data: [
        { id: '2', title: 'Draft', body: 'Draft your team', sequence: 2 },
        { id: '1', title: 'Prepare', body: 'Learn settings', sequence: 1 }
      ]
    });

    render(<HowToPlayPage />);

    expect(await screen.findByText('Prepare')).toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('Prepare');
    expect(headings[1]).toHaveTextContent('Draft');
  });
});
