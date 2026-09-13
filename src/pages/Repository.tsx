import { FolderTree } from 'lucide-react';

export function Repository() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <FolderTree className="w-10 h-10 text-cyan-400" />
          ساختار مخزن
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          ساختار monorepo با Turborepo + pnpm workspaces.
        </p>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">نمای درختی</h2>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
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
            <span className="text-emerald-400">│   ├── admin-portal/           # Admin + BI</span>{'\n'}
            <span className="text-emerald-400">│   ├── api/                    # NestJS API</span>{'\n'}
            <span className="text-emerald-400">│   └── design-system/          # Storybook</span>{'\n'}
            <span className="text-blue-400">├── modules/</span>{'\n'}
            <span className="text-amber-400">│   ├── identity/               # + RBAC</span>{'\n'}
            <span className="text-amber-400">│   ├── ordering/               # + Visibility</span>{'\n'}
            <span className="text-amber-400">│   ├── provisioning/           # + Adapters</span>{'\n'}
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
            <span className="text-purple-400">│   ├── database/               # Prisma</span>{'\n'}
            <span className="text-purple-400">│   ├── observability/          # OpenTelemetry</span>{'\n'}
            <span className="text-purple-400">│   ├── ui/                     # shadcn</span>{'\n'}
            <span className="text-purple-400">│   ├── design-tokens/          # Colors, typography</span>{'\n'}
            <span className="text-purple-400">│   └── icons/                  # Lucide</span>{'\n'}
            <span className="text-blue-400">├── infrastructure/</span>{'\n'}
            <span className="text-gray-400">│   ├── terraform/</span>{'\n'}
            <span className="text-gray-400">│   ├── kubernetes/</span>{'\n'}
            <span className="text-gray-400">│   ├── helm/</span>{'\n'}
            <span className="text-gray-400">│   └── ansible/</span>{'\n'}
            <span className="text-blue-400">├── docs/</span>{'\n'}
            <span className="text-gray-400">│   ├── architecture/</span>{'\n'}
            <span className="text-gray-400">│   ├── adr/                  # 12 ADRs</span>{'\n'}
            <span className="text-gray-400">│   ├── design/</span>{'\n'}
            <span className="text-gray-400">│   └── financial/</span>{'\n'}
            <span className="text-gray-400">├── package.json</span>{'\n'}
            <span className="text-gray-400">├── turbo.json</span>{'\n'}
            <span className="text-gray-400">├── docker-compose.yml</span>{'\n'}
            <span className="text-gray-400">└── README.md</span>
          </pre>
        </div>
      </div>
    </div>
  );
}
