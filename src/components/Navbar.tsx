import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cloud } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'خانه' },
  { path: '/services', label: 'خدمات' },
  { path: '/ai', label: 'هوش مصنوعی' },
  { path: '/datacenter', label: 'دیتاسنتر' },
  { path: '/pricing', label: 'تعرفه‌ها' },
  { path: '/about', label: 'درباره ما' },
  { path: '/contact', label: 'تماس' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-ink font-bold text-sm block leading-tight">ابران سیستم</span>
              <span className="text-muted text-[10px]">Abran System</span>
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
                    ? 'text-primary bg-primary-soft font-medium'
                    : 'text-body hover:text-ink hover:bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link to="/contact" className="hidden md:inline-block btn-primary text-sm !py-2 !px-4">
              درخواست دمو
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-body hover:text-ink"
              aria-label="منو"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary-soft font-medium'
                    : 'text-body hover:text-ink hover:bg-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block btn-primary text-center mt-3">
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
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-ink font-bold">ابران سیستم</span>
            </div>
            <p className="text-body text-sm leading-relaxed">
              ارائه‌دهنده خدمات ابری، دیتاسنتر و هوش مصنوعی برای کسب‌وکارهای ایرانی
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-ink font-bold mb-4">خدمات</h4>
            <ul className="space-y-2">
              {['سرور ابری', 'سرور اختصاصی', 'کولوکیشن', 'CDN و امنیت', 'هوش مصنوعی'].map((s) => (
                <li key={s}><Link to="/services" className="text-body text-sm hover:text-primary transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-ink font-bold mb-4">شرکت</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-body text-sm hover:text-primary transition-colors">درباره ما</Link></li>
              <li><Link to="/contact" className="text-body text-sm hover:text-primary transition-colors">تماس با ما</Link></li>
              <li><Link to="/status" className="text-body text-sm hover:text-primary transition-colors">وضعیت سرویس‌ها</Link></li>
              <li><Link to="/pricing" className="text-body text-sm hover:text-primary transition-colors">تعرفه‌ها</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-ink font-bold mb-4">تماس</h4>
            <ul className="space-y-2 text-body text-sm">
              <li>تهران، خیابان ولیعصر</li>
              <li dir="ltr" className="text-left">021-1234-5678</li>
              <li dir="ltr" className="text-left">info@abran.system</li>
              <li>پشتیبانی ۲۴/۷</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">© ۱۴۰۳ ابران سیستم. تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-4 text-muted text-sm">
            <Link to="/architecture" className="hover:text-primary transition-colors">مستندات فنی</Link>
            <span>•</span>
            <span>قوانین و مقررات</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
