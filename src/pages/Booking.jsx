import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FormField, { fieldProps } from '../components/FormField.jsx';
import { useEvents } from '../context/EventsContext.jsx';
import { toISODate, validateBooking } from '../utils/validation.js';

const emptyForm = (celebrationType = '') => ({
  name: '',
  email: '',
  eventDate: '',
  guestCount: '',
  celebrationType,
});

export default function Booking() {
  const { events, addBooking } = useEvents();
  const [searchParams] = useSearchParams();

  // "Book Now" on an event card links here with ?type=<event name>, so pre-select it.
  const presetType = searchParams.get('type') ?? '';

  const [values, setValues] = useState(() => emptyForm(presetType));
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);

  const eventNames = events.map((e) => e.name);
  const today = toISODate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as soon as the user edits it.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validateBooking(values, { eventNames, today: toISODate() });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const booking = {
      name: values.name.trim(),
      email: values.email.trim(),
      eventDate: values.eventDate,
      guestCount: Number(values.guestCount),
      celebrationType: values.celebrationType,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    setConfirmation(booking);
    setValues(emptyForm());
  };

  if (confirmation) {
    return (
      <section className="card success" role="status">
        <h1>🎉 Booking request submitted!</h1>
        <p>
          Thank you, <strong>{confirmation.name}</strong>. We've received your request for{' '}
          <strong>{confirmation.celebrationType}</strong> on <strong>{confirmation.eventDate}</strong>{' '}
          for {confirmation.guestCount} guest{confirmation.guestCount === 1 ? '' : 's'}. We'll reach
          you at {confirmation.email}.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setConfirmation(null)}>
          Make another booking
        </button>
      </section>
    );
  }

  return (
    <section>
      <h1>Book a Celebration</h1>
      <p className="lead">Tell us about your event and we'll get back to you. Fields marked * are required.</p>

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <FormField id="name" label="Your name *" error={errors.name}>
          <input
            {...fieldProps('name', errors.name)}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={handleChange}
          />
        </FormField>

        <FormField id="email" label="Email address *" error={errors.email}>
          <input
            {...fieldProps('email', errors.email)}
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
          />
        </FormField>

        <FormField id="eventDate" label="Event date *" error={errors.eventDate}>
          <input
            {...fieldProps('eventDate', errors.eventDate)}
            type="date"
            min={today}
            value={values.eventDate}
            onChange={handleChange}
          />
        </FormField>

        <FormField id="guestCount" label="Number of guests *" error={errors.guestCount}>
          <input
            {...fieldProps('guestCount', errors.guestCount)}
            type="number"
            inputMode="numeric"
            min="1"
            max="1000"
            step="1"
            value={values.guestCount}
            onChange={handleChange}
          />
        </FormField>

        <FormField id="celebrationType" label="Celebration type *" error={errors.celebrationType}>
          <select
            {...fieldProps('celebrationType', errors.celebrationType)}
            value={values.celebrationType}
            onChange={handleChange}
          >
            <option value="">Select a celebration…</option>
            {eventNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </FormField>

        <button type="submit" className="btn btn-primary">
          Submit booking request
        </button>
      </form>
    </section>
  );
}
