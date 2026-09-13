import { GitBranch } from 'lucide-react';

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

export function CICD() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <GitBranch className="w-10 h-10 text-violet-400" />
          خط لوله CI/CD
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          GitHub Actions pipeline با ۱۳ مرحله. تمام gateها باید پاس شوند.
        </p>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-6">جریان Pipeline</h2>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center text-sm">
                  {step.icon}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/30 to-transparent mt-1"></div>}
              </div>
              <div className="flex-1 bg-[#050816] rounded-xl p-3 border border-white/5 -mt-0.5">
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

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">📄 .github/workflows/ci.yml</h2>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

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
      - run: pnpm turbo build`}
          </pre>
        </div>
      </div>
    </div>
  );
}
