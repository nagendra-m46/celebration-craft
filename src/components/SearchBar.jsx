export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar form-field">
      <label htmlFor="event-search">Search celebrations</label>
      <input
        id="event-search"
        type="search"
        placeholder="Search by name or category…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
