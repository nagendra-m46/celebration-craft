import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="empty-state">
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link className="btn btn-primary" to="/">
        Back to home
      </Link>
    </section>
  );
}
