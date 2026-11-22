/**
 * Filters events by a free-text query (matches name or category, case-insensitive)
 * and by category ("All" means no category filter).
 */
export function filterEvents(events, { query = '', category = 'All' } = {}) {
  const q = query.trim().toLowerCase();

  return events.filter((event) => {
    const matchesCategory = category === 'All' || event.category === category;
    const matchesQuery =
      !q ||
      event.name.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}
