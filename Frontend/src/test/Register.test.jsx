import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import Register from '../pages/Register';

test('renders Register heading', () => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  const headingElement = screen.getByRole('heading', { name: /Register/i });
  expect(headingElement).toBeInTheDocument();
});

test('renders Name, Email, Phone Number and Password inputs', () => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

  expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
});
