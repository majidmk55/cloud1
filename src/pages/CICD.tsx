export function CICD() {
  const steps = [
    { step: 1, name: 'نصب وابستگی‌ها', cmd: 'pnpm install --frozen-lockfile', icon: '📦' },
    { step: 2, name: 'Lint', cmd: 'turbo lint', icon: '🔍' },
    { step: 3, name: 'Type Check', cmd: 'turbo typecheck', icon: '🔤' },
    { step: 4, name: 'Unit Tests', cmd: 'turbo test', icon: '🧪' },
    { step: 5, name: 'Integration Tests', cmd: 'turbo test:integration', icon: '🔗' },
    { step: 6, name: 'Contract Tests', cmd: 'turbo test:contract', icon: '📝' },
    { step: 7, name: 'Financial Tests', cmd: 'turbo test:financial', icon: '💰' },
    { step: 8, name: 'Performance Tests', cmd: 'turbo test:performance', icon: '⚡' },
    { step: 9, name: 'Accessibility Tests', cmd: 'turbo test:accessibility', icon: '♿' },
    { step: 10, name: 'Security Scan', cmd: 'pnpm audit + Trivy', icon: '🛡️' },
    { step: 11, name: 'Architecture Check', cmd: 'turbo architecture:check', icon: '🏛️' },
    { step: 12, name: 'Build', cmd: 'turbo build', icon: '🏗️' },
    { step: 13, name: 'Deploy Gate', cmd: 'conditional', icon: '🚀' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>⚙️</span> خط لوله CI/CD
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          GitHub Actions pipeline با ۱۳ مرحله. تمام gateها باید پاس شوند. شامل تست‌های مالی، عملکرد، و دسترس‌پذیری.
        </p>
      </div>

      {/* Pipeline Flow */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">جریان Pipeline</h2>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-gray-800 border-2 border-blue-500/50 flex items-center justify-center text-sm">
                  {step.icon}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-6 bg-gray-700 mt-1"></div>}
              </div>
              <div className="flex-1 bg-gray-950 rounded-lg p-3 border border-gray-700 -mt-0.5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-white font-medium text-sm">
                    مرحله {step.step}: {step.name}
                  </h3>
                  {step.step === 13 && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full border border-emerald-500/30">
                      GATE
                    </span>
                  )}
                </div>
                <code className="text-[11px] text-blue-300 font-mono" dir="ltr">{step.cmd}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CI YAML */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📄 .github/workflows/ci.yml</h2>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

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
          POSTGRES_PASSWORD: test
        ports: ['5432:5432']
      redis:
        image: redis:7-alpine
        ports: ['6379:6379']
      clickhouse:
        image: clickhouse/clickhouse-server
        ports: ['8123:8123']
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      # Quality Gates
      - run: pnpm turbo lint
      - run: pnpm turbo typecheck
      
      # Test Suites
      - run: pnpm turbo test
      - run: pnpm turbo test:integration
      - run: pnpm turbo test:contract
      - run: pnpm turbo test:financial
      - run: pnpm turbo test:performance
      - run: pnpm turbo test:accessibility
      
      # Security
      - run: pnpm audit --audit-level=high
      - run: pnpm turbo security:scan
      
      # Architecture
      - run: pnpm turbo architecture:check
      
      # Build
      - run: pnpm turbo build

  docker-scan:
    needs: ci-gate
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build & Scan
        run: |
          docker build -f Dockerfile.api -t abran-api .
          docker build -f Dockerfile.web -t abran-web .
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: abran-api
          severity: 'CRITICAL,HIGH'
          exit-code: 1`}
          </pre>
        </div>
      </div>

      {/* Specialized Tests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span>💰</span> Financial Tests
          </h3>
          <p className="text-gray-400 text-xs mb-3">تست دقت محاسبات مالی</p>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• Revenue Split calculations</li>
            <li>• Settlement accuracy</li>
            <li>• Ledger integrity</li>
            <li>• Double-entry validation</li>
          </ul>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span>⚡</span> Performance Tests
          </h3>
          <p className="text-gray-400 text-xs mb-3">Lighthouse CI + Web Vitals</p>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• LCP &lt; 2.5s</li>
            <li>• FID &lt; 100ms</li>
            <li>• CLS &lt; 0.1</li>
            <li>• Bundle size checks</li>
          </ul>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <span>♿</span> Accessibility Tests
          </h3>
          <p className="text-gray-400 text-xs mb-3">WCAG 2.1 AA compliance</p>
          <ul className="space-y-1 text-xs text-gray-300">
            <li>• axe-core automated</li>
            <li>• Keyboard navigation</li>
            <li>• Screen reader testing</li>
            <li>• Color contrast checks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
