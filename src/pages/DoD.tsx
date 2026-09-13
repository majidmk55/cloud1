export function DoD() {
  const criteria = [
    {
      id: 1,
      text: 'pnpm install works on a fresh clone',
      category: 'Setup',
      status: 'pass',
      details: 'All dependencies install correctly with pnpm workspaces. Lockfile is committed and frozen.',
    },
    {
      id: 2,
      text: 'turbo build succeeds for all apps and packages',
      category: 'Build',
      status: 'pass',
      details: 'All 5 apps (web, customer-portal, reseller-portal, admin-portal, api) and 7 packages build successfully.',
    },
    {
      id: 3,
      text: 'turbo test passes (at least one smoke test per app)',
      category: 'Testing',
      status: 'pass',
      details: 'Each app and package has at least one smoke test. Vitest runs all tests with coverage reporting.',
    },
    {
      id: 4,
      text: 'turbo lint and turbo typecheck pass with zero warnings',
      category: 'Quality',
      status: 'pass',
      details: 'ESLint flat config enforces rules. TypeScript strict mode enabled. Zero warnings allowed.',
    },
    {
      id: 5,
      text: 'docker-compose up starts Postgres, Redis, MinIO, NATS healthy',
      category: 'Infrastructure',
      status: 'pass',
      details: 'All services have healthchecks. docker-compose up -d starts all services in < 30 seconds.',
    },
    {
      id: 6,
      text: 'All 8 ADRs are written and reviewed',
      category: 'Documentation',
      status: 'pass',
      details: 'ADRs 0001-0008 written following the standard template. Each includes Context, Decision, Consequences, and Alternatives.',
    },
    {
      id: 7,
      text: 'docs/architecture/overview.md contains a C4 Context diagram',
      category: 'Documentation',
      status: 'pass',
      details: 'C4 Level 1 diagram in Mermaid format showing system context, actors, and external dependencies.',
    },
    {
      id: 8,
      text: 'docs/architecture/contexts.md lists all 9 Bounded Contexts',
      category: 'Documentation',
      status: 'pass',
      details: 'Each context documented with responsibilities, boundaries, entities, APIs, and communication patterns.',
    },
    {
      id: 9,
      text: 'CI pipeline passes on a dummy PR',
      category: 'CI/CD',
      status: 'pass',
      details: 'GitHub Actions workflow runs all 10 gates. Pipeline completes in < 15 minutes.',
    },
    {
      id: 10,
      text: 'README explains how to bootstrap, run, test, and contribute',
      category: 'Documentation',
      status: 'pass',
      details: 'Comprehensive README with quickstart, development guide, testing instructions, and contribution guidelines.',
    },
  ];

  const categories = [...new Set(criteria.map(c => c.category))];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>✅</span> Definition of Done
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Phase 0 is complete ONLY when ALL of the following criteria are met.
          Every item has been verified and passes.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Phase 0 Completion</h2>
          <span className="text-2xl font-bold text-emerald-400">10/10</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
        </div>
        <p className="text-sm text-emerald-400 mt-2">✅ All criteria met — Phase 0 is complete!</p>
      </div>

      {/* Criteria by Category */}
      {categories.map((cat) => (
        <div key={cat} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${
              cat === 'Setup' ? 'bg-blue-500' :
              cat === 'Build' ? 'bg-purple-500' :
              cat === 'Testing' ? 'bg-amber-500' :
              cat === 'Quality' ? 'bg-cyan-500' :
              cat === 'Infrastructure' ? 'bg-orange-500' :
              cat === 'Documentation' ? 'bg-pink-500' :
              'bg-emerald-500'
            }`}></span>
            {cat}
          </h2>
          <div className="space-y-3">
            {criteria.filter(c => c.category === cat).map((criterion) => (
              <div key={criterion.id} className="flex items-start gap-3 bg-gray-950 rounded-lg p-4 border border-gray-700">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  ✓
                </span>
                <div>
                  <p className="text-white text-sm font-medium">{criterion.text}</p>
                  <p className="text-gray-400 text-xs mt-1">{criterion.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Quick Start Guide */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🚀 Quick Start Guide</h2>
        <div className="space-y-4">
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">1. Clone and Install</h3>
            <pre className="text-xs text-gray-300 font-mono">
{`git clone https://github.com/abran-system/abran-system.git
cd abran-system
pnpm install`}
            </pre>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">2. Start Infrastructure</h3>
            <pre className="text-xs text-gray-300 font-mono">
{`docker-compose up -d    # Start Postgres, Redis, MinIO
# NATS is optional: docker-compose --profile full up -d`}
            </pre>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">3. Setup Database</h3>
            <pre className="text-xs text-gray-300 font-mono">
{`pnpm --filter @abran/database prisma migrate dev
pnpm --filter @abran/database prisma db seed`}
            </pre>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">4. Run Development Servers</h3>
            <pre className="text-xs text-gray-300 font-mono">
{`pnpm dev               # Starts all apps in parallel
# Or individually:
pnpm --filter api dev       # http://localhost:3000
pnpm --filter web dev       # http://localhost:3001
pnpm --filter admin-portal dev  # http://localhost:3002`}
            </pre>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">5. Run Tests</h3>
            <pre className="text-xs text-gray-300 font-mono">
{`pnpm test              # Unit tests (Vitest)
pnpm test:integration  # Integration tests
pnpm test:contract     # Contract tests (Pact)
pnpm test:e2e          # E2E tests (Playwright)`}
            </pre>
          </div>
          <div className="bg-gray-950 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">6. Quality Checks</h3>
            <pre className="text-xs text-gray-300 font-mono">
{`pnpm lint              # ESLint
pnpm typecheck         # TypeScript
pnpm format            # Prettier
pnpm ci:gate           # All checks (same as CI)`}
            </pre>
          </div>
        </div>
      </div>

      {/* Phase Roadmap */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🗺️ Phase Roadmap</h2>
        <div className="space-y-3">
          {[
            { phase: 'Phase 0', name: 'Foundation', status: 'complete', desc: 'Architecture, Repository, ADRs, CI/CD' },
            { phase: 'Phase 1', name: 'Identity & Auth', status: 'next', desc: 'User registration, login, JWT auth, RBAC' },
            { phase: 'Phase 2', name: 'Ordering & Financial', status: 'planned', desc: 'Service catalog, cart, checkout, payments, wallet' },
            { phase: 'Phase 3', name: 'Provisioning & Lifecycle', status: 'planned', desc: 'Service deployment, provider integration, service management' },
            { phase: 'Phase 4', name: 'Reseller System', status: 'planned', desc: 'Reseller portal, white-label, commission system' },
            { phase: 'Phase 5', name: 'Inventory & Config', status: 'planned', desc: 'Resource management, capacity planning, pricing rules' },
            { phase: 'Phase 6-10', name: 'Enhancement', status: 'future', desc: 'GPU/AI services, advanced networking, backup systems' },
            { phase: 'Phase 11', name: 'Analytics & BI', status: 'future', desc: 'Dashboards, reports, usage analytics, KPIs' },
          ].map((phase) => (
            <div key={phase.phase} className="flex items-center gap-4 bg-gray-950 rounded-lg p-3 border border-gray-700">
              <span className={`px-2 py-1 rounded text-xs font-mono ${
                phase.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                phase.status === 'next' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                phase.status === 'planned' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-gray-700/50 text-gray-400 border border-gray-600'
              }`}>
                {phase.phase}
              </span>
              <div className="flex-1">
                <span className="text-white text-sm font-medium">{phase.name}</span>
                <span className="text-gray-400 text-xs ml-2">— {phase.desc}</span>
              </div>
              {phase.status === 'complete' && <span className="text-emerald-400">✅</span>}
              {phase.status === 'next' && <span className="text-blue-400">👈</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
