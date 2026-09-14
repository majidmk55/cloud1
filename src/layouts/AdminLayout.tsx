import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth, type AccessLevel } from '../lib/auth';
import {
  LayoutDashboard, BarChart3, DollarSign, Server, Building2,
  Users, FileText, Shield, Settings, LogOut, Menu, X, ChevronLeft
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'داشبورد', icon: LayoutDashboard, level: 3 as AccessLevel },
  { path: '/admin/bi', label: 'هوش تجاری', icon: BarChart3, level: 2 as AccessLevel },
  { path: '/admin/revenue', label: 'تقسیم درآمد', icon: DollarSign, level: 2 as AccessLevel },
  { path: '/admin/services', label: 'سرویس‌ها', icon: Server, level: 2 as AccessLevel },
  { path: '/admin/finance', label: 'مالی', icon: DollarSign, level: 2 as AccessLevel },
  { path: '/admin/customers', label: 'مشتریان', icon: Users, level: 3 as AccessLevel },
  { path: '/admin/datacenters', label: 'دیتاسنترها', icon: Building2, level: 2 as AccessLevel },
  { path: '/admin/reports', label: 'گزارش‌ها', icon: FileText, level: 2 as AccessLevel },
  { path: '/admin/audit', label: 'رویدادها', icon: Shield, level: 2 as AccessLevel },
  { path: '/admin/settings', label: 'تنظیمات', icon: Settings, level: 1 as AccessLevel },
];

export function AdminLayout() {
  const { user, logout, hasAccess } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const levelBadge = {
    1: { label: 'مدیر کل', color: 'bg-danger-soft text-danger' },
    2: { label: 'مدیر عملیات', color: 'bg-warn-soft text-warn' },
    3: { label: 'مشاهده‌گر', color: 'bg-primary-soft text-primary' },
  };

  const badge = levelBadge[user.level];

  return (
    <div className="flex h-screen bg-bg">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-200 bg-surface border-l border-border flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-ink">پنل مدیریت</div>
                <div className="text-xs text-muted">ابران سیستم</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-sunken transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4 text-muted" /> : <Menu className="w-4 h-4 text-muted" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navItems.map((item) => {
            if (!hasAccess(item.level)) return null;
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-body hover:bg-sunken'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border space-y-2">
          {sidebarOpen && (
            <div className="px-3 py-2 rounded-lg bg-sunken">
              <div className="text-sm font-medium text-ink">{user.name}</div>
              <div className="text-xs text-muted">{user.email}</div>
              <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                {badge.label}
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body hover:bg-sunken transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">خروج</span>}
          </button>
          <Link
            to="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body hover:bg-sunken transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">بازگشت به سایت</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
