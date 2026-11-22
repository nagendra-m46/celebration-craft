import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { EventsProvider } from './context/EventsContext.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import Booking from './pages/Booking.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <EventsProvider>
      <a className="skip-link" href="#main">Skip to main content</a>
      <Navbar />
      <main id="main" className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="container">© {new Date().getFullYear()} CelebrationCraft</div>
      </footer>
    </EventsProvider>
  );
}
