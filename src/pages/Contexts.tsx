export function Contexts() {
  const contexts = [
    {
      name: 'Identity',
      icon: '🔐',
      color: 'blue',
      responsibility: 'User registration, authentication, authorization, profiles, sessions, and role management.',
      boundaries: 'Owns all user data. Exposes user identity via contracts. Does not access order or financial data directly.',
      entities: ['User', 'Session', 'Role', 'Permission', 'APIKey', 'MFADevice'],
      apis: ['POST /auth/login', 'POST /auth/register', 'GET /users/:id', 'PUT /users/:id/profile'],
    },
    {
      name: 'Ordering',
      icon: '🛒',
      color: 'purple',
      responsibility: 'Service catalog browsing, cart management, order creation, checkout, and order lifecycle.',
      boundaries: 'Owns orders, line items, and pricing snapshots. Calls Financial for payment. Calls Provisioning after payment confirmed.',
      entities: ['Order', 'OrderItem', 'Cart', 'PricingSnapshot', 'Coupon', 'Invoice'],
      apis: ['POST /orders', 'GET /orders/:id', 'POST /cart/add', 'POST /checkout'],
    },
    {
      name: 'Provisioning',
      icon: '⚡',
      color: 'amber',
      responsibility: 'Service provisioning, provider communication, resource allocation, and deployment orchestration.',
      boundaries: 'Owns provisioning state machines. Communicates with external providers. Does not handle billing.',
      entities: ['ProvisionRequest', 'ProvisionResult', 'ProviderTask', 'DeploymentLog'],
      apis: ['POST /provision/start', 'GET /provision/:id/status', 'POST /provision/:id/cancel'],
    },
    {
      name: 'Lifecycle',
      icon: '🔄',
      color: 'emerald',
      responsibility: 'Active service management — upgrades, downgrades, renewals, suspensions, terminations.',
      boundaries: 'Owns active service state. Triggers Financial for renewals. Triggers Provisioning for changes.',
      entities: ['Service', 'ServiceState', 'RenewalSchedule', 'UpgradeRequest', 'SuspensionRecord'],
      apis: ['GET /services', 'PUT /services/:id/upgrade', 'POST /services/:id/suspend', 'POST /services/:id/terminate'],
    },
    {
      name: 'Financial',
      icon: '💰',
      color: 'green',
      responsibility: 'Invoicing, payments, wallet/credit, tax calculation, refunds, and financial reconciliation.',
      boundaries: 'Strong consistency required. Owns all monetary data. Never allows eventual consistency for balances.',
      entities: ['Wallet', 'Transaction', 'Payment', 'Refund', 'TaxRecord', 'FinancialLedger'],
      apis: ['GET /wallet/balance', 'POST /wallet/topup', 'GET /invoices', 'POST /payments'],
    },
    {
      name: 'Inventory',
      icon: '📦',
      color: 'cyan',
      responsibility: 'Resource availability, capacity planning, provider inventory sync, and stock management.',
      boundaries: 'Eventually consistent. Syncs with providers periodically. Serves availability queries.',
      entities: ['ResourcePool', 'Availability', 'CapacityPlan', 'ProviderInventory', 'StockAlert'],
      apis: ['GET /inventory/available', 'GET /inventory/:type/capacity', 'POST /inventory/sync'],
    },
    {
      name: 'Config',
      icon: '⚙️',
      color: 'orange',
      responsibility: 'System configuration, feature flags, service plans, pricing rules, and operational settings.',
      boundaries: 'Owns all configuration data. Provides config to other contexts via contracts.',
      entities: ['ServicePlan', 'PricingRule', 'FeatureFlag', 'SystemConfig', 'RegionConfig'],
      apis: ['GET /config/plans', 'GET /config/features', 'PUT /config/:key'],
    },
    {
      name: 'Provider-Intelligence',
      icon: '🧠',
      color: 'pink',
      responsibility: 'Provider performance monitoring, cost optimization, health checks, and intelligent routing.',
      boundaries: 'Monitors external providers. Provides recommendations to Provisioning. Does not make provisioning decisions.',
      entities: ['ProviderHealth', 'PerformanceMetric', 'CostAnalysis', 'RoutingRule', 'ProviderScore'],
      apis: ['GET /providers/health', 'GET /providers/:id/metrics', 'GET /providers/recommendations'],
    },
    {
      name: 'Analytics',
      icon: '📊',
      color: 'indigo',
      responsibility: 'BI & Analytics — dashboards, reports, usage analytics, and business intelligence.',
      boundaries: 'Read-only consumer of events from all contexts. Deferred to Phase 11. No write access to other contexts.',
      entities: ['Dashboard', 'Report', 'UsageMetric', 'KPI', 'AnalyticsEvent'],
      apis: ['GET /analytics/dashboard', 'GET /analytics/reports', 'GET /analytics/usage'],
    },
  ];

  const colorMap: Record<string, string> = {
    blue: 'border-blue-500/30 bg-blue-500/5',
    purple: 'border-purple-500/30 bg-purple-500/5',
    amber: 'border-amber-500/30 bg-amber-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
    green: 'border-green-500/30 bg-green-500/5',
    cyan: 'border-cyan-500/30 bg-cyan-500/5',
    orange: 'border-orange-500/30 bg-orange-500/5',
    pink: 'border-pink-500/30 bg-pink-500/5',
    indigo: 'border-indigo-500/30 bg-indigo-500/5',
  };

  const textColorMap: Record<string, string> = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    green: 'text-green-400',
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
    pink: 'text-pink-400',
    indigo: 'text-indigo-400',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🧩</span> Bounded Contexts
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          The ABRAN SYSTEM is organized into 9 hard Bounded Contexts. Each context owns its data,
          exposes APIs via shared contracts, and communicates asynchronously via events.
          No direct database access across context boundaries.
        </p>
      </div>

      {/* Context Map Diagram */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Context Map — Communication Patterns</h2>
        <div className="bg-gray-950 rounded-lg p-6 border border-gray-700">
          <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre font-mono leading-relaxed">
{`
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                          BOUNDED CONTEXT MAP                                │
  │                                                                             │
  │   ┌──────────┐    events     ┌──────────┐    events    ┌──────────────┐    │
  │   │ Identity │──────────────▶│ Ordering │─────────────▶│ Provisioning │    │
  │   └──────────┘               └────┬─────┘              └──────┬───────┘    │
  │        │                          │                           │             │
  │        │ queries                  │ commands                  │ events      │
  │        ▼                          ▼                           ▼             │
  │   ┌──────────┐              ┌──────────┐              ┌──────────────┐    │
  │   │  Config  │◀─────────────│Financial │              │  Lifecycle   │    │
  │   └────┬─────┘   reads      └──────────┘              └──────┬───────┘    │
  │        │                                                      │             │
  │        │ provides                                             │ triggers    │
  │        ▼                                                      ▼             │
  │   ┌──────────┐              ┌──────────────┐          ┌──────────────┐    │
  │   │Inventory │              │  Provider-   │          │  Analytics   │    │
  │   └──────────┘              │ Intelligence │          │  (Phase 11)  │    │
  │                             └──────────────┘          └──────────────┘    │
  │                                                                             │
  │   Communication:                                                            │
  │   ─── events (async)    ─── queries (sync via contracts)                   │
  │   ──▶ commands (sync)   ◀── reads (config lookup)                          │
  └─────────────────────────────────────────────────────────────────────────────┘
`}
          </pre>
        </div>
      </div>

      {/* Context Cards */}
      <div className="space-y-6">
        {contexts.map((ctx) => (
          <div
            key={ctx.name}
            className={`rounded-xl border p-6 ${colorMap[ctx.color]} transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{ctx.icon}</span>
              <div>
                <h3 className={`text-xl font-bold ${textColorMap[ctx.color]}`}>{ctx.name}</h3>
                <p className="text-gray-400 text-sm">{ctx.responsibility}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Boundary Rules</h4>
                <p className="text-sm text-gray-300">{ctx.boundaries}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Entities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {ctx.entities.map((e) => (
                    <span key={e} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300 border border-gray-700">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">API Surface</h4>
              <div className="flex flex-wrap gap-2">
                {ctx.apis.map((api) => (
                  <code key={api} className="px-2 py-1 bg-gray-900 rounded text-xs text-gray-400 border border-gray-700 font-mono">
                    {api}
                  </code>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Communication Rules */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📏 Inter-Context Communication Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-blue-400">Allowed Patterns</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Async events via NATS JetStream</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Sync queries via shared contracts (REST/gRPC)</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Config lookups from Config context</li>
              <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Event sourcing for audit trail</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-red-400">Forbidden Patterns</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Direct database access across contexts</li>
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Shared database tables</li>
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Synchronous cross-context transactions</li>
              <li className="flex items-start gap-2"><span className="text-red-400">✗</span> Import of internal module code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
