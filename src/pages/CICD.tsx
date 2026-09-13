export function CICD() {
  const pipelineSteps = [
    { step: 1, name: 'Install Dependencies', command: 'pnpm install --frozen-lockfile', desc: 'Install all workspace dependencies with lockfile integrity check', icon: '📦' },
    { step: 2, name: 'Lint', command: 'turbo lint', desc: 'Run ESLint across all packages and apps with zero tolerance for errors', icon: '🔍' },
    { step: 3, name: 'Type Check', command: 'turbo typecheck', desc: 'Run TypeScript compiler in no-emit mode across all packages', icon: '🔤' },
    { step: 4, name: 'Unit Tests', command: 'turbo test', desc: 'Run Vitest unit tests with coverage threshold (80% minimum)', icon: '🧪' },
    { step: 5, name: 'Integration Tests', command: 'turbo test:integration', desc: 'Run integration tests with test containers (Postgres, Redis)', icon: '🔗' },
    { step: 6, name: 'Contract Tests', command: 'turbo test:contract', desc: 'Validate API contracts and event schemas (Pact + JSON Schema)', icon: '📝' },
    { step: 7, name: 'Build', command: 'turbo build', desc: 'Build all apps and packages with Turborepo caching', icon: '🏗️' },
    { step: 8, name: 'Security Scan', command: 'pnpm audit + Trivy', desc: 'Dependency vulnerability scan + Docker image security scan', icon: '🛡️' },
    { step: 9, name: 'Architecture Rules', command: 'pnpm arch:check', desc: 'Validate module boundaries — no cross-context imports except via contracts', icon: '🏛️' },
    { step: 10, name: 'Deploy Gate', command: 'conditional', desc: 'Deploy only if ALL previous steps pass with zero failures', icon: '🚀' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>⚙️</span> CI/CD Pipeline
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          GitHub Actions pipeline that runs on every PR. All gates must pass before merge.
          The pipeline enforces code quality, type safety, test coverage, security, and architecture rules.
        </p>
      </div>

      {/* Pipeline Visualization */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Pipeline Flow</h2>
        <div className="space-y-3">
          {pipelineSteps.map((step, i) => (
            <div key={step.step} className="flex items-start gap-4">
              {/* Connector */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-blue-500/50 flex items-center justify-center text-lg">
                  {step.icon}
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-700 mt-1"></div>
                )}
              </div>
              {/* Content */}
              <div className="flex-1 bg-gray-950 rounded-lg p-4 border border-gray-700 -mt-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-semibold text-sm">
                    Step {step.step}: {step.name}
                  </h3>
                  {step.step === 10 && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                      GATE
                    </span>
                  )}
                </div>
                <code className="text-xs text-blue-300 font-mono block mb-1">{step.command}</code>
                <p className="text-xs text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CI YAML */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📄 .github/workflows/ci.yml</h2>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed">
{`name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  ci-gate:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: abran_test
          POSTGRES_USER: abran
          POSTGRES_PASSWORD: test_password
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s

    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm turbo lint
      
      - name: Type check
        run: pnpm turbo typecheck
      
      - name: Unit tests
        run: pnpm turbo test -- --coverage
      
      - name: Integration tests
        run: pnpm turbo test:integration
        env:
          DATABASE_URL: postgresql://abran:test_password@localhost:5432/abran_test
          REDIS_URL: redis://localhost:6379
      
      - name: Contract tests
        run: pnpm turbo test:contract
      
      - name: Build
        run: pnpm turbo build
      
      - name: Security audit
        run: pnpm audit --audit-level=high
      
      - name: Architecture rules
        run: pnpm arch:check

  docker-scan:
    needs: ci-gate
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker images
        run: |
          docker build -f Dockerfile.api -t abran-api:\${{ github.sha }} .
          docker build -f Dockerfile.web -t abran-web:\${{ github.sha }} .
      - name: Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: abran-api:\${{ github.sha }}
          format: table
          exit-code: 1
          severity: 'CRITICAL,HIGH'`}
          </pre>
        </div>
      </div>

      {/* Architecture Rule Check */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🏛️ Architecture Boundary Enforcement</h2>
        <p className="text-gray-400 text-sm mb-4">
          Custom script that validates module boundaries. No cross-context imports allowed except via @abran/contracts.
        </p>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed">
{`// scripts/arch-check.ts
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const MODULES_DIR = './modules';
const ALLOWED_IMPORTS = [
  '@abran/contracts',
  '@abran/events',
  '@abran/config',
  // Node built-ins and external packages
];

function checkModuleBoundaries() {
  const modules = readdirSync(MODULES_DIR);
  let violations = 0;

  for (const mod of modules) {
    const srcDir = join(MODULES_DIR, mod, 'src');
    // Scan all .ts files in module
    // Check import statements
    // If import references another module directly → VIOLATION
    // If import is from @abran/contracts → OK
    // If import is from @abran/events → OK
  }

  if (violations > 0) {
    console.error(\`Found \${violations} boundary violations!\`);
    process.exit(1);
  }
  console.log('✅ All module boundaries respected');
}`}
          </pre>
        </div>
      </div>

      {/* Deploy Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">🟡 deploy-staging.yml</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Triggered on merge to develop</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Builds Docker images</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Pushes to container registry</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Deploys to staging server via SSH</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Runs smoke tests post-deploy</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">•</span> Sends Slack notification</li>
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-3">🟢 deploy-prod.yml</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Triggered on tag (v*) or manual</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Requires manual approval</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Blue/green deployment</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Database migration with rollback</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Health check verification</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> Automatic rollback on failure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
