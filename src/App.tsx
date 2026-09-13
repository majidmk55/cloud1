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
import { DesignSystemPhase1 } from './pages/DesignSystemPhase1';
import { IdentityPhase2 } from './pages/IdentityPhase2';
import { OrderingPhase3 } from './pages/OrderingPhase3';
import { ProvisioningPhase4 } from './pages/ProvisioningPhase4';
import { AuditReport } from './pages/AuditReport';
import { CICD } from './pages/CICD';
import { TechStack } from './pages/TechStack';
import { DoD } from './pages/DoD';

export type Page =
  | 'overview' | 'hybrid' | 'contexts' | 'adrs' | 'repository'
  | 'database' | 'adapters' | 'rbac' | 'design' | 'design-phase1'
  | 'identity-phase2' | 'ordering-phase3' | 'provisioning-phase4' | 'audit' | 'cicd' | 'techstack' | 'dod';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('audit');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    const pages = {
      overview: <Overview onNavigate={setCurrentPage} />,
      hybrid: <HybridMultiSource />,
      contexts: <Contexts />,
      adrs: <ADRs />,
      repository: <Repository />,
      database: <DatabaseSchema />,
      adapters: <ProviderAdapters />,
      rbac: <RBAC />,
      design: <DesignSystem />,
      'design-phase1': <DesignSystemPhase1 />,
      'identity-phase2': <IdentityPhase2 />,
      'ordering-phase3': <OrderingPhase3 />,
      'provisioning-phase4': <ProvisioningPhase4 />,
      audit: <AuditReport />,
      cicd: <CICD />,
      techstack: <TechStack />,
      dod: <DoD />,
    };
    return pages[currentPage] || <AuditReport />;
  };

  return (
    <div className="flex h-screen bg-[#050816] text-gray-100 overflow-hidden">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'mr-80' : 'mr-16'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-10">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
