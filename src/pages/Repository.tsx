export function Repository() {
  const tree = [
    { path: 'abran-system/', type: 'root', children: true },
    { path: '├── .github/', type: 'dir', children: true },
    { path: '│   ├── workflows/', type: 'dir', children: true },
    { path: '│   │   ├── ci.yml', type: 'file' },
    { path: '│   │   ├── deploy-staging.yml', type: 'file' },
    { path: '│   │   └── deploy-prod.yml', type: 'file' },
    { path: '│   ├── CODEOWNERS', type: 'file' },
    { path: '│   ├── PULL_REQUEST_TEMPLATE.md', type: 'file' },
    { path: '│   └── ISSUE_TEMPLATE/', type: 'dir', children: true },
    { path: '│       ├── bug_report.md', type: 'file' },
    { path: '│       └── feature_request.md', type: 'file' },
    { path: '├── apps/', type: 'dir', children: true },
    { path: '│   ├── web/                    # Public site (Next.js)', type: 'app' },
    { path: '│   ├── customer-portal/        # Customer dashboard (Next.js)', type: 'app' },
    { path: '│   ├── reseller-portal/        # Reseller dashboard (Next.js)', type: 'app' },
    { path: '│   ├── admin-portal/           # Admin dashboard (Next.js)', type: 'app' },
    { path: '│   └── api/                    # NestJS API Gateway', type: 'app' },
    { path: '├── modules/', type: 'dir', children: true },
    { path: '│   ├── identity/', type: 'module' },
    { path: '│   ├── ordering/', type: 'module' },
    { path: '│   ├── provisioning/', type: 'module' },
    { path: '│   ├── lifecycle/', type: 'module' },
    { path: '│   ├── financial/', type: 'module' },
    { path: '│   ├── inventory/', type: 'module' },
    { path: '│   ├── config/', type: 'module' },
    { path: '│   ├── provider-intelligence/', type: 'module' },
    { path: '│   └── analytics/', type: 'module' },
    { path: '├── packages/', type: 'dir', children: true },
    { path: '│   ├── contracts/              # Shared DTOs / API contracts', type: 'pkg' },
    { path: '│   ├── events/                 # Event schemas', type: 'pkg' },
    { path: '│   ├── auth/                   # Auth adapters', type: 'pkg' },
    { path: '│   ├── database/               # Prisma client + migrations', type: 'pkg' },
    { path: '│   ├── observability/          # OTel setup', type: 'pkg' },
    { path: '│   ├── ui/                     # Shared UI components', type: 'pkg' },
    { path: '│   └── config/                 # Shared TS/ESLint configs', type: 'pkg' },
    { path: '├── infrastructure/', type: 'dir', children: true },
    { path: '│   ├── terraform/', type: 'dir' },
    { path: '│   ├── kubernetes/', type: 'dir' },
    { path: '│   ├── helm/', type: 'dir' },
    { path: '│   └── ansible/', type: 'dir' },
    { path: '├── docs/', type: 'dir', children: true },
    { path: '│   ├── architecture/', type: 'dir' },
    { path: '│   ├── adr/', type: 'dir' },
    { path: '│   ├── api/', type: 'dir' },
    { path: '│   ├── events/', type: 'dir' },
    { path: '│   └── security/', type: 'dir' },
    { path: '├── tests/', type: 'dir', children: true },
    { path: '│   ├── unit/', type: 'dir' },
    { path: '│   ├── integration/', type: 'dir' },
    { path: '│   ├── contract/', type: 'dir' },
    { path: '│   └── e2e/', type: 'dir' },
    { path: '├── .gitignore', type: 'file' },
    { path: '├── .nvmrc', type: 'file' },
    { path: '├── .npmrc', type: 'file' },
    { path: '├── .editorconfig', type: 'file' },
    { path: '├── turbo.json', type: 'file' },
    { path: '├── pnpm-workspace.yaml', type: 'file' },
    { path: '├── package.json', type: 'file' },
    { path: '├── tsconfig.base.json', type: 'file' },
    { path: '├── docker-compose.yml', type: 'file' },
    { path: '├── Dockerfile.api', type: 'file' },
    { path: '├── Dockerfile.web', type: 'file' },
    { path: '├── Makefile', type: 'file' },
    { path: '├── README.md', type: 'file' },
    { path: '├── CONTRIBUTING.md', type: 'file' },
    { path: '├── LICENSE', type: 'file' },
    { path: '└── CHANGELOG.md', type: 'file' },
  ];

  const getColor = (type: string) => {
    switch (type) {
      case 'root': return 'text-white font-bold';
      case 'dir': return 'text-blue-400';
      case 'file': return 'text-gray-400';
      case 'app': return 'text-emerald-400';
      case 'module': return 'text-amber-400';
      case 'pkg': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>📁</span> Repository Structure
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          The ABRAN SYSTEM monorepo organized with Turborepo + pnpm workspaces.
          Clear separation between apps, modules, packages, infrastructure, and documentation.
        </p>
      </div>

      {/* Tree View */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Directory Tree</h2>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            {tree.map((item, i) => (
              <div key={i} className={getColor(item.type)}>
                {item.path}
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* Key Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">📦 package.json (Root)</h3>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`{
  "name": "abran-system",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "format": "prettier --write .",
    "typecheck": "turbo typecheck",
    "ci:gate": "turbo lint typecheck test build"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.2.0",
    "husky": "^9.0.0",
    "commitlint": "^19.0.0",
    "vitest": "^1.5.0"
  }
}`}
            </pre>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">⚡ turbo.json</h3>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {
      "dependsOn": []
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    }
  }
}`}
            </pre>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">🔧 tsconfig.base.json</h3>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "incremental": true,
    "paths": {
      "@abran/contracts": ["./packages/contracts/src"],
      "@abran/events": ["./packages/events/src"],
      "@abran/auth": ["./packages/auth/src"],
      "@abran/database": ["./packages/database/src"],
      "@abran/observability": ["./packages/observability/src"],
      "@abran/ui": ["./packages/ui/src"],
      "@abran/config": ["./packages/config/src"]
    }
  },
  "exclude": ["node_modules"]
}`}
            </pre>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">🐳 docker-compose.yml</h3>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: abran_dev
      POSTGRES_USER: abran
      POSTGRES_PASSWORD: dev_password
    ports: ['5432:5432']
    volumes: ['pgdata:/var/lib/postgresql/data']
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U abran']
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports: ['9000:9000', '9001:9001']
    volumes: ['miniodata:/data']

  nats:
    image: nats:2.10-alpine
    command: ['--jetstream', '--store_dir=/data']
    ports: ['4222:4222', '8222:8222']
    volumes: ['natsdata:/data']
    profiles: ['full']

volumes:
  pgdata:
  miniodata:
  natsdata:`}
            </pre>
          </div>
        </div>
      </div>

      {/* Workspace Packages */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📦 Workspace Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: '@abran/contracts', desc: 'Shared DTOs, API request/response types', color: 'purple' },
            { name: '@abran/events', desc: 'Event schemas, versioning, validation', color: 'blue' },
            { name: '@abran/auth', desc: 'Auth adapter interface + JWT impl', color: 'emerald' },
            { name: '@abran/database', desc: 'Prisma client, migrations, seeds', color: 'cyan' },
            { name: '@abran/observability', desc: 'OpenTelemetry init, tracing, metrics', color: 'amber' },
            { name: '@abran/ui', desc: 'Shared UI components (shadcn-ui)', color: 'pink' },
            { name: '@abran/config', desc: 'Shared TypeScript + ESLint configs', color: 'orange' },
          ].map((pkg) => (
            <div key={pkg.name} className="bg-gray-950 rounded-lg p-4 border border-gray-700">
              <code className="text-sm text-blue-300 font-mono">{pkg.name}</code>
              <p className="text-xs text-gray-400 mt-1">{pkg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
