import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard.jsx';
import { CATEGORIES, CATEGORY_INFO } from '../data/constants.js';
import { useEvents } from '../context/EventsContext.jsx';

export default function Home() {
  const { events } = useEvents();

  return (
    <>
      <section className="hero">
        <h1>Welcome to CelebrationCraft</h1>
        <p>
          From birthdays and Haldi ceremonies to weddings and baby showers, we help you plan every
          milestone with beautiful packages, simple booking and custom themes made just for you.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/events">
            Browse events
          </Link>
          <Link className="btn btn-outline" to="/book">
            Book a celebration
          </Link>
        </div>
      </section>

      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">Celebrate every milestone</h2>
        <div className="grid categories">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              emoji={CATEGORY_INFO[category].emoji}
              blurb={CATEGORY_INFO[category].blurb}
              count={events.filter((e) => e.category === category).length}
            />
          ))}
        </div>
      </section>
    </>
  );
}
