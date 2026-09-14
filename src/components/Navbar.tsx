import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cloud } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'خانه' },
  { path: '/services', label: 'خدمات ابری' },
  { path: '/ai', label: 'هوش مصنوعی' },
  { path: '/datacenter', label: 'دیتاسنتر' },
  { path: '/pricing', label: 'تعرفه‌ها' },
  { path: '/about', label: 'درباره ما' },
  { path: '/contact', label: 'تماس' },
  { path: '/status', label: 'وضعیت' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-[#050816]/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-sm block leading-tight">ابران سیستم</span>
              <span className="text-gray-500 text-[10px]">Abran System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'text-white bg-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden md:inline-block px-4 py-2 rounded-lg bg-gradient-to-l from-blue-600 to-purple-600 text-white text-sm font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
              درخواست دمو
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
              aria-label="منو"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#050816]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm ${
                  location.pathname === link.path
                    ? 'text-white bg-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-bold text-center mt-3">
              درخواست دمو
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#0a0f1f] border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold">ابران سیستم</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              ارائه‌دهنده خدمات ابری، دیتاسنتر و هوش مصنوعی برای کسب‌وکارهای ایرانی
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4">خدمات</h4>
            <ul className="space-y-2">
              {['سرور ابری', 'سرور اختصاصی', 'کولوکیشن', 'CDN و امنیت', 'هوش مصنوعی'].map((s) => (
                <li key={s}><Link to="/services" className="text-gray-400 text-sm hover:text-white transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4">شرکت</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 text-sm hover:text-white transition-colors">درباره ما</Link></li>
              <li><Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors">تماس با ما</Link></li>
              <li><Link to="/status" className="text-gray-400 text-sm hover:text-white transition-colors">وضعیت سرویس‌ها</Link></li>
              <li><Link to="/pricing" className="text-gray-400 text-sm hover:text-white transition-colors">تعرفه‌ها</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">تماس</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>تهران، خیابان ولیعصر</li>
              <li dir="ltr" className="text-left">021-1234-5678</li>
              <li dir="ltr" className="text-left">info@abran.system</li>
              <li>پشتیبانی ۲۴/۷</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© ۱۴۰۳ ابران سیستم. تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <Link to="/architecture" className="hover:text-white transition-colors">مستندات فنی</Link>
            <span>•</span>
            <span>قوانین و مقررات</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
