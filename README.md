# CelebrationCraft

A responsive single-page React app for browsing celebration packages (Birthdays, Haldi ceremonies, Marriages, Baby Showers), submitting booking requests, and adding custom celebration themes at runtime.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm test         # run the test suite (Vitest + React Testing Library)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Requires Node.js 18 or newer.

## Pages

| Route | Page | What it does |
| --- | --- | --- |
| `/` | Home | Hero section and four category cards that link to the catalogue filtered by category |
| `/events` | Event Catalogue | Search by name or category, category dropdown, event cards with base price, expandable packages and a **Book Now** button |
| `/book` | Booking | Name, email, event date, guest count and celebration type, with validation before the success message. Supports `?type=` to pre-select a celebration |
| `/create` | Create Celebration | Form that adds a new package to the live list, with a live preview card and a theme colour picker |
| `*` | Not found | Friendly 404 page |

## Project structure

```
src/
  App.jsx                 Routes and layout
  main.jsx                Entry point (BrowserRouter, StrictMode)
  styles.css              Responsive styles (mobile first)
  context/EventsContext.jsx   Shared live state: events and bookings (useState + Context)
  components/             Navbar, EventCard, CategoryCard, SearchBar, FormField
  pages/                  Home, Events, Booking, CreateEvent, NotFound
  data/                   Categories and seed events
  utils/                  Validation, filtering, currency formatting
  test/setup.js           Test setup
```

## Requirements added beyond the brief

- **Routing and navigation**: React Router with a sticky navbar, a mobile hamburger menu, active-link highlighting and a 404 page.
- **Responsive design**: works from 320px phones up to desktop, with no horizontal scrolling.
- **Shared state**: events and bookings live in one `EventsProvider`, so a celebration added on `/create` appears on `/events` and in the booking dropdown straight away.
- **Email field on bookings**: the booking form includes an email address so the business can reply.
- **Input validation rules**: names, email format, no past dates, guest count from 1 to 1000, valid celebration type, unique celebration names (case-insensitive), price limits, description length and at least one package.
- **Inline errors and accessibility**: errors appear next to each field and are announced to screen readers. Labels are linked to inputs, there is a skip-to-content link, and focus styles are visible.
- **Indian Rupee formatting**: prices use `₹` and the `en-IN` number format.
- **Filtering from the URL**: `/events?category=Haldi` opens the catalogue pre-filtered, so the Home page cards link directly to it.
- **Live preview**: the Create page shows the new card updating as the user types.
- **Tests**: unit tests for validation and integration tests for the main user flows.

## Notes and next steps

- Data lives in React state, so it resets when the page is reloaded. To keep it, connect `EventsProvider` to `localStorage` or an API.
- When deploying to a static host, configure a rewrite to `index.html` so deep links such as `/events` work on refresh.
