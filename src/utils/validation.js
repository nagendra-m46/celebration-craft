import { CATEGORIES } from '../data/constants.js';

const NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

/** Returns today's date as YYYY-MM-DD in the user's local time zone. */
export function toISODate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Turns a textarea (one package per line) into a clean array. */
export function parsePackages(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Validates the booking form. Returns an object of { fieldName: message }.
 * An empty object means the form is valid.
 */
export function validateBooking(values, { eventNames = [], today = toISODate() } = {}) {
  const errors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = 'Please enter your name.';
  } else if (name.length < 2 || name.length > 60) {
    errors.name = 'Name must be 2–60 characters.';
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = 'Name can only contain letters, spaces, apostrophes, periods and hyphens.';
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // YYYY-MM-DD strings compare correctly with < and >.
  if (!values.eventDate) {
    errors.eventDate = 'Please choose an event date.';
  } else if (values.eventDate < today) {
    errors.eventDate = 'Event date cannot be in the past.';
  }

  const guests = Number(values.guestCount);
  if (values.guestCount === '' || values.guestCount == null) {
    errors.guestCount = 'Please enter the number of guests.';
  } else if (!Number.isInteger(guests) || guests < 1 || guests > 1000) {
    errors.guestCount = 'Guest count must be a whole number between 1 and 1000.';
  }

  if (!values.celebrationType) {
    errors.celebrationType = 'Please select a celebration type.';
  } else if (!eventNames.includes(values.celebrationType)) {
    errors.celebrationType = 'Please select a celebration from the list.';
  }

  return errors;
}

/**
 * Validates the "create celebration" form. existingNames is used to block duplicates.
 */
export function validateNewEvent(values, existingNames = []) {
  const errors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = 'Please enter a celebration name.';
  } else if (name.length < 3 || name.length > 60) {
    errors.name = 'Name must be 3–60 characters.';
  } else if (existingNames.some((n) => n.toLowerCase() === name.toLowerCase())) {
    errors.name = 'A celebration with this name already exists.';
  }

  if (!CATEGORIES.includes(values.category)) {
    errors.category = 'Please choose a category.';
  }

  const price = Number(values.basePrice);
  if (values.basePrice === '' || values.basePrice == null) {
    errors.basePrice = 'Please enter a base price.';
  } else if (!Number.isFinite(price) || price <= 0 || price > 10000000) {
    errors.basePrice = 'Base price must be between ₹1 and ₹1,00,00,000.';
  }

  const description = values.description.trim();
  if (description.length < 10) {
    errors.description = 'Description needs at least 10 characters.';
  } else if (description.length > 300) {
    errors.description = 'Description must be 300 characters or fewer.';
  }

  const packages = parsePackages(values.packagesText);
  if (packages.length === 0) {
    errors.packagesText = 'Add at least one package (one per line).';
  } else if (packages.length > 10) {
    errors.packagesText = 'You can add up to 10 packages.';
  }

  if (!HEX_COLOR_PATTERN.test(values.themeColor)) {
    errors.themeColor = 'Please pick a valid theme colour.';
  }

  return errors;
}
