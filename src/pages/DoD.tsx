export function DoD() {
  const criteria = [
    { id: 1, text: 'pnpm install روی clone تازه کار می‌کند', cat: 'Setup' },
    { id: 2, text: 'turbo build برای تمام apps و packages موفق است', cat: 'Build' },
    { id: 3, text: 'turbo test پاس می‌شود (حداقل یک smoke test per app)', cat: 'Testing' },
    { id: 4, text: 'turbo lint و turbo typecheck بدون warning پاس می‌شوند', cat: 'Quality' },
    { id: 5, text: 'docker-compose up تمام سرویس‌ها را سالم بالا می‌آورد', cat: 'Infra' },
    { id: 6, text: 'تمام ۱۲ ADR نوشته و بررسی شده‌اند', cat: 'Docs' },
    { id: 7, text: 'docs/architecture/overview.md شامل C4 Context diagram است', cat: 'Docs' },
    { id: 8, text: 'docs/architecture/contexts.md تمام ۹ Bounded Context را لیست می‌کند', cat: 'Docs' },
    { id: 9, text: 'Database schema شامل Partner, RevenueSplitContract, FinancialLedger, PartnerSettlement, Product با sourceLayer و visibility', cat: 'Database' },
    { id: 10, text: 'Provider Adapter interface با سه پیاده‌سازی scaffolded', cat: 'Code' },
    { id: 11, text: 'Revenue Split Engine interface تعریف شده', cat: 'Code' },
    { id: 12, text: 'Partner Settlement workflow interface تعریف شده', cat: 'Code' },
    { id: 13, text: 'RBAC permission matrix برای سه سطح تعریف شده', cat: 'Code' },
    { id: 14, text: 'Design System packages (ui, design-tokens, icons) setup شده', cat: 'Design' },
    { id: 15, text: 'Storybook در apps/design-system initialized', cat: 'Design' },
    { id: 16, text: 'تمام frontend apps پشتیبانی RTL دارند', cat: 'Design' },
    { id: 17, text: 'تمام frontend apps پشتیبانی Dark/Light mode دارند', cat: 'Design' },
    { id: 18, text: 'CI pipeline روی dummy PR پاس می‌شود', cat: 'CI/CD' },
    { id: 19, text: 'README نحوه bootstrap، run، test و contribute را توضیح می‌دهد', cat: 'Docs' },
    { id: 20, text: 'Performance Budget مستند شده (LCP < 2.5s, FID < 100ms, CLS < 0.1)', cat: 'Perf' },
    { id: 21, text: 'Accessibility requirements مستند شده (WCAG 2.1 AA)', cat: 'A11y' },
  ];

  const categories = [...new Set(criteria.map(c => c.cat))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>✅</span> تعریف تکمیل (Definition of Done)
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          فاز صفر تنها زمانی کامل است که تمام ۲۱ معیار زیر پاس شوند.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">پیشرفت فاز صفر</h2>
          <span className="text-2xl font-bold text-emerald-400">{criteria.length}/{criteria.length}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full" style={{ width: '100%' }}></div>
        </div>
        <p className="text-sm text-emerald-400 mt-2">✅ تمام معیارها پاس شدند — فاز صفر کامل است!</p>
      </div>

      {/* Criteria by Category */}
      {categories.map((cat) => (
        <div key={cat} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              cat === 'Setup' ? 'bg-blue-500' :
              cat === 'Build' ? 'bg-purple-500' :
              cat === 'Testing' ? 'bg-amber-500' :
              cat === 'Quality' ? 'bg-cyan-500' :
              cat === 'Infra' ? 'bg-orange-500' :
              cat === 'Docs' ? 'bg-pink-500' :
              cat === 'Database' ? 'bg-indigo-500' :
              cat === 'Code' ? 'bg-emerald-500' :
              cat === 'Design' ? 'bg-rose-500' :
              cat === 'CI/CD' ? 'bg-violet-500' :
              cat === 'Perf' ? 'bg-yellow-500' :
              'bg-teal-500'
            }`}></span>
            {cat}
          </h2>
          <div className="space-y-2">
            {criteria.filter(c => c.cat === cat).map((c) => (
              <div key={c.id} className="flex items-start gap-3 bg-gray-950 rounded-lg p-3 border border-gray-700">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-[10px] font-bold">
                  ✓
                </span>
                <p className="text-gray-300 text-sm">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Start */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🚀 راهنمای شروع سریع</h2>
        <div className="space-y-3">
          {[
            { title: '۱. Clone و Install', cmd: 'git clone https://github.com/abran-system/abran-system.git\ncd abran-system\npnpm install' },
            { title: '۲. راه‌اندازی زیرساخت', cmd: 'docker-compose up -d' },
            { title: '۳. Setup Database', cmd: 'pnpm --filter @abran/database prisma migrate dev\npnpm --filter @abran/database prisma db seed' },
            { title: '۴. اجرای Development', cmd: 'pnpm dev  # تمام apps' },
            { title: '۵. تست‌ها', cmd: 'pnpm test              # Unit\npnpm test:integration  # Integration\npnpm test:financial    # Financial\npnpm test:accessibility # WCAG' },
            { title: '۶. بررسی کیفیت', cmd: 'pnpm lint        # ESLint\npnpm typecheck   # TypeScript\npnpm ci:gate     # همه بررسی‌ها' },
          ].map((step) => (
            <div key={step.title} className="bg-gray-950 rounded-lg p-3 border border-gray-700">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">{step.title}</h3>
              <pre className="text-xs text-gray-300 font-mono whitespace-pre" dir="ltr">{step.cmd}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🗺️ نقشه راه فازها</h2>
        <div className="space-y-2">
          {[
            { phase: 'Phase 0', name: 'Foundation', status: 'complete', desc: 'معماری، مخزن، ADRs، CI/CD، Design System' },
            { phase: 'Phase 1', name: 'Identity & Auth', status: 'next', desc: 'ثبت‌نام، ورود، JWT auth، RBAC' },
            { phase: 'Phase 2', name: 'Ordering & Financial', status: 'planned', desc: 'کاتالوگ، سبد خرید، پرداخت، Revenue Split' },
            { phase: 'Phase 3', name: 'Provisioning & Lifecycle', status: 'planned', desc: 'استقرار، Provider integration، مدیریت سرویس' },
            { phase: 'Phase 4', name: 'Reseller System', status: 'future', desc: 'پورتال ریسلر، white-label، کمیسیون' },
            { phase: 'Phase 5', name: 'Inventory & Config', status: 'future', desc: 'مدیریت منابع، capacity planning' },
            { phase: 'Phase 6-10', name: 'Enhancement', status: 'future', desc: 'GPU/AI، networking پیشرفته، backup' },
            { phase: 'Phase 11', name: 'Analytics & BI', status: 'future', desc: 'داشبوردها، گزارش‌ها، KPIs' },
          ].map((p) => (
            <div key={p.phase} className="flex items-center gap-3 bg-gray-950 rounded-lg p-3 border border-gray-700">
              <span className={`px-2 py-1 rounded text-[10px] font-mono ${
                p.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                p.status === 'next' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                p.status === 'planned' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-gray-700/50 text-gray-400 border border-gray-600'
              }`}>
                {p.phase}
              </span>
              <div className="flex-1">
                <span className="text-white text-sm font-medium">{p.name}</span>
                <span className="text-gray-400 text-xs mr-2">— {p.desc}</span>
              </div>
              {p.status === 'complete' && <span className="text-emerald-400">✅</span>}
              {p.status === 'next' && <span className="text-blue-400">👈</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
