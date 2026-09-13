export function Contexts() {
  const contexts = [
    { name: 'Identity', icon: '🔐', color: 'blue', desc: 'احراز هویت، مجوزدهی، RBAC سه‌سطحی', entities: ['User', 'Role', 'Permission', 'Session', 'APIKey'] },
    { name: 'Ordering', icon: '🛒', color: 'purple', desc: 'کاتالوگ، سبد خرید، سفارش، Visibility Toggle', entities: ['Order', 'Cart', 'Product', 'PricingSnapshot'] },
    { name: 'Provisioning', icon: '⚡', color: 'amber', desc: 'استقرار سرویس، Provider Adapters، انتخاب هوشمند', entities: ['ProvisionRequest', 'ProviderTask', 'DeploymentLog'] },
    { name: 'Lifecycle', icon: '🔄', color: 'emerald', desc: 'مدیریت سرویس فعال، ارتقا، تمدید، تعلیق', entities: ['Service', 'ServiceState', 'RenewalSchedule'] },
    { name: 'Financial', icon: '💰', color: 'green', desc: 'کیف پول، پرداخت، Revenue Split، Settlement', entities: ['Wallet', 'Transaction', 'Ledger', 'Settlement'] },
    { name: 'Inventory', icon: '📦', color: 'cyan', desc: 'موجودی منابع، ظرفیت، همگام‌سازی با ارائه‌دهندگان', entities: ['ResourcePool', 'Availability', 'Capacity'] },
    { name: 'Config', icon: '⚙️', color: 'orange', desc: 'تنظیمات سیستم، Feature Flags، Service Plans', entities: ['ServicePlan', 'FeatureFlag', 'SystemConfig'] },
    { name: 'Provider-Intelligence', icon: '🧠', color: 'pink', desc: 'مانیتورینگ ارائه‌دهندگان، بهینه‌سازی هزینه', entities: ['ProviderHealth', 'CostAnalysis', 'RoutingRule'] },
    { name: 'Analytics', icon: '📊', color: 'indigo', desc: 'BI & Analytics، داشبوردها، گزارش‌ها', entities: ['Dashboard', 'Report', 'UsageMetric', 'KPI'] },
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
          <span>🧩</span> محدوده‌های مرزی (Bounded Contexts)
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          سیستم ABRAN از ۹ محدوده مرزی مجزا تشکیل شده. هر محدوده داده‌ها، API و رویدادهای خود را دارد.
          ارتباط بین محدوده‌ها فقط از طریق contracts و events مجاز است.
        </p>
      </div>

      {/* Context Map */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">نقشه ارتباطات</h2>
        <div className="bg-gray-950 rounded-lg p-6 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 whitespace-pre font-mono leading-relaxed" dir="ltr">
{`
┌─────────────────────────────────────────────────────────────────┐
│                    BOUNDED CONTEXT MAP                           │
│                                                                  │
│  ┌──────────┐    events    ┌──────────┐    events   ┌────────┐ │
│  │ Identity │─────────────▶│ Ordering │────────────▶│Provis. │ │
│  │  + RBAC  │              │+ Visibility│           │+Adapters│ │
│  └──────────┘              └────┬─────┘            └───┬────┘ │
│       │                         │                      │       │
│       │ queries                 │ commands             │ events│
│       ▼                         ▼                      ▼       │
│  ┌──────────┐              ┌──────────┐           ┌────────┐  │
│  │  Config  │◀─────────────│Financial │           │Lifecycle│  │
│  │          │   reads      │+ Revenue │           │         │  │
│  └────┬─────┘              │  Split   │           └───┬────┘  │
│       │                    └──────────┘               │        │
│       │ provides                                       │triggers│
│       ▼                                               ▼        │
│  ┌──────────┐              ┌──────────┐           ┌────────┐  │
│  │Inventory │              │Provider- │           │Analytics│  │
│  │          │              │Intelligence│          │  + BI   │  │
│  └──────────┘              └──────────┘           └────────┘  │
│                                                                  │
│  ─── events (async)    ─── queries (sync via contracts)         │
│  ──▶ commands (sync)   ◀── reads (config lookup)                │
└─────────────────────────────────────────────────────────────────┘
`}
          </pre>
        </div>
      </div>

      {/* Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contexts.map((ctx) => (
          <div key={ctx.name} className={`rounded-xl border p-5 ${colorMap[ctx.color]} transition-all hover:scale-[1.02]`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{ctx.icon}</span>
              <div>
                <h3 className={`font-bold ${textColorMap[ctx.color]}`}>{ctx.name}</h3>
                <p className="text-gray-400 text-xs">{ctx.desc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ctx.entities.map((e) => (
                <span key={e} className="px-2 py-0.5 bg-gray-800/50 rounded text-[10px] text-gray-300 border border-gray-700">
                  {e}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Communication Rules */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📏 قوانین ارتباط بین محدوده‌ها</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">مجاز ✓</h3>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>• رویدادهای ناهمگام از طریق NATS JetStream</li>
              <li>• کوئری‌های همگام از طریق shared contracts</li>
              <li>• جستجوی تنظیمات از Config context</li>
              <li>• Event sourcing برای audit trail</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-2">ممنوع ✗</h3>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>• دسترسی مستقیم به دیتابیس بین محدوده‌ها</li>
              <li>• جداول دیتابیس مشترک</li>
              <li>• تراکنش‌های همگام بین محدوده‌ای</li>
              <li>• import کد داخلی ماژول‌های دیگر</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
