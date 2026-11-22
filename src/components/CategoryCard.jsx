import { Link } from 'react-router-dom';

export default function CategoryCard({ category, emoji, blurb, count }) {
  return (
    <Link to={`/events?category=${encodeURIComponent(category)}`} className="category-card">
      <span className="category-emoji" aria-hidden="true">
        {emoji}
      </span>
      <h3>{category}</h3>
      <p>{blurb}</p>
      <span className="card-meta">
        {count} celebration{count === 1 ? '' : 's'} available
      </span>
    </Link>
  );
}
