import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Overview } from './pages/Overview';
import { HybridMultiSource } from './pages/HybridMultiSource';
import { Contexts } from './pages/Contexts';
import { ADRs } from './pages/ADRs';
import { Repository } from './pages/Repository';
import { DatabaseSchema } from './pages/DatabaseSchema';
import { ProviderAdapters } from './pages/ProviderAdapters';
import { RBAC } from './pages/RBAC';
import { DesignSystem } from './pages/DesignSystem';
import { CICD } from './pages/CICD';
import { TechStack } from './pages/TechStack';
import { DoD } from './pages/DoD';

export type Page = 
  | 'overview' 
  | 'hybrid' 
  | 'contexts' 
  | 'adrs' 
  | 'repository' 
  | 'database' 
  | 'adapters' 
  | 'rbac' 
  | 'design' 
  | 'cicd' 
  | 'techstack' 
  | 'dod';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <Overview onNavigate={setCurrentPage} />;
      case 'hybrid': return <HybridMultiSource />;
      case 'contexts': return <Contexts />;
      case 'adrs': return <ADRs />;
      case 'repository': return <Repository />;
      case 'database': return <DatabaseSchema />;
      case 'adapters': return <ProviderAdapters />;
      case 'rbac': return <RBAC />;
      case 'design': return <DesignSystem />;
      case 'cicd': return <CICD />;
      case 'techstack': return <TechStack />;
      case 'dod': return <DoD />;
      default: return <Overview onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'mr-72' : 'mr-16'}`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
