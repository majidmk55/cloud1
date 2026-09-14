import { Outlet } from 'react-router-dom';
import { Navbar, Footer } from '../components/Navbar';
import { ScrollToTop } from '../components/shared';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#050816] text-gray-100">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
