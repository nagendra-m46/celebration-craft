import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { seedEvents } from '../data/seedEvents.js';

const EventsContext = createContext(null);

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Holds the live celebration list and booking requests in React state.
 * Any component below this provider can read them or update them via useEvents().
 */
export function EventsProvider({ children }) {
  const [events, setEvents] = useState(seedEvents);
  const [bookings, setBookings] = useState([]);

  const addEvent = useCallback((event) => {
    setEvents((prev) => [...prev, { ...event, id: makeId('evt') }]);
  }, []);

  const addBooking = useCallback((booking) => {
    setBookings((prev) => [...prev, { ...booking, id: makeId('bk') }]);
  }, []);

  const value = useMemo(
    () => ({ events, addEvent, bookings, addBooking }),
    [events, addEvent, bookings, addBooking]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used inside <EventsProvider>.');
  }
  return context;
}
