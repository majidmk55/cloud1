export function Overview() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-gray-900 to-purple-900/40 border border-gray-800 p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">☁️</span>
            <div>
              <h1 className="text-3xl font-bold text-white">ABRAN SYSTEM</h1>
              <p className="text-blue-300 text-lg">Cloud & Data Center Platform — Iranian Market</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl leading-relaxed">
            A B2C/B2B cloud platform offering VPS, Dedicated Servers, Bare Metal, GPU/AI instances,
            Storage, Backup, and Network services with a comprehensive Reseller system.
            Built with a Modular Monolith architecture designed for future microservice extraction.
          </p>
          <div className="flex gap-3 mt-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">Phase 0</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">MVP-First</span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30">Self-Service</span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">Extensible</span>
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🎯</span> Mission
        </h2>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <p className="text-gray-300 leading-relaxed">
            Implement <strong className="text-white">Phase 0</strong> of the ABRAN SYSTEM — establishing the 
            <strong className="text-blue-400"> Architecture</strong>, <strong className="text-blue-400">Repository</strong>, 
            <strong className="text-blue-400"> ADRs</strong>, and <strong className="text-blue-400">CI/CD foundation</strong>.
            No business logic yet — only the skeleton, the rules, and the automation gates.
          </p>
        </div>
      </section>

      {/* C4 Context Diagram */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📊</span> C4 Context Diagram
        </h2>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="bg-gray-950 rounded-lg p-6 border border-gray-700">
            <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre font-mono leading-relaxed">
{`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    ABRAN SYSTEM                                         │
│                                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │
│  │   Customer   │  │  Reseller   │  │   Admin      │  │   Provider   │                   │
│  │   (B2C/B2B)  │  │   Portal    │  │   Portal     │  │   Systems    │                   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                   │
│         │                │                │                │                             │
│         ▼                ▼                ▼                ▼                             │
│  ┌──────────────────────────────────────────────────────────────────┐                   │
│  │                     API GATEWAY (NestJS)                         │                   │
│  │              Auth │ Rate Limit │ Routing │ Validation             │                   │
│  └──────────────────────────┬───────────────────────────────────────┘                   │
│                             │                                                           │
│  ┌──────────────────────────▼───────────────────────────────────────┐                   │
│  │                   MODULAR MONOLITH                                │                   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │                   │
│  │  │ Identity │ │ Ordering │ │Provisioning│ │ Lifecycle│           │                   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │                   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │                   │
│  │  │Financial │ │Inventory │ │  Config  │ │Provider- │           │                   │
│  │  │          │ │          │ │          │ │Intelligence│          │                   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │                   │
│  │  ┌──────────┐                                                   │                   │
│  │  │Analytics │  (Deferred to Phase 11)                           │                   │
│  │  └──────────┘                                                   │                   │
│  └─────────────────────────────────────────────────────────────────┘                   │
│                             │                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                              │
│  │PostgreSQL│  │  Redis   │  │  MinIO   │  │  NATS    │                              │
│  │   16     │  │  Cache   │  │  S3      │  │ JetStream│                              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘

External Systems:
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │   Keycloak   │  │   Vault      │  │   Grafana    │  │  Cloud       │
  │   (Auth)     │  │  (Secrets)   │  │ (Observability│  │  Providers   │
  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
`}
            </pre>
          </div>
          <p className="text-sm text-gray-400 mt-4 italic">
            Figure 1: C4 Level 1 — System Context Diagram showing ABRAN SYSTEM and its external actors and dependencies.
          </p>
        </div>
      </section>

      {/* Key Principles */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>💎</span> Key Design Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'MVP-First', desc: 'Ship value early. PostgreSQL Outbox + BullMQ for MVP; Temporal later.', icon: '🚀' },
            { title: 'Modular Monolith', desc: 'Hard bounded contexts with explicit boundaries. Future-proof for microservice extraction.', icon: '🧱' },
            { title: 'Self-Service', desc: 'Customers and resellers manage their services without human intervention.', icon: '🎛️' },
            { title: 'Plugin-Based', desc: 'Extensible architecture for adding new service types without core modifications.', icon: '🔌' },
            { title: 'Sanctions-Safe', desc: 'VPS sourced from reputable global providers with no sanctions risk.', icon: '🛡️' },
            { title: '3-Level Admin', desc: 'Super Admin / Admin / Operator with clear permission boundaries.', icon: '👥' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-white font-semibold">{item.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Types */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🖥️</span> Service Catalog
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'VPS', icon: '🖥️', color: 'blue' },
            { name: 'Dedicated', icon: '🏢', color: 'purple' },
            { name: 'Bare Metal', icon: '⚡', color: 'amber' },
            { name: 'GPU/AI', icon: '🧠', color: 'emerald' },
            { name: 'Storage', icon: '💾', color: 'cyan' },
            { name: 'Backup', icon: '🔄', color: 'orange' },
            { name: 'Network', icon: '🌐', color: 'pink' },
            { name: 'Reseller', icon: '🤝', color: 'indigo' },
          ].map((service) => (
            <div key={service.name} className="bg-gray-900 rounded-lg border border-gray-800 p-4 text-center hover:border-gray-600 transition-colors">
              <span className="text-3xl block mb-2">{service.icon}</span>
              <span className="text-sm text-gray-300 font-medium">{service.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Phase 0 Scope */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📌</span> Phase 0 Scope
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 rounded-xl border border-emerald-800/50 p-5">
            <h3 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
              <span>✅</span> In Scope
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Repository structure (Turborepo + pnpm)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> 8 Architecture Decision Records</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> CI/CD pipeline with quality gates</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> NestJS API skeleton</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Next.js app skeletons (4 portals)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Shared packages (contracts, events, etc.)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Docker Compose for local dev</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Infrastructure scaffolding</li>
            </ul>
          </div>
          <div className="bg-red-900/20 rounded-xl border border-red-800/50 p-5">
            <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <span>🚫</span> Out of Scope
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No business logic</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No real Keycloak integration</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No Temporal workflows</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No NATS messaging</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No Kubernetes deployment</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No production infra provisioning</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No BI/Analytics implementation</li>
              <li className="flex items-start gap-2"><span className="text-red-400">•</span> No real payment integration</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
