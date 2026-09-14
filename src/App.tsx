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
import { Phase5Integration } from './pages/Phase5Integration';
import { Phase6Production } from './pages/Phase6Production';
import { Phase7Financial } from './pages/Phase7Financial';
import { Phase8to10 } from './pages/Phase8to10';
import { Phase11BI } from './pages/Phase11BI';
import { Phase12Extensibility } from './pages/Phase12Extensibility';
import { ComprehensiveAudit } from './pages/ComprehensiveAudit';
import { CICD } from './pages/CICD';
import { TechStack } from './pages/TechStack';
import { DoD } from './pages/DoD';
import { SetupScript } from './pages/SetupScript';

export type Page =
  | 'overview' | 'hybrid' | 'contexts' | 'adrs' | 'repository'
  | 'database' | 'adapters' | 'rbac' | 'design' | 'design-phase1'
  | 'identity-phase2' | 'ordering-phase3' | 'provisioning-phase4' | 'phase5-integration' | 'phase6-production' | 'phase7-financial' | 'phase8-to-10' | 'phase11-bi' | 'phase12-extensibility' | 'comprehensive-audit' | 'cicd' | 'techstack' | 'dod' | 'setup-script';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('comprehensive-audit');
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
      'phase5-integration': <Phase5Integration />,
      'phase6-production': <Phase6Production />,
      'phase7-financial': <Phase7Financial />,
      'phase8-to-10': <Phase8to10 />,
      'phase11-bi': <Phase11BI />,
      'phase12-extensibility': <Phase12Extensibility />,
      'comprehensive-audit': <ComprehensiveAudit />,
      cicd: <CICD />,
      techstack: <TechStack />,
      dod: <DoD />,
      'setup-script': <SetupScript />,
    };
    return pages[currentPage] || <ComprehensiveAudit />;
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
