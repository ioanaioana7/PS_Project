import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import Login from '../pages/Login';

test('renders Login heading', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  const headingElement = screen.getByText(/Login/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders Email and Password inputs', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});
