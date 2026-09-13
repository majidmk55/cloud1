import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems: { id: Page; label: string; labelEn: string; icon: string; group: string }[] = [
  { id: 'overview', label: 'نمای کلی معماری', labelEn: 'Overview', icon: '🏗️', group: 'معماری' },
  { id: 'hybrid', label: 'زیرساخت ترکیبی', labelEn: 'Hybrid Multi-Source', icon: '🌐', group: 'معماری' },
  { id: 'contexts', label: 'محدوده‌های مرزی', labelEn: 'Bounded Contexts', icon: '🧩', group: 'معماری' },
  { id: 'adapters', label: 'آداپتورهای ارائه‌دهنده', labelEn: 'Provider Adapters', icon: '🔌', group: 'معماری' },
  { id: 'database', label: 'اسکیما پایگاه داده', labelEn: 'Database Schema', icon: '🗄️', group: 'معماری' },
  { id: 'adrs', label: 'تصمیمات معماری', labelEn: 'ADRs (12)', icon: '📋', group: 'مستندات' },
  { id: 'repository', label: 'ساختار مخزن', labelEn: 'Repository', icon: '📁', group: 'مستندات' },
  { id: 'rbac', label: 'کنترل دسترسی', labelEn: 'RBAC Matrix', icon: '🛡️', group: 'امنیت' },
  { id: 'design', label: 'سیستم طراحی', labelEn: 'Design System', icon: '🎨', group: 'طراحی' },
  { id: 'cicd', label: 'خط لوله CI/CD', labelEn: 'CI/CD Pipeline', icon: '⚙️', group: 'عملیات' },
  { id: 'techstack', label: 'پشته فناوری', labelEn: 'Tech Stack', icon: '🔧', group: 'عملیات' },
  { id: 'dod', label: 'تعریف تکمیل', labelEn: 'Definition of Done', icon: '✅', group: 'عملیات' },
];

const groups = ['معماری', 'مستندات', 'امنیت', 'طراحی', 'عملیات'];

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed right-0 top-0 h-full bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 transition-all duration-300 z-50 ${
        isOpen ? 'w-72' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">ABRAN SYSTEM</h1>
              <p className="text-[10px] text-gray-400">Phase 0 — Foundation</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {isOpen ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-4 overflow-y-auto h-[calc(100vh-140px)]">
        {groups.map((group) => (
          <div key={group}>
            {isOpen && (
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                {group}
              </p>
            )}
            <div className="space-y-1">
              {navItems
                .filter((item) => item.group === group)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {isOpen && (
                      <div className="flex-1 text-right">
                        <span className="text-sm font-medium block">{item.label}</span>
                        <span className="text-[10px] text-gray-500">{item.labelEn}</span>
                      </div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 left-0 p-4 border-t border-gray-800 bg-gray-900/95">
          <div className="text-xs text-gray-500 space-y-1">
            <p>نسخه: 0.1.0</p>
            <p>وضعیت: فاز صفر — اسکلت</p>
            <p className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></span>
              تمام سیستم‌ها فعال
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
