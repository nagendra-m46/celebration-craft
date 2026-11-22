import { Link } from 'react-router-dom';
import { formatINR } from '../utils/format.js';

export default function EventCard({ event }) {
  const { name, category, basePrice, description, packages, themeColor } = event;

  return (
    <article className="event-card" style={{ '--accent': themeColor }}>
      <span className="badge">{category}</span>
      <h3>{name}</h3>
      <p className="event-desc">{description}</p>
      <p className="price">
        Starting at <strong>{formatINR(basePrice)}</strong>
      </p>

      <details>
        <summary>View packages ({packages.length})</summary>
        <ul>
          {packages.map((pkg, index) => (
            <li key={`${pkg}-${index}`}>{pkg}</li>
          ))}
        </ul>
      </details>

      <Link className="btn btn-primary" to={`/book?type=${encodeURIComponent(name)}`}>
        Book Now
      </Link>
    </article>
  );
}
