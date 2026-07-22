//import React from 'react';
import { test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

test('renders learn react link', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
      <App />
      </AuthProvider>
    </MemoryRouter>
  );
  screen.debug();
});