import { describe, expect, it } from 'vitest';
import { parsePackages, validateBooking, validateNewEvent } from './validation.js';

const TODAY = '2026-10-31';
const NAMES = ['Birthday Party'];

const validBooking = {
  name: 'Asha Rao',
  email: 'asha@example.com',
  eventDate: '2030-01-01',
  guestCount: '50',
  celebrationType: 'Birthday Party',
};

describe('validateBooking', () => {
  it('accepts a complete, valid booking', () => {
    expect(validateBooking(validBooking, { eventNames: NAMES, today: TODAY })).toEqual({});
  });

  it('flags every required field when the form is empty', () => {
    const errors = validateBooking(
      { name: '', email: '', eventDate: '', guestCount: '', celebrationType: '' },
      { eventNames: NAMES, today: TODAY }
    );
    expect(Object.keys(errors).sort()).toEqual([
      'celebrationType',
      'email',
      'eventDate',
      'guestCount',
      'name',
    ]);
  });

  it('rejects a date in the past but accepts today', () => {
    const past = validateBooking({ ...validBooking, eventDate: '2026-10-30' }, { eventNames: NAMES, today: TODAY });
    const todayOk = validateBooking({ ...validBooking, eventDate: TODAY }, { eventNames: NAMES, today: TODAY });
    expect(past.eventDate).toBeDefined();
    expect(todayOk.eventDate).toBeUndefined();
  });

  it.each(['0', '1001', '2.5', 'abc'])('rejects guest count %s', (guestCount) => {
    const errors = validateBooking({ ...validBooking, guestCount }, { eventNames: NAMES, today: TODAY });
    expect(errors.guestCount).toBeDefined();
  });

  it('rejects an invalid email', () => {
    const errors = validateBooking({ ...validBooking, email: 'not-an-email' }, { eventNames: NAMES, today: TODAY });
    expect(errors.email).toBeDefined();
  });

  it('rejects a celebration type that is not in the catalogue', () => {
    const errors = validateBooking({ ...validBooking, celebrationType: 'Unknown' }, { eventNames: NAMES, today: TODAY });
    expect(errors.celebrationType).toBeDefined();
  });
});

describe('validateNewEvent', () => {
  const validEvent = {
    name: 'Mehndi Night',
    category: 'Marriage',
    basePrice: '50000',
    description: 'A colourful mehndi evening with music.',
    packagesText: 'Decor\nFood',
    themeColor: '#db2777',
  };

  it('accepts a complete, valid event', () => {
    expect(validateNewEvent(validEvent, [])).toEqual({});
  });

  it('blocks duplicate names regardless of letter case', () => {
    const errors = validateNewEvent({ ...validEvent, name: 'mehndi NIGHT' }, ['Mehndi Night']);
    expect(errors.name).toBeDefined();
  });

  it('requires at least one package', () => {
    const errors = validateNewEvent({ ...validEvent, packagesText: '  \n  ' }, []);
    expect(errors.packagesText).toBeDefined();
  });

  it('requires a positive base price', () => {
    expect(validateNewEvent({ ...validEvent, basePrice: '0' }, []).basePrice).toBeDefined();
    expect(validateNewEvent({ ...validEvent, basePrice: '' }, []).basePrice).toBeDefined();
  });
});

describe('parsePackages', () => {
  it('trims lines and drops blank ones', () => {
    expect(parsePackages('  Decor \n\n Catering  \n')).toEqual(['Decor', 'Catering']);
  });
});
