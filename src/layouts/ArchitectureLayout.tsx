import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Cloud, FileSearch, GitBranch, Wrench, CheckCircle2, LayoutDashboard, Globe, Puzzle, BookOpen, FolderTree, Database, Plug, Shield, Palette, Server, ShoppingCart, Zap, Rocket, DollarSign, Brain, BarChart3, Layers } from 'lucide-react';

type Page = string;

const navItems = [
  { id: 'overview', label: 'نمای کلی', icon: LayoutDashboard, group: 'معماری' },
  { id: 'hybrid', label: 'زیرساخت ترکیبی', icon: Globe, group: 'معماری' },
  { id: 'contexts', label: 'محدوده‌های مرزی', icon: Puzzle, group: 'معماری' },
  { id: 'adapters', label: 'آداپتورها', icon: Plug, group: 'معماری' },
  { id: 'database', label: 'پایگاه داده', icon: Database, group: 'معماری' },
  { id: 'adrs', label: 'تصمیمات معماری', icon: BookOpen, group: 'مستندات' },
  { id: 'repository', label: 'ساختار مخزن', icon: FolderTree, group: 'مستندات' },
  { id: 'rbac', label: 'کنترل دسترسی', icon: Shield, group: 'امنیت' },
  { id: 'design-phase1', label: 'فاز ۱: Design System', icon: Palette, group: 'طراحی' },
  { id: 'identity-phase2', label: 'فاز ۲: Identity', icon: Shield, group: 'Backend' },
  { id: 'ordering-phase3', label: 'فاز ۳: Ordering', icon: ShoppingCart, group: 'Backend' },
  { id: 'provisioning-phase4', label: 'فاز ۴: Provisioning', icon: Server, group: 'Backend' },
  { id: 'phase5-integration', label: 'فاز ۵: MVP', icon: Zap, group: 'Backend' },
  { id: 'phase6-production', label: 'فاز ۶: Production', icon: Rocket, group: 'Backend' },
  { id: 'phase7-financial', label: 'فاز ۷: Financial', icon: DollarSign, group: 'Backend' },
  { id: 'phase8-to-10', label: 'فاز ۸-۱۰: Intelligence', icon: Brain, group: 'Backend' },
  { id: 'phase11-bi', label: 'فاز ۱۱: BI', icon: BarChart3, group: 'Backend' },
  { id: 'phase12-extensibility', label: 'فاز ۱۲: Scale', icon: Layers, group: 'Backend' },
  { id: 'comprehensive-audit', label: 'گزارش Audit', icon: FileSearch, group: 'عملیات' },
  { id: 'cicd', label: 'خط لوله CI/CD', icon: GitBranch, group: 'عملیات' },
  { id: 'techstack', label: 'پشته فناوری', icon: Wrench, group: 'عملیات' },
  { id: 'dod', label: 'تعریف تکمیل', icon: CheckCircle2, group: 'عملیات' },
];

const groups = ['معماری', 'مستندات', 'امنیت', 'طراحی', 'Backend', 'عملیات'];

export function ArchitectureLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const currentPage = location.pathname.split('/').pop() || 'overview';

  return (
    <div className="flex h-screen bg-[#050816] text-gray-100 overflow-hidden">
      <aside className={`fixed right-0 top-0 h-full bg-[#0a0f1f]/95 backdrop-blur-xl border-l border-white/5 transition-all duration-300 z-50 flex flex-col ${sidebarOpen ? 'w-72' : 'w-16'}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xs font-bold text-white">ABRAN SYSTEM</h1>
                <p className="text-[9px] text-gray-500">مستندات فنی</p>
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
            {sidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          {groups.map((group) => (
            <div key={group}>
              {sidebarOpen && <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 px-3">{group}</p>}
              <div className="space-y-0.5">
                {navItems.filter(i => i.group === group).map((item) => {
                  const Icon = item.icon;
                  const active = currentPage === item.id;
                  return (
                    <Link key={item.id} to={`/architecture/${item.id}`} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-right transition-all text-xs ${active ? 'bg-blue-500/20 text-white border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="p-3 border-t border-white/5">
            <Link to="/" className="block text-center py-2 rounded-lg bg-white/5 text-gray-400 text-xs hover:text-white hover:bg-white/10 transition-all">
              ← بازگشت به سایت
            </Link>
          </div>
        )}
      </aside>
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'mr-72' : 'mr-16'}`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
