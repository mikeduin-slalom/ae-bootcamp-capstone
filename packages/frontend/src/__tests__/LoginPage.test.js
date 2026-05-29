import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin
  })
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogin.mockReset();
  });

  it('shows validation error when fields are blank', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email and password are required/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('navigates to leagues after successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'alex@example.com', password: 'password123' });
      expect(mockNavigate).toHaveBeenCalledWith('/leagues');
    });
  });

  it('shows API error on failed login', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { error: { message: 'Invalid credentials.' } } }
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alex@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'bad-pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
