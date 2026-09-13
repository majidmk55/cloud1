import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: 'overview', label: 'Architecture Overview', icon: '🏗️' },
  { id: 'contexts', label: 'Bounded Contexts', icon: '🧩' },
  { id: 'adrs', label: 'Architecture Decisions', icon: '📋' },
  { id: 'repository', label: 'Repository Structure', icon: '📁' },
  { id: 'cicd', label: 'CI/CD Pipeline', icon: '⚙️' },
  { id: 'techstack', label: 'Technology Stack', icon: '🔧' },
  { id: 'dod', label: 'Definition of Done', icon: '✅' },
];

export function Sidebar({ currentPage, setCurrentPage, isOpen, setIsOpen }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-50 ${
        isOpen ? 'w-72' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">☁️</span>
            <div>
              <h1 className="text-sm font-bold text-white">ABRAN SYSTEM</h1>
              <p className="text-xs text-gray-400">Phase 0 — Foundation</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
              currentPage === item.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            {isOpen && <span className="text-sm font-medium truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Version: 0.1.0</p>
            <p>Status: Phase 0 — Skeleton</p>
            <p className="text-emerald-400">● All systems nominal</p>
          </div>
        </div>
      )}
    </aside>
  );
}
