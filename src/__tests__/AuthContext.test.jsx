import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext.jsx';

jest.mock('../firebase/firebaseClient', () => {
  const listeners = { auth: [], token: [] };
  const user = { uid: 'u1', email: 'a@b.com', emailVerified: false, getIdToken: jest.fn().mockResolvedValue('token') };
  return {
    auth: {
      currentUser: null,
    },
    db: {},
    __esModule: true,
    default: {},
    // Expose helpers to trigger listeners in tests
    __setUser: (u) => { listeners.auth.forEach((cb) => cb(u)); listeners.token.forEach((cb) => cb(u)); },
  };
});

describe('AuthContext', () => {
  const Consumer = () => {
    const ctx = useAuth();
    return <div>{ctx.initializing ? 'loading' : ctx.user ? 'user' : 'anon'}</div>;
  };

  it('renders children and updates from loading to anon', async () => {
    render(<AuthProvider><Consumer /></AuthProvider>);
    expect(screen.getByText('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/anon|user/)).toBeInTheDocument());
  });
});


