import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { CATEGORIES } from '../data/constants.js';
import { useEvents } from '../context/EventsContext.jsx';
import { filterEvents } from '../utils/filterEvents.js';

export default function Events() {
  const { events } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');

  // Category can come from the URL (e.g. the Home page cards) or the dropdown.
  const categoryParam = searchParams.get('category');
  const category = CATEGORIES.includes(categoryParam) ? categoryParam : 'All';

  const results = useMemo(
    () => filterEvents(events, { query, category }),
    [events, query, category]
  );

  const handleCategoryChange = (value) => {
    setSearchParams(value === 'All' ? {} : { category: value });
  };

  const clearFilters = () => {
    setQuery('');
    setSearchParams({});
  };

  return (
    <section>
      <h1>Event Catalog</h1>
      <p className="lead">Explore packages for every celebration and book the one you love.</p>

      <div className="toolbar">
        <SearchBar value={query} onChange={setQuery} />
        <div className="form-field inline">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="results-count" aria-live="polite">
        {results.length} celebration{results.length === 1 ? '' : 's'} found
      </p>

      {results.length > 0 ? (
        <div className="grid events">
          {results.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No celebrations match your search.</p>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
