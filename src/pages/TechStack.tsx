export function TechStack() {
  const layers = [
    {
      name: 'Monorepo & Build',
      icon: '📦',
      color: 'blue',
      tools: [
        { name: 'Turborepo', version: '2.x', desc: 'Build system for monorepos', status: 'active' },
        { name: 'pnpm', version: '9.x', desc: 'Fast, disk-efficient package manager', status: 'active' },
        { name: 'TypeScript', version: '5.4+', desc: 'Type-safe JavaScript superset', status: 'active' },
      ],
    },
    {
      name: 'Frontend',
      icon: '🎨',
      color: 'purple',
      tools: [
        { name: 'Next.js', version: '14+', desc: 'React framework with App Router', status: 'active' },
        { name: 'React', version: '18+', desc: 'UI component library', status: 'active' },
        { name: 'Tailwind CSS', version: '3.x', desc: 'Utility-first CSS framework', status: 'active' },
        { name: 'shadcn/ui', version: 'latest', desc: 'Accessible component library', status: 'active' },
      ],
    },
    {
      name: 'Backend',
      icon: '⚙️',
      color: 'emerald',
      tools: [
        { name: 'NestJS', version: '10.x', desc: 'Progressive Node.js framework', status: 'active' },
        { name: 'Node.js', version: '20 LTS', desc: 'JavaScript runtime', status: 'active' },
        { name: 'Prisma', version: '5.x', desc: 'Type-safe ORM for PostgreSQL', status: 'active' },
      ],
    },
    {
      name: 'Database & Storage',
      icon: '🗄️',
      color: 'cyan',
      tools: [
        { name: 'PostgreSQL', version: '16', desc: 'Primary relational database', status: 'active' },
        { name: 'Redis', version: '7.x', desc: 'Cache and session store', status: 'active' },
        { name: 'MinIO', version: 'latest', desc: 'S3-compatible object storage', status: 'active' },
      ],
    },
    {
      name: 'Messaging & Workflow',
      icon: '📨',
      color: 'amber',
      tools: [
        { name: 'NATS JetStream', version: '2.10', desc: 'High-performance messaging', status: 'deferred' },
        { name: 'Temporal', version: '1.x', desc: 'Workflow orchestration', status: 'deferred' },
        { name: 'BullMQ', version: '5.x', desc: 'Job queue (MVP replacement)', status: 'active' },
      ],
    },
    {
      name: 'Authentication',
      icon: '🔐',
      color: 'pink',
      tools: [
        { name: 'Keycloak', version: '24.x', desc: 'Identity & access management', status: 'deferred' },
        { name: 'Custom JWT', version: '-', desc: 'MVP auth adapter', status: 'active' },
        { name: 'bcrypt', version: '5.x', desc: 'Password hashing', status: 'active' },
      ],
    },
    {
      name: 'Infrastructure',
      icon: '🏗️',
      color: 'orange',
      tools: [
        { name: 'Docker', version: '24+', desc: 'Container runtime', status: 'active' },
        { name: 'Docker Compose', version: '2.x', desc: 'Multi-container orchestration (dev)', status: 'active' },
        { name: 'Kubernetes', version: '1.29', desc: 'Container orchestration (prod)', status: 'deferred' },
        { name: 'Terraform', version: '1.7+', desc: 'Infrastructure as Code', status: 'scaffolded' },
        { name: 'Ansible', version: '2.16', desc: 'Configuration management', status: 'scaffolded' },
      ],
    },
    {
      name: 'Observability',
      icon: '📊',
      color: 'indigo',
      tools: [
        { name: 'OpenTelemetry', version: '1.x', desc: 'Distributed tracing + metrics', status: 'active' },
        { name: 'Prometheus', version: '2.x', desc: 'Metrics collection', status: 'active' },
        { name: 'Grafana', version: '10.x', desc: 'Dashboards and visualization', status: 'active' },
        { name: 'Loki', version: '2.x', desc: 'Log aggregation', status: 'active' },
      ],
    },
    {
      name: 'CI/CD & Quality',
      icon: '🔄',
      color: 'green',
      tools: [
        { name: 'GitHub Actions', version: '-', desc: 'CI/CD pipeline', status: 'active' },
        { name: 'Vitest', version: '1.x', desc: 'Unit testing framework', status: 'active' },
        { name: 'Playwright', version: '1.x', desc: 'E2E testing', status: 'active' },
        { name: 'Pact', version: '12.x', desc: 'Contract testing', status: 'active' },
        { name: 'ESLint', version: '9.x', desc: 'Linting (flat config)', status: 'active' },
        { name: 'Prettier', version: '3.x', desc: 'Code formatting', status: 'active' },
        { name: 'commitlint', version: '19.x', desc: 'Commit message linting', status: 'active' },
        { name: 'husky', version: '9.x', desc: 'Git hooks', status: 'active' },
      ],
    },
    {
      name: 'Security',
      icon: '🛡️',
      color: 'red',
      tools: [
        { name: 'HashiCorp Vault', version: '1.16', desc: 'Secrets management', status: 'scaffolded' },
        { name: 'Trivy', version: 'latest', desc: 'Container vulnerability scanner', status: 'active' },
        { name: 'Helmet.js', version: '7.x', desc: 'HTTP security headers', status: 'active' },
      ],
    },
  ];

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    deferred: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    scaffolded: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  const borderColorMap: Record<string, string> = {
    blue: 'border-blue-500/30',
    purple: 'border-purple-500/30',
    emerald: 'border-emerald-500/30',
    cyan: 'border-cyan-500/30',
    amber: 'border-amber-500/30',
    pink: 'border-pink-500/30',
    orange: 'border-orange-500/30',
    indigo: 'border-indigo-500/30',
    green: 'border-green-500/30',
    red: 'border-red-500/30',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🔧</span> Technology Stack
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Complete technology stack for the ABRAN SYSTEM. All choices are locked for Phase 0.
          Deferred technologies have interface scaffolding ready for future implementation.
        </p>
      </div>

      {/* Status Legend */}
      <div className="flex gap-4 flex-wrap">
        <span className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-gray-300">Active (Phase 0)</span>
        </span>
        <span className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-gray-300">Deferred (Later Phases)</span>
        </span>
        <span className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-gray-300">Scaffolded (Structure Only)</span>
        </span>
      </div>

      {/* Technology Layers */}
      <div className="space-y-4">
        {layers.map((layer) => (
          <div
            key={layer.name}
            className={`bg-gray-900 rounded-xl border ${borderColorMap[layer.color]} p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{layer.icon}</span>
              <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {layer.tools.map((tool) => (
                <div key={tool.name} className="bg-gray-950 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{tool.name}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full border ${statusColors[tool.status]}`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{tool.desc}</p>
                  <p className="text-xs text-gray-500 mt-1 font-mono">v{tool.version}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Diagram */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🏗️ Stack Architecture</h2>
        <div className="bg-gray-950 rounded-lg p-6 border border-gray-700">
          <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre font-mono leading-relaxed">
{`
┌───────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │   Web    │ │ Customer │ │ Reseller │ │  Admin   │            │
│  │ (Next.js)│ │ (Next.js)│ │ (Next.js)│ │ (Next.js)│            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
├───────────────────────────────────────────────────────────────────┤
│                          API LAYER                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              NestJS API Gateway                              │ │
│  │  Auth │ Rate Limit │ Validation │ Routing │ Swagger         │ │
│  └─────────────────────────────────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────┤
│                       BUSINESS LOGIC                              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │Identity│ │Ordering│ │Provis. │ │Life-   │ │Financ. │       │
│  │        │ │        │ │        │ │cycle   │ │        │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│  │Invent. │ │ Config │ │Provider│ │Analyt. │                  │
│  │        │ │        │ │Intel.  │ │(Phase11│                  │
│  └────────┘ └────────┘ └────────┘ └────────┘                  │
├───────────────────────────────────────────────────────────────────┤
│                        DATA LAYER                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │PostgreSQL│ │  Redis   │ │  MinIO   │ │  NATS    │           │
│  │  (Prisma)│ │  (Cache) │ │  (S3)    │ │ (Events) │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├───────────────────────────────────────────────────────────────────┤
│                    INFRASTRUCTURE                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Docker   │ │Terraform │ │  Vault   │ │  OTel    │           │
│  │ Compose  │ │ + Ansible│ │(Secrets) │ │+ Grafana │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└───────────────────────────────────────────────────────────────────┘
`}
          </pre>
        </div>
      </div>
    </div>
  );
}
