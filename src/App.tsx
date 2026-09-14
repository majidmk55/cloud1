import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { ArchitectureLayout } from './layouts/ArchitectureLayout';
import { ErrorBoundary } from './components/shared';

// Lazy-loaded public pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const AI = lazy(() => import('./pages/AI').then(m => ({ default: m.AI })));
const DataCenter = lazy(() => import('./pages/DataCenter').then(m => ({ default: m.DataCenter })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const About = lazy(() => import('./pages/Other').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Other').then(m => ({ default: m.Contact })));
const Status = lazy(() => import('./pages/Other').then(m => ({ default: m.Status })));
const NotFound = lazy(() => import('./pages/Other').then(m => ({ default: m.NotFound })));

// Lazy-loaded architecture pages
const Overview = lazy(() => import('./pages/Overview').then(m => ({ default: m.Overview })));
const HybridMultiSource = lazy(() => import('./pages/HybridMultiSource').then(m => ({ default: m.HybridMultiSource })));
const Contexts = lazy(() => import('./pages/Contexts').then(m => ({ default: m.Contexts })));
const ADRs = lazy(() => import('./pages/ADRs').then(m => ({ default: m.ADRs })));
const Repository = lazy(() => import('./pages/Repository').then(m => ({ default: m.Repository })));
const DatabaseSchema = lazy(() => import('./pages/DatabaseSchema').then(m => ({ default: m.DatabaseSchema })));
const ProviderAdapters = lazy(() => import('./pages/ProviderAdapters').then(m => ({ default: m.ProviderAdapters })));
const RBAC = lazy(() => import('./pages/RBAC').then(m => ({ default: m.RBAC })));
const DesignSystem = lazy(() => import('./pages/DesignSystem').then(m => ({ default: m.DesignSystem })));
const DesignSystemPhase1 = lazy(() => import('./pages/DesignSystemPhase1').then(m => ({ default: m.DesignSystemPhase1 })));
const IdentityPhase2 = lazy(() => import('./pages/IdentityPhase2').then(m => ({ default: m.IdentityPhase2 })));
const OrderingPhase3 = lazy(() => import('./pages/OrderingPhase3').then(m => ({ default: m.OrderingPhase3 })));
const ProvisioningPhase4 = lazy(() => import('./pages/ProvisioningPhase4').then(m => ({ default: m.ProvisioningPhase4 })));
const Phase5Integration = lazy(() => import('./pages/Phase5Integration').then(m => ({ default: m.Phase5Integration })));
const Phase6Production = lazy(() => import('./pages/Phase6Production').then(m => ({ default: m.Phase6Production })));
const Phase7Financial = lazy(() => import('./pages/Phase7Financial').then(m => ({ default: m.Phase7Financial })));
const Phase8to10 = lazy(() => import('./pages/Phase8to10').then(m => ({ default: m.Phase8to10 })));
const Phase11BI = lazy(() => import('./pages/Phase11BI').then(m => ({ default: m.Phase11BI })));
const Phase12Extensibility = lazy(() => import('./pages/Phase12Extensibility').then(m => ({ default: m.Phase12Extensibility })));
const ComprehensiveAudit = lazy(() => import('./pages/ComprehensiveAudit').then(m => ({ default: m.ComprehensiveAudit })));
const CICD = lazy(() => import('./pages/CICD').then(m => ({ default: m.CICD })));
const TechStack = lazy(() => import('./pages/TechStack').then(m => ({ default: m.TechStack })));
const DoD = lazy(() => import('./pages/DoD').then(m => ({ default: m.DoD })));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Website */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/datacenter" element={<DataCenter />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/status" element={<Status />} />
            </Route>

            {/* Architecture Documentation */}
            <Route path="/architecture" element={<ArchitectureLayout />}>
              <Route index element={<Overview onNavigate={() => {}} />} />
              <Route path="overview" element={<Overview onNavigate={() => {}} />} />
              <Route path="hybrid" element={<HybridMultiSource />} />
              <Route path="contexts" element={<Contexts />} />
              <Route path="adrs" element={<ADRs />} />
              <Route path="repository" element={<Repository />} />
              <Route path="database" element={<DatabaseSchema />} />
              <Route path="adapters" element={<ProviderAdapters />} />
              <Route path="rbac" element={<RBAC />} />
              <Route path="design" element={<DesignSystem />} />
              <Route path="design-phase1" element={<DesignSystemPhase1 />} />
              <Route path="identity-phase2" element={<IdentityPhase2 />} />
              <Route path="ordering-phase3" element={<OrderingPhase3 />} />
              <Route path="provisioning-phase4" element={<ProvisioningPhase4 />} />
              <Route path="phase5-integration" element={<Phase5Integration />} />
              <Route path="phase6-production" element={<Phase6Production />} />
              <Route path="phase7-financial" element={<Phase7Financial />} />
              <Route path="phase8-to-10" element={<Phase8to10 />} />
              <Route path="phase11-bi" element={<Phase11BI />} />
              <Route path="phase12-extensibility" element={<Phase12Extensibility />} />
              <Route path="comprehensive-audit" element={<ComprehensiveAudit />} />
              <Route path="cicd" element={<CICD />} />
              <Route path="techstack" element={<TechStack />} />
              <Route path="dod" element={<DoD />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
