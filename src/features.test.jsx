import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

const FUTURE = { v7_startTransition: true, v7_relativeSplatPath: true };

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]} future={FUTURE}>
      <App />
    </MemoryRouter>
  );

async function fillBookingForm(user, overrides = {}) {
  const v = {
    name: 'Asha Rao',
    email: 'asha@example.com',
    eventDate: '2030-01-01',
    guestCount: '40',
    celebrationType: 'Milestone 50th Birthday',
    ...overrides,
  };
  if (v.name) await user.type(screen.getByLabelText(/your name/i), v.name);
  if (v.email) await user.type(screen.getByLabelText(/email address/i), v.email);
  if (v.eventDate) fireEvent.change(screen.getByLabelText(/event date/i), { target: { value: v.eventDate } });
  if (v.guestCount) await user.type(screen.getByLabelText(/number of guests/i), v.guestCount);
  if (v.celebrationType) await user.selectOptions(screen.getByLabelText(/celebration type/i), v.celebrationType);
}

async function submitBooking(user) {
  await user.click(screen.getByRole('button', { name: /submit booking/i }));
}

async function fillCreateForm(user, overrides = {}) {
  const v = {
    name: 'Mehndi Night',
    category: 'Marriage',
    basePrice: '50000',
    description: 'A colourful mehndi evening with music.',
    packagesText: 'Decor & lights',
    ...overrides,
  };
  if (v.name) await user.type(screen.getByLabelText(/event name/i), v.name);
  if (v.category) await user.selectOptions(screen.getByLabelText('Category *'), v.category);
  if (v.basePrice) await user.type(screen.getByLabelText(/base price/i), v.basePrice);
  if (v.description) await user.type(screen.getByLabelText(/^description/i), v.description);
  if (v.packagesText) await user.type(screen.getByLabelText(/packages/i), v.packagesText);
}

async function submitCreate(user) {
  await user.click(screen.getByRole('button', { name: /add celebration/i }));
}

describe('Navigation', () => {
  it('navbar links move between pages', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: 'Events' }));
    expect(await screen.findByRole('heading', { name: 'Event Catalog' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Book' }));
    expect(await screen.findByRole('heading', { name: 'Book a Celebration' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Create' }));
    expect(await screen.findByRole('heading', { name: 'Create a Celebration Package' })).toBeInTheDocument();
  });

  it('brand logo returns to the home page', async () => {
    const user = userEvent.setup();
    renderAt('/events');

    await user.click(screen.getByRole('link', { name: /celebrationcraft/i }));
    expect(await screen.findByRole('heading', { name: 'Welcome to CelebrationCraft' })).toBeInTheDocument();
  });

  it('shows the 404 page for unknown URLs and links back home', async () => {
    const user = userEvent.setup();
    renderAt('/does-not-exist');

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Back to home' }));
    expect(await screen.findByRole('heading', { name: 'Welcome to CelebrationCraft' })).toBeInTheDocument();
  });

  it('mobile menu button toggles the navigation and closes after choosing a link', async () => {
    const user = userEvent.setup();
    renderAt('/');

    const toggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'Events' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Home page', () => {
  it('hero buttons go to the catalogue and booking page', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: 'Browse events' }));
    expect(await screen.findByRole('heading', { name: 'Event Catalog' })).toBeInTheDocument();
  });

  it('a category card opens the catalogue already filtered to that category', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('link', { name: /haldi/i }));

    expect(await screen.findByRole('heading', { name: 'Traditional Haldi Ceremony' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Classic Birthday Party' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toHaveValue('Haldi');
  });
});

describe('Event catalogue', () => {
  it('search matches the category name, not just the event name', async () => {
    const user = userEvent.setup();
    renderAt('/events');

    await user.type(screen.getByRole('searchbox'), 'marriage');

    expect(screen.getByRole('heading', { name: 'Grand Marriage Celebration' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Baby Shower Bliss' })).not.toBeInTheDocument();
  });

  it('search is case-insensitive', async () => {
    const user = userEvent.setup();
    renderAt('/events');

    await user.type(screen.getByRole('searchbox'), 'HALDI');

    expect(screen.getByRole('heading', { name: 'Traditional Haldi Ceremony' })).toBeInTheDocument();
  });

  it('shows the empty state when nothing matches, and "Clear filters" resets the page', async () => {
    const user = userEvent.setup();
    renderAt('/events');

    await user.type(screen.getByRole('searchbox'), 'zzz');
    expect(screen.getByText('No celebrations match your search.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByRole('heading', { name: 'Classic Birthday Party' })).toBeInTheDocument();
  });

  it('category dropdown filters the list and updates the count', async () => {
    const user = userEvent.setup();
    renderAt('/events');

    await user.selectOptions(screen.getByLabelText('Category'), 'Birthday');

    expect(screen.getByText('2 celebrations found')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Classic Birthday Party' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Baby Shower Bliss' })).not.toBeInTheDocument();
  });

  it('reads the category from the URL and pre-selects it', () => {
    renderAt('/events?category=Birthday');

    expect(screen.getByLabelText('Category')).toHaveValue('Birthday');
    expect(screen.getByText('2 celebrations found')).toBeInTheDocument();
  });

  it('falls back to "All categories" for an unknown category in the URL', () => {
    renderAt('/events?category=Invalid');

    expect(screen.getByLabelText('Category')).toHaveValue('All');
    expect(screen.getByRole('heading', { name: 'Baby Shower Bliss' })).toBeInTheDocument();
  });

  it('uses the singular "celebration" when exactly one result matches', () => {
    renderAt('/events?category=Haldi');

    expect(screen.getByText('1 celebration found')).toBeInTheDocument();
  });

  it('each card shows its package count and the price in Indian format', () => {
    renderAt('/events?category=Marriage');

    expect(screen.getByText('View packages (3)')).toBeInTheDocument();
    expect(screen.getByText('₹2,50,000')).toBeInTheDocument();
  });

  it('"Book Now" opens the booking form with that celebration pre-selected', async () => {
    const user = userEvent.setup();
    renderAt('/events?category=Haldi');

    await user.click(screen.getByRole('link', { name: 'Book Now' }));

    expect(await screen.findByRole('heading', { name: 'Book a Celebration' })).toBeInTheDocument();
    expect(screen.getByLabelText(/celebration type/i)).toHaveValue('Traditional Haldi Ceremony');
  });
});

describe('Booking form', () => {
  it('pre-selects a celebration passed in the URL', () => {
    renderAt('/book?type=Baby%20Shower%20Bliss');

    expect(screen.getByLabelText(/celebration type/i)).toHaveValue('Baby Shower Bliss');
  });

  it('rejects a name containing numbers', async () => {
    const user = userEvent.setup();
    renderAt('/book');

    await fillBookingForm(user, { name: 'Asha123' });
    await submitBooking(user);

    expect(screen.getByText(/name can only contain letters/i)).toBeInTheDocument();
  });

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup();
    renderAt('/book');

    await fillBookingForm(user, { email: 'abc@' });
    await submitBooking(user);

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });

  it('rejects a past event date', async () => {
    const user = userEvent.setup();
    renderAt('/book');

    await fillBookingForm(user, { eventDate: '2020-01-01' });
    await submitBooking(user);

    expect(screen.getByText('Event date cannot be in the past.')).toBeInTheDocument();
  });

  it('rejects a guest count above 1000', async () => {
    const user = userEvent.setup();
    renderAt('/book');

    await fillBookingForm(user, { guestCount: '1001' });
    await submitBooking(user);

    expect(screen.getByText(/between 1 and 1000/i)).toBeInTheDocument();
  });

  it('clears a field error as soon as the user edits that field', async () => {
    const user = userEvent.setup();
    renderAt('/book');

    await submitBooking(user);
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/your name/i), 'A');
    expect(screen.queryByText('Please enter your name.')).not.toBeInTheDocument();
  });

  it('shows the submitted details, and "Make another booking" returns to an empty form', async () => {
    const user = userEvent.setup();
    renderAt('/book');

    await fillBookingForm(user);
    await submitBooking(user);

    const status = await screen.findByRole('status');
    expect(status).toHaveTextContent('Asha Rao');
    expect(status).toHaveTextContent('Milestone 50th Birthday');
    expect(status).toHaveTextContent('asha@example.com');

    await user.click(screen.getByRole('button', { name: 'Make another booking' }));
    expect(screen.getByLabelText(/your name/i)).toHaveValue('');
  });

  it('a celebration added on the Create page appears in the booking dropdown', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user, { name: 'Sangeet Night' });
    await submitCreate(user);

    await user.click(screen.getByRole('link', { name: 'Book' }));
    const select = await screen.findByLabelText(/celebration type/i);
    expect(within(select).getByRole('option', { name: 'Sangeet Night' })).toBeInTheDocument();
  });
});

describe('Create celebration form', () => {
  it('live preview shows the name as it is typed', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    expect(screen.getByRole('heading', { name: 'Your new celebration' })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/event name/i), 'Sangeet Night');
    expect(screen.getByRole('heading', { name: 'Sangeet Night' })).toBeInTheDocument();
  });

  it('shows a character counter for the description', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await user.type(screen.getByLabelText(/^description/i), 'Hello');
    expect(screen.getByText('5/300')).toBeInTheDocument();
  });

  it('rejects a name shorter than 3 characters', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user, { name: 'AB' });
    await submitCreate(user);

    expect(screen.getByText('Name must be 3–60 characters.')).toBeInTheDocument();
  });

  it('rejects a duplicate name regardless of letter case', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user, { name: 'classic birthday party', category: 'Birthday' });
    await submitCreate(user);

    expect(screen.getByText('A celebration with this name already exists.')).toBeInTheDocument();
  });

  it('requires a category', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user, { category: '' });
    await submitCreate(user);

    expect(screen.getByText('Please choose a category.')).toBeInTheDocument();
  });

  it('rejects a base price of zero', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user, { basePrice: '0' });
    await submitCreate(user);

    expect(screen.getByText(/base price must be between/i)).toBeInTheDocument();
  });

  it('rejects a description shorter than 10 characters', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user, { description: 'Too short' });
    await submitCreate(user);

    expect(screen.getByText('Description needs at least 10 characters.')).toBeInTheDocument();
  });

  it('requires at least one package', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user, { packagesText: '' });
    await submitCreate(user);

    expect(screen.getByText('Add at least one package (one per line).')).toBeInTheDocument();
  });

  it('rejects more than 10 packages', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    const elevenPackages = Array.from({ length: 11 }, (_, i) => `Package ${i + 1}`).join('{enter}');
    await fillCreateForm(user, { packagesText: elevenPackages });
    await submitCreate(user);

    expect(screen.getByText('You can add up to 10 packages.')).toBeInTheDocument();
  });

  it('after a successful add, the form resets and the confirmation hides once the user types again', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user);
    await submitCreate(user);

    expect(await screen.findByRole('status')).toHaveTextContent('Mehndi Night');
    expect(screen.getByLabelText(/event name/i)).toHaveValue('');

    await user.type(screen.getByLabelText(/event name/i), 'X');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('a new celebration updates the category count on the Home page', async () => {
    const user = userEvent.setup();
    renderAt('/create');

    await fillCreateForm(user); // Marriage category; seed data has one Marriage event
    await submitCreate(user);

    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(await screen.findByRole('link', { name: /marriage/i })).toHaveTextContent('2 celebrations available');
  });
});
