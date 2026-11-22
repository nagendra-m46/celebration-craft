import { useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard.jsx';
import FormField, { fieldProps } from '../components/FormField.jsx';
import { CATEGORIES } from '../data/constants.js';
import { useEvents } from '../context/EventsContext.jsx';
import { parsePackages, validateNewEvent } from '../utils/validation.js';

const emptyForm = {
  name: '',
  category: '',
  basePrice: '',
  description: '',
  packagesText: '',
  themeColor: '#db2777',
};

export default function CreateEvent() {
  const { events, addEvent } = useEvents();
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [createdName, setCreatedName] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setCreatedName(null);
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validateNewEvent(values, events.map((ev) => ev.name));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const newEvent = {
      name: values.name.trim(),
      category: values.category,
      basePrice: Number(values.basePrice),
      description: values.description.trim(),
      packages: parsePackages(values.packagesText),
      themeColor: values.themeColor,
    };

    addEvent(newEvent); // Updates the shared state, so the catalog reflects it immediately.
    setCreatedName(newEvent.name);
    setValues(emptyForm);
  };

  // Live preview built from whatever has been typed so far.
  const packages = parsePackages(values.packagesText);
  const preview = {
    id: 'preview',
    name: values.name.trim() || 'Your new celebration',
    category: values.category || 'Birthday',
    basePrice: Number(values.basePrice) || 0,
    description: values.description.trim() || 'Your description will appear here.',
    packages: packages.length ? packages : ['Your packages will appear here'],
    themeColor: values.themeColor,
  };

  return (
    <div className="split">
      <section>
        <h1>Create a Celebration Package</h1>
        <p className="lead">
          Add a custom theme to the catalogue. It appears instantly for everyone using this session.
          You currently have {events.length} celebrations.
        </p>

        {createdName && (
          <div className="notice success" role="status">
            ✅ <strong>{createdName}</strong> was added.{' '}
            <Link to="/events">View it in the catalog</Link>
          </div>
        )}

        <form className="card form" onSubmit={handleSubmit} noValidate>
          <FormField id="name" label="Event name *" error={errors.name}>
            <input
              {...fieldProps('name', errors.name)}
              type="text"
              placeholder="e.g. Mehndi Night"
              value={values.name}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="category" label="Category *" error={errors.category}>
            <select
              {...fieldProps('category', errors.category)}
              value={values.category}
              onChange={handleChange}
            >
              <option value="">Choose a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="basePrice" label="Base price (₹) *" error={errors.basePrice}>
            <input
              {...fieldProps('basePrice', errors.basePrice)}
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              placeholder="e.g. 50000"
              value={values.basePrice}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="description" label="Description *" error={errors.description}>
            <textarea
              {...fieldProps('description', errors.description)}
              maxLength={300}
              value={values.description}
              onChange={handleChange}
            />
            <span className="char-count">{values.description.length}/300</span>
          </FormField>

          <FormField id="packagesText" label="Packages (one per line) *" error={errors.packagesText}>
            <textarea
              {...fieldProps('packagesText', errors.packagesText)}
              placeholder={'Decor & lights\nCatering\nPhotography'}
              value={values.packagesText}
              onChange={handleChange}
            />
          </FormField>

          <FormField id="themeColor" label="Theme colour *" error={errors.themeColor}>
            <input
              {...fieldProps('themeColor', errors.themeColor)}
              type="color"
              className="color-input"
              value={values.themeColor}
              onChange={handleChange}
            />
          </FormField>

          <button type="submit" className="btn btn-primary">
            Add celebration
          </button>
        </form>
      </section>

      <aside aria-label="Live preview">
        <h2>Live preview</h2>
        <EventCard event={preview} />
      </aside>
    </div>
  );
}
