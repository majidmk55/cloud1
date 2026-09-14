import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/Navbar';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
