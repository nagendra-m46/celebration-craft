import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  );

describe('CelebrationCraft', () => {
  it('shows the four category cards on the home page', () => {
    renderAt('/');
    for (const category of ['Birthday', 'Haldi', 'Marriage', 'Baby Shower']) {
      expect(screen.getByRole('heading', { name: category })).toBeInTheDocument();
    }
  });

  it('filters the catalogue by search text', async () => {
    const user = userEvent.setup();
    renderAt('/events');

    await user.type(screen.getByRole('searchbox'), 'haldi');

    expect(screen.getByRole('heading', { name: 'Traditional Haldi Ceremony' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Classic Birthday Party' })).not.toBeInTheDocument();
  });

  it('blocks an incomplete booking, then accepts a complete one', async () => {
    const user = userEvent.setup();
    renderAt('/book');

    await user.click(screen.getByRole('button', { name: /submit booking/i }));
    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText(/your name/i), 'Asha Rao');
    await user.type(screen.getByLabelText(/email address/i), 'asha@example.com');
    fireEvent.change(screen.getByLabelText(/event date/i), { target: { value: '2030-01-01' } });
    await user.type(screen.getByLabelText(/number of guests/i), '40');
    await user.selectOptions(screen.getByLabelText(/celebration type/i), 'Milestone 50th Birthday');
    await user.click(screen.getByRole('button', { name: /submit booking/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/booking request submitted/i);
  });

  it('adds a custom celebration and shows it in the catalogue', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await user.type(screen.getByLabelText(/event name/i), 'Mehndi Night');
    await user.selectOptions(screen.getByLabelText('Category *'), 'Marriage');
    await user.type(screen.getByLabelText(/base price/i), '50000');
    await user.type(screen.getByLabelText(/description/i), 'A colourful mehndi evening with music.');
    await user.type(screen.getByLabelText(/packages/i), 'Decor & lights');
    await user.click(screen.getByRole('button', { name: /add celebration/i }));

    await user.click(await screen.findByRole('link', { name: /view it in the catalog/i }));
    expect(await screen.findByRole('heading', { name: 'Mehndi Night' })).toBeInTheDocument();
  });
});
