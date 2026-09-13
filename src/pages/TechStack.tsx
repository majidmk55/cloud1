export function TechStack() {
  const layers = [
    {
      name: 'Monorepo & Build',
      icon: '📦',
      tools: [
        { name: 'Turborepo', version: '2.x', status: 'active' },
        { name: 'pnpm', version: '9.x', status: 'active' },
        { name: 'TypeScript', version: '5.4+', status: 'active' },
      ],
    },
    {
      name: 'Frontend',
      icon: '🎨',
      tools: [
        { name: 'Next.js', version: '14+ (App Router)', status: 'active' },
        { name: 'React', version: '18+', status: 'active' },
        { name: 'Tailwind CSS', version: '3.x', status: 'active' },
        { name: 'shadcn/ui', version: 'latest', status: 'active' },
        { name: 'Framer Motion', version: '11.x', status: 'active' },
        { name: 'Lucide', version: 'latest', status: 'active' },
        { name: 'Apache ECharts', version: '5.x', status: 'active' },
      ],
    },
    {
      name: 'Backend',
      icon: '⚙️',
      tools: [
        { name: 'NestJS', version: '10.x', status: 'active' },
        { name: 'Node.js', version: '20 LTS', status: 'active' },
        { name: 'Prisma', version: '5.x', status: 'active' },
      ],
    },
    {
      name: 'Database & Storage',
      icon: '🗄️',
      tools: [
        { name: 'PostgreSQL', version: '16', status: 'active' },
        { name: 'Redis', version: '7.x', status: 'active' },
        { name: 'MinIO', version: 'latest', status: 'active' },
        { name: 'ClickHouse', version: '24.x', status: 'active' },
      ],
    },
    {
      name: 'Messaging & Workflow',
      icon: '📨',
      tools: [
        { name: 'NATS JetStream', version: '2.10', status: 'deferred' },
        { name: 'Temporal', version: '1.x', status: 'deferred' },
        { name: 'BullMQ', version: '5.x', status: 'active' },
      ],
    },
    {
      name: 'Authentication',
      icon: '🔐',
      tools: [
        { name: 'Keycloak', version: '24.x', status: 'deferred' },
        { name: 'Custom JWT', version: '-', status: 'active' },
      ],
    },
    {
      name: 'Infrastructure',
      icon: '🏗️',
      tools: [
        { name: 'Docker', version: '24+', status: 'active' },
        { name: 'Docker Compose', version: '2.x', status: 'active' },
        { name: 'Kubernetes', version: '1.29', status: 'deferred' },
        { name: 'Terraform', version: '1.7+', status: 'scaffolded' },
        { name: 'Ansible', version: '2.16', status: 'scaffolded' },
        { name: 'HashiCorp Vault', version: '1.16', status: 'scaffolded' },
      ],
    },
    {
      name: 'Observability',
      icon: '📊',
      tools: [
        { name: 'OpenTelemetry', version: '1.x', status: 'active' },
        { name: 'Prometheus', version: '2.x', status: 'active' },
        { name: 'Grafana', version: '10.x', status: 'active' },
        { name: 'Loki', version: '2.x', status: 'active' },
      ],
    },
    {
      name: 'CI/CD & Quality',
      icon: '🔄',
      tools: [
        { name: 'GitHub Actions', version: '-', status: 'active' },
        { name: 'Vitest', version: '1.x', status: 'active' },
        { name: 'Playwright', version: '1.x', status: 'active' },
        { name: 'Pact', version: '12.x', status: 'active' },
        { name: 'axe-core', version: '4.x', status: 'active' },
        { name: 'Lighthouse CI', version: 'latest', status: 'active' },
        { name: 'Storybook', version: '8.x', status: 'active' },
      ],
    },
  ];

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    deferred: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    scaffolded: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🔧</span> پشته فناوری
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          تمام فناوری‌های انتخاب‌شده برای ABRAN SYSTEM. تکنولوژی‌های deferred در فازهای بعدی پیاده‌سازی می‌شوند.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        <span className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span className="text-gray-300">Active (فاز ۰)</span>
        </span>
        <span className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span className="text-gray-300">Deferred (فازهای بعد)</span>
        </span>
        <span className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
          <span className="text-gray-300">Scaffolded (فقط ساختار)</span>
        </span>
      </div>

      {/* Layers */}
      <div className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.name} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{layer.icon}</span>
              <h3 className="text-white font-bold">{layer.name}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {layer.tools.map((tool) => (
                <div key={tool.name} className="bg-gray-950 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">{tool.name}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] rounded-full border ${statusColors[tool.status]}`}>
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono" dir="ltr">v{tool.version}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
