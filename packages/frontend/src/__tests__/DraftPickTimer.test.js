import React from 'react';
import { render, screen } from '@testing-library/react';
import DraftPickTimer from '../components/DraftPickTimer';

describe('DraftPickTimer', () => {
  it('renders "5:00" for 300 seconds (initial value)', () => {
    render(<DraftPickTimer secondsLeft={300} currentPickIndex={0} />);
    expect(screen.getByText('5:00')).toBeInTheDocument();
  });

  it('renders "4:59" for 299 seconds', () => {
    render(<DraftPickTimer secondsLeft={299} currentPickIndex={0} />);
    expect(screen.getByText('4:59')).toBeInTheDocument();
  });

  it('renders "1:00" for 60 seconds', () => {
    render(<DraftPickTimer secondsLeft={60} currentPickIndex={0} />);
    expect(screen.getByText('1:00')).toBeInTheDocument();
  });

  it('renders "0:01" for 1 second', () => {
    render(<DraftPickTimer secondsLeft={1} currentPickIndex={0} />);
    expect(screen.getByText('0:01')).toBeInTheDocument();
  });

  it('renders "0:00" for 0 seconds', () => {
    render(<DraftPickTimer secondsLeft={0} currentPickIndex={0} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('pads seconds with a leading zero when seconds < 10', () => {
    render(<DraftPickTimer secondsLeft={65} currentPickIndex={0} />);
    expect(screen.getByText('1:05')).toBeInTheDocument();
  });

  it('displays "Pick 1" for currentPickIndex 0', () => {
    render(<DraftPickTimer secondsLeft={300} currentPickIndex={0} />);
    expect(screen.getByText(/pick 1/i)).toBeInTheDocument();
  });

  it('displays "Pick 5" for currentPickIndex 4', () => {
    render(<DraftPickTimer secondsLeft={300} currentPickIndex={4} />);
    expect(screen.getByText(/pick 5/i)).toBeInTheDocument();
  });
});
