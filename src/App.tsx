import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthProvider } from './lib/auth';
import { ErrorBoundary } from './components/ui';

// Lazy-loaded public pages
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const AI = lazy(() => import('./pages/AI').then(m => ({ default: m.AI })));
const DataCenter = lazy(() => import('./pages/DataCenter').then(m => ({ default: m.DataCenter })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const About = lazy(() => import('./pages/Other').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Other').then(m => ({ default: m.Contact })));
const Status = lazy(() => import('./pages/Other').then(m => ({ default: m.Status })));
const NotFound = lazy(() => import('./pages/Other').then(m => ({ default: m.NotFound })));

// Lazy-loaded admin pages
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminBI = lazy(() => import('./pages/admin/BI').then(m => ({ default: m.AdminBI })));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <p className="text-body text-sm">در حال بارگذاری...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Landing Page - Modern Dark Theme */}
              <Route path="/" element={<Landing />} />

              {/* Public Website */}
              <Route element={<PublicLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/ai" element={<AI />} />
                <Route path="/datacenter" element={<DataCenter />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/status" element={<Status />} />
              </Route>

              {/* Login */}
              <Route path="/login" element={<Login />} />

              {/* Admin Panel */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="bi" element={<AdminBI />} />
                <Route path="revenue" element={<div className="text-ink">تقسیم درآمد (به زودی)</div>} />
                <Route path="services" element={<div className="text-ink">سرویس‌ها (به زودی)</div>} />
                <Route path="finance" element={<div className="text-ink">مالی (به زودی)</div>} />
                <Route path="customers" element={<div className="text-ink">مشتریان (به زودی)</div>} />
                <Route path="datacenters" element={<div className="text-ink">دیتاسنترها (به زودی)</div>} />
                <Route path="reports" element={<div className="text-ink">گزارش‌ها (به زودی)</div>} />
                <Route path="audit" element={<div className="text-ink">رویدادها (به زودی)</div>} />
                <Route path="settings" element={<div className="text-ink">تنظیمات (به زودی)</div>} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
