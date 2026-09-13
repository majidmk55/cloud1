import { Page } from '../App';
import {
  LayoutDashboard, Globe, Puzzle, BookOpen, FolderTree, Database,
  Plug, Shield, Palette, GitBranch, Wrench, CheckCircle2, ChevronRight, ChevronLeft, Cloud
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems: { id: Page; label: string; labelEn: string; icon: any; group: string }[] = [
  { id: 'overview', label: 'نمای کلی', labelEn: 'Overview', icon: LayoutDashboard, group: 'معماری' },
  { id: 'hybrid', label: 'زیرساخت ترکیبی', labelEn: 'Hybrid Multi-Source', icon: Globe, group: 'معماری' },
  { id: 'contexts', label: 'محدوده‌های مرزی', labelEn: 'Bounded Contexts', icon: Puzzle, group: 'معماری' },
  { id: 'adapters', label: 'آداپتورها', labelEn: 'Provider Adapters', icon: Plug, group: 'معماری' },
  { id: 'database', label: 'پایگاه داده', labelEn: 'Database Schema', icon: Database, group: 'معماری' },
  { id: 'adrs', label: 'تصمیمات معماری', labelEn: 'ADRs (12)', icon: BookOpen, group: 'مستندات' },
  { id: 'repository', label: 'ساختار مخزن', labelEn: 'Repository', icon: FolderTree, group: 'مستندات' },
  { id: 'rbac', label: 'کنترل دسترسی', labelEn: 'RBAC Matrix', icon: Shield, group: 'امنیت' },
  { id: 'design-phase1', label: 'فاز ۱: Design System', labelEn: 'Phase 1: DS & UX', icon: Palette, group: 'طراحی' },
  { id: 'design', label: 'سیستم طراحی', labelEn: 'Design System', icon: Palette, group: 'طراحی' },
  { id: 'identity-phase2', label: 'فاز ۲: Identity', labelEn: 'Phase 2: Identity', icon: Shield, group: 'Backend' },
  { id: 'cicd', label: 'خط لوله CI/CD', labelEn: 'CI/CD Pipeline', icon: GitBranch, group: 'عملیات' },
  { id: 'techstack', label: 'پشته فناوری', labelEn: 'Tech Stack', icon: Wrench, group: 'عملیات' },
  { id: 'dod', label: 'تعریف تکمیل', labelEn: 'Definition of Done', icon: CheckCircle2, group: 'عملیات' },
];

const groups = ['معماری', 'مستندات', 'امنیت', 'طراحی', 'Backend', 'عملیات'];

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed right-0 top-0 h-full bg-[#0a0f1f]/95 backdrop-blur-xl border-l border-white/5 transition-all duration-300 z-50 flex flex-col ${
        isOpen ? 'w-80' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0f1f]"></div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">ABRAN SYSTEM</h1>
              <p className="text-[10px] text-gray-500 font-mono" dir="ltr">Phase 0 · Foundation</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {groups.map((group) => (
          <div key={group}>
            {isOpen && (
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-3">
                {group}
              </p>
            )}
            <div className="space-y-1">
              {navItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-right transition-all duration-200 group ${
                        active
                          ? 'bg-gradient-to-l from-blue-500/20 to-purple-500/10 text-white border border-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-400' : ''}`} />
                      {isOpen && (
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate">{item.label}</span>
                          <span className="text-[10px] text-gray-500 font-mono" dir="ltr">{item.labelEn}</span>
                        </div>
                      )}
                      {active && isOpen && (
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-white/5">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 font-mono" dir="ltr">v0.1.0</span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></span>
                Active
              </span>
            </div>
            <div className="text-xs text-gray-300">فاز صفر — پایه‌ریزی</div>
          </div>
        </div>
      )}
    </aside>
  );
}
