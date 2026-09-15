import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Server, GitBranch, DollarSign, Settings, 
  Search, Bell, User, Shield, AlertTriangle, Menu, X,
  Users, ShoppingCart, Cpu, Workflow, Scale, FileCode, Database,
  BarChart3, TrendingUp
} from 'lucide-react';
import { adminUsers } from '../data/admin-data';

const navItems = [
  { path: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/admin/bi', label: 'هوش تجاری (BI)', icon: BarChart3 },
  { path: '/admin/resources', label: 'منابع', icon: Server },
  { path: '/admin/migrations', label: 'مهاجرت‌ها', icon: GitBranch },
  { path: '/admin/finance', label: 'مالی', icon: DollarSign },
  { path: '/admin/settings', label: 'تنظیمات', icon: Settings },
  { path: '/admin/contexts', label: 'Bounded Contexts', icon: Database },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentUser = adminUsers[0]; // Demo user

  return (
    <div className="min-h-screen bg-[#0a0f1f] text-white">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1f]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-500" />
              <span className="font-bold text-sm">ADMIN / OPS PLANE</span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی منابع، مشتریان، مهاجرت‌ها..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Right: Breakglass + Notifications + User */}
          <div className="flex items-center gap-3">
            {/* Breakglass Button */}
            <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">BREAKGLASS</span>
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-medium">{currentUser.email}</div>
                <div className="text-[10px] text-gray-400">
                  {currentUser.level === 'L1_SUPER_ADMIN' ? 'مدیر کل' : 
                   currentUser.level === 'L2_OPS_ADMIN' ? 'مدیر عملیات' : 'مشاهده‌گر'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-[60px] bottom-0 z-40 bg-[#0a0f1f] border-r border-white/5 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-16'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Security Info */}
        {sidebarOpen && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-red-500">SECURITY STATUS</span>
            </div>
            <div className="space-y-1 text-[10px] text-gray-400">
              <div>✓ mTLS Active</div>
              <div>✓ MFA Enabled</div>
              <div>✓ IP Allowlist: 2 ranges</div>
              <div>✓ Audit Trail: ON</div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`pt-[60px] transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
