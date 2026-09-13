export function Repository() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>📁</span> ساختار مخزن
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          ساختار monorepo با Turborepo + pnpm workspaces. جداسازی واضح بین apps، modules، packages، infrastructure و documentation.
        </p>
      </div>

      {/* Tree */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">نمای درختی</h2>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs font-mono leading-relaxed" dir="ltr">
            <span className="text-white font-bold">abran-system/</span>{'\n'}
            <span className="text-blue-400">├── .github/workflows/</span>{'\n'}
            <span className="text-gray-400">│   ├── ci.yml</span>{'\n'}
            <span className="text-gray-400">│   ├── deploy-staging.yml</span>{'\n'}
            <span className="text-gray-400">│   └── deploy-prod.yml</span>{'\n'}
            <span className="text-blue-400">├── apps/</span>{'\n'}
            <span className="text-emerald-400">│   ├── web/                    # Public site (Next.js)</span>{'\n'}
            <span className="text-emerald-400">│   ├── customer-portal/        # Customer dashboard</span>{'\n'}
            <span className="text-emerald-400">│   ├── reseller-portal/        # Reseller dashboard</span>{'\n'}
            <span className="text-emerald-400">│   ├── admin-portal/           # Admin + BI dashboards</span>{'\n'}
            <span className="text-emerald-400">│   ├── api/                    # NestJS API Gateway</span>{'\n'}
            <span className="text-emerald-400">│   └── design-system/          # Storybook</span>{'\n'}
            <span className="text-blue-400">├── modules/</span>{'\n'}
            <span className="text-amber-400">│   ├── identity/               # + RBAC</span>{'\n'}
            <span className="text-amber-400">│   ├── ordering/               # + Visibility</span>{'\n'}
            <span className="text-amber-400">│   ├── provisioning/           # + Provider Adapters</span>{'\n'}
            <span className="text-amber-400">│   ├── lifecycle/</span>{'\n'}
            <span className="text-amber-400">│   ├── financial/              # + Revenue Split</span>{'\n'}
            <span className="text-amber-400">│   ├── inventory/</span>{'\n'}
            <span className="text-amber-400">│   ├── config/</span>{'\n'}
            <span className="text-amber-400">│   ├── provider-intelligence/</span>{'\n'}
            <span className="text-amber-400">│   └── analytics/              # + BI</span>{'\n'}
            <span className="text-blue-400">├── packages/</span>{'\n'}
            <span className="text-purple-400">│   ├── contracts/              # Shared DTOs</span>{'\n'}
            <span className="text-purple-400">│   ├── events/                 # Event schemas</span>{'\n'}
            <span className="text-purple-400">│   ├── auth/                   # Keycloak adapter</span>{'\n'}
            <span className="text-purple-400">│   ├── database/               # Prisma + migrations</span>{'\n'}
            <span className="text-purple-400">│   ├── observability/          # OpenTelemetry</span>{'\n'}
            <span className="text-purple-400">│   ├── ui/                     # shadcn components</span>{'\n'}
            <span className="text-purple-400">│   ├── design-tokens/          # Colors, typography</span>{'\n'}
            <span className="text-purple-400">│   └── icons/                  # Lucide-based</span>{'\n'}
            <span className="text-blue-400">├── infrastructure/</span>{'\n'}
            <span className="text-gray-400">│   ├── terraform/</span>{'\n'}
            <span className="text-gray-400">│   ├── kubernetes/</span>{'\n'}
            <span className="text-gray-400">│   ├── helm/</span>{'\n'}
            <span className="text-gray-400">│   └── ansible/</span>{'\n'}
            <span className="text-blue-400">├── docs/</span>{'\n'}
            <span className="text-gray-400">│   ├── architecture/         # C4 diagrams</span>{'\n'}
            <span className="text-gray-400">│   ├── adr/                  # 12 ADRs</span>{'\n'}
            <span className="text-gray-400">│   ├── design/               # Brand, RTL</span>{'\n'}
            <span className="text-gray-400">│   └── financial/            # Revenue models</span>{'\n'}
            <span className="text-blue-400">├── tests/</span>{'\n'}
            <span className="text-gray-400">│   ├── unit/</span>{'\n'}
            <span className="text-gray-400">│   ├── integration/</span>{'\n'}
            <span className="text-gray-400">│   ├── contract/</span>{'\n'}
            <span className="text-gray-400">│   ├── e2e/</span>{'\n'}
            <span className="text-gray-400">│   ├── accessibility/        # WCAG tests</span>{'\n'}
            <span className="text-gray-400">│   ├── performance/          # Lighthouse</span>{'\n'}
            <span className="text-gray-400">│   └── financial/            # Revenue split</span>{'\n'}
            <span className="text-gray-400">├── package.json</span>{'\n'}
            <span className="text-gray-400">├── turbo.json</span>{'\n'}
            <span className="text-gray-400">├── tsconfig.base.json</span>{'\n'}
            <span className="text-gray-400">├── docker-compose.yml</span>{'\n'}
            <span className="text-gray-400">├── pnpm-workspace.yaml</span>{'\n'}
            <span className="text-gray-400">└── README.md</span>
          </pre>
        </div>
      </div>

      {/* Key Config Files */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>📦</span> package.json (Root)
          </h3>
          <div className="bg-gray-950 rounded-lg p-3 border border-gray-700 overflow-x-auto">
            <pre className="text-[11px] text-gray-300 font-mono" dir="ltr">
{`{
  "name": "abran-system",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "ci:gate": "turbo run lint typecheck test build"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0",
    "eslint": "^9.0.0",
    "prettier": "^3.2.0",
    "vitest": "^1.5.0"
  }
}`}
            </pre>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <span>🐳</span> docker-compose.yml
          </h3>
          <div className="bg-gray-950 rounded-lg p-3 border border-gray-700 overflow-x-auto">
            <pre className="text-[11px] text-gray-300 font-mono" dir="ltr">
{`services:
  postgres:
    image: postgres:16-alpine
    ports: ['5432:5432']
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready']
  
  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
  
  minio:
    image: minio/minio:latest
    ports: ['9000:9000', '9001:9001']
  
  nats:
    image: nats:2.10-alpine
    command: ['--jetstream']
    ports: ['4222:4222']
  
  clickhouse:
    image: clickhouse/clickhouse-server
    ports: ['8123:8123', '9000:9000']`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
