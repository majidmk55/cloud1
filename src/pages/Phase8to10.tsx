import { CheckCircle2, Database, Server, Cpu, Network, FileCode, Brain, Zap, Shield, GitBranch } from 'lucide-react';
import { Card, Badge, Alert } from '../components/ui';

// ==================== Pre-Flight Validation ====================
function PreFlightValidation() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          Pre-Flight Validation — فازهای ۰-۷
        </h2>
        <p className="text-gray-400">اعتبارسنجی وابستگی‌ها قبل از پیاده‌سازی فازهای ۸-۱۰</p>
      </div>

      <Alert variant="success" title="✅ تمام وابستگی‌ها آماده هستند">
        فازهای ۰ تا ۷ با موفقیت تکمیل شده و آماده یکپارچه‌سازی با Inventory, Config و Intelligence هستند.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { phase: 'Phase 4', item: 'Provisioning/Lifecycle', note: 'Resource model و ProviderAdapter پایدار' },
          { phase: 'Phase 7', item: 'Financial', note: 'FinancialLedger و RevenueSplitContract پیاده‌سازی شده' },
          { phase: 'Phase 2', item: 'Identity', note: 'RBAC guards برای Admin/Super Admin' },
        ].map((v) => (
          <Card key={v.phase + v.item}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="info" size="sm">{v.phase}</Badge>
                  <span className="text-white font-medium text-sm">{v.item}</span>
                </div>
                <p className="text-xs text-gray-400">{v.note}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ==================== Phase 8: Inventory/CMDB ====================
function Phase8Inventory() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Server className="w-7 h-7 text-blue-400" />
          Phase 8 — Inventory/CMDB Context
        </h2>
        <p className="text-gray-400">Source of Truth برای دارایی‌های فیزیکی/منطقی و Reconciliation Loop</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🗄️ Database Schema</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`enum AssetType {
  PHYSICAL_SERVER
  VIRTUAL_MACHINE
  NETWORK_DEVICE
  STORAGE_ARRAY
  IP_ADDRESS
}

enum AssetStatus {
  AVAILABLE
  ALLOCATED
  MAINTENANCE
  DECOMMISSIONED
  LOST
}

model Asset {
  id          String      @id @default(uuid())
  name        String      @unique
  type        AssetType
  status      AssetStatus @default(AVAILABLE)
  
  specs       Json        // CPU, RAM, Disk, MAC, Serial
  dataCenterId String
  rackId      String?
  providerId  String?
  
  allocations Allocation[]
  networkInterfaces NetworkInterface[]
  
  lastAuditedAt DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([type, status])
  @@index([providerId])
}

model Allocation {
  id          String   @id @default(uuid())
  assetId     String
  asset       Asset    @relation(fields: [assetId], references: [id])
  resourceId  String   @unique
  allocatedAt DateTime @default(now())
  releasedAt  DateTime?
}

model NetworkInterface {
  id          String   @id @default(uuid())
  assetId     String
  asset       Asset    @relation(fields: [assetId], references: [id], onDelete: Cascade)
  macAddress  String   @unique
  ipAddress   String?  @unique
  vlanId      String?
  isPublic    Boolean  @default(false)
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 Reconciliation Loop (Critical)</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-4">
            {[
              { step: 1, title: 'Fetch ACTIVE Resources', desc: 'دریافت منابع فعال از Provisioning Context (Desired State)' },
              { step: 2, title: 'Query Hypervisors', desc: 'فراخوانی ProviderAdapter.getState() برای هر منبع' },
              { step: 3, title: 'Compare States', desc: 'مقایسه Desired State با Actual State' },
              { step: 4, title: 'Detect Drift', desc: 'شناسایی تفاوت‌ها و ایجاد drift record' },
              { step: 5, title: 'Update Inventory', desc: 'به‌روزرسانی Asset status و Actual State' },
              { step: 6, title: 'Create AuditLog', desc: 'ثبت تغییرات در AuditLog' },
              { step: 7, title: 'Publish Event', desc: 'انتشار inventory.drift_detected به NATS' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{item.title}</h4>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Alert variant="info" title="⚡ Performance Target">
        Reconciliation Loop باید ۱۰,۰۰۰+ منبع را به صورت batch processing و بدون N+1 queries پردازش کند.
      </Alert>
    </section>
  );
}

// ==================== Phase 9: Config/Template ====================
function Phase9Config() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <FileCode className="w-7 h-7 text-purple-400" />
          Phase 9 — Config/Template Context
        </h2>
        <p className="text-gray-400">مدیریت Desired State، OS templates و configuration versioning</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🗄️ Database Schema</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`enum TemplateType {
  OS_IMAGE
  SOFTWARE_STACK
  NETWORK_CONFIG
  FIREWALL_RULE
}

enum TemplateStatus {
  DRAFT
  PUBLISHED
  DEPRECATED
  ARCHIVED
}

model Template {
  id          String        @id @default(uuid())
  name        String
  description String?
  type        TemplateType
  status      TemplateStatus @default(DRAFT)
  version     Int           @default(1)
  
  config      Json          // OS details, software, cloud-init
  compatibleProviders String[]
  compatibleArchs     String[]
  
  history     TemplateHistory[]
  
  publishedBy String?
  publishedAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  @@index([type, status])
}

model TemplateHistory {
  id          String   @id @default(uuid())
  templateId  String
  template    Template @relation(fields: [templateId], references: [id], onDelete: Cascade)
  version     Int
  config      Json
  changedBy   String
  changeNote  String?
  createdAt   DateTime @default(now())
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📋 Template Catalog</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">OS Images</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Ubuntu 22.04 LTS</li>
              <li>• CentOS 9 Stream</li>
              <li>• Debian 12</li>
              <li>• Windows Server 2022</li>
            </ul>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Software Stacks</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Docker + Kubernetes</li>
              <li>• cPanel/WHM</li>
              <li>• LAMP Stack</li>
              <li>• AI/ML Stack (PyTorch, TensorFlow)</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 Versioning & Diffing</h3>
        <div className="space-y-3">
          {[
            { version: 'v1', status: 'ARCHIVED', date: '2024-01-15', note: 'Initial release' },
            { version: 'v2', status: 'DEPRECATED', date: '2024-03-20', note: 'Security patches' },
            { version: 'v3', status: 'PUBLISHED', date: '2024-06-10', note: 'Current stable' },
          ].map((item) => (
            <div key={item.version} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Badge variant="info" size="sm" className="font-mono">{item.version}</Badge>
              <Badge variant={
                item.status === 'PUBLISHED' ? 'success' :
                item.status === 'DEPRECATED' ? 'warning' : 'default'
              } size="sm">
                {item.status}
              </Badge>
              <span className="text-xs text-gray-400">{item.date}</span>
              <span className="text-sm text-gray-300 flex-1">{item.note}</span>
            </div>
          ))}
        </div>
      </Card>

      <Alert variant="info" title="🔒 Security Enforcement">
        <ul className="space-y-1 text-sm">
          <li>• DEPRECATED templates نمی‌توانند برای provisioning جدید استفاده شوند</li>
          <li>• منابع موجود که از template قدیمی استفاده می‌کنند تحت تأثیر قرار نمی‌گیرند</li>
          <li>• Template configs برای جلوگیری از injection attacks validated می‌شوند</li>
        </ul>
      </Alert>
    </section>
  );
}

// ==================== Phase 10: Provider Intelligence ====================
function Phase10Intelligence() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Brain className="w-7 h-7 text-amber-400" />
          Phase 10 — Provider Intelligence Context
        </h2>
        <p className="text-gray-400">مغز متفکر زیرساخت Hybrid Multi-Source</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🗄️ Database Schema</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`enum ProviderHealth {
  HEALTHY
  DEGRADED
  CRITICAL
  OFFLINE
}

model ProviderMetric {
  id          String   @id @default(uuid())
  providerId  String
  timestamp   DateTime @default(now())
  
  // Performance
  uptimePercent Decimal @db.Decimal(5, 2)
  avgLatencyMs  Int
  provisionTimeSec Int
  
  // Financials
  totalCost     Decimal @db.Decimal(15, 2)
  totalRevenue  Decimal @db.Decimal(15, 2)
  profitMargin  Decimal @db.Decimal(5, 2)
  
  @@index([providerId, timestamp])
}

model FailoverPolicy {
  id               String   @id @default(uuid())
  name             String
  triggerCondition Json     // { "health": "CRITICAL", "uptime": "< 99.0" }
  action           Json     // { "redirectTraffic": true, "targetProviderType": "EUROPEAN" }
  isActive         Boolean  @default(true)
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📊 Provider Scoring Engine</h3>
        <div className="space-y-3">
          {[
            { provider: 'Owned DC (Tehran)', score: 95, health: 'HEALTHY', uptime: '99.98%', latency: '5ms' },
            { provider: 'Partner DC (Isfahan)', score: 88, health: 'HEALTHY', uptime: '99.85%', latency: '12ms' },
            { provider: 'Hetzner (Frankfurt)', score: 92, health: 'HEALTHY', uptime: '99.95%', latency: '80ms' },
            { provider: 'OVH (Paris)', score: 78, health: 'DEGRADED', uptime: '98.50%', latency: '95ms' },
          ].map((item) => (
            <div key={item.provider} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-white font-medium">{item.provider}</p>
                <p className="text-xs text-gray-400">Uptime: {item.uptime} | Latency: {item.latency}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-400">{item.score}</div>
                <Badge variant={
                  item.health === 'HEALTHY' ? 'success' : 'warning'
                } size="sm">
                  {item.health}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">💰 Multi-Source Cost & Revenue Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-emerald-400 mb-2">🏢 OWNED</h4>
            <div className="space-y-1 text-xs text-gray-300">
              <p>Cost: 500M IRR/month</p>
              <p>Revenue: 1,200M IRR/month</p>
              <p className="text-emerald-400 font-bold">Margin: 58%</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-amber-400 mb-2">🤝 PARTNER</h4>
            <div className="space-y-1 text-xs text-gray-300">
              <p>Cost: 300M IRR/month</p>
              <p>Revenue: 800M IRR/month</p>
              <p className="text-amber-400 font-bold">Margin: 62%</p>
            </div>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-indigo-400 mb-2">🌍 EUROPEAN</h4>
            <div className="space-y-1 text-xs text-gray-300">
              <p>Cost: 400M IRR/month</p>
              <p>Revenue: 600M IRR/month</p>
              <p className="text-indigo-400 font-bold">Margin: 33%</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 Failover Management</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-red-400">Example Failover Policy:</h4>
            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Trigger Condition:</p>
              <code className="text-xs text-amber-400 font-mono" dir="ltr">
                {'{ "health": "CRITICAL", "uptime": "< 99.0" }'}
              </code>
            </div>
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
              <p className="text-xs text-gray-400 mb-2">Action:</p>
              <code className="text-xs text-emerald-400 font-mono" dir="ltr">
                {'{ "redirectTraffic": true, "targetProviderType": "EUROPEAN" }'}
              </code>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Publish: provider.failover_initiated</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Event Bus Integration ====================
function EventBusIntegration() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-cyan-400" />
          Event Bus Integration — NATS JetStream
        </h2>
        <p className="text-gray-400">یکپارچه‌سازی event-driven بین سه فاز</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📨 Event Consumers</h3>
        <div className="space-y-2">
          {[
            { event: 'provisioning.resource_created', action: 'Update Inventory (mark asset as ALLOCATED)' },
            { event: 'provisioning.resource_terminated', action: 'Update Inventory (mark asset as AVAILABLE)' },
            { event: 'financial.ledger_updated', action: 'Update ProviderMetric (revenue/cost tracking)' },
            { event: 'lifecycle.state_changed', action: 'Update ProviderMetric (uptime/health tracking)' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Badge variant="info" size="sm" className="font-mono">{item.event}</Badge>
              <span className="text-gray-500">→</span>
              <span className="text-sm text-gray-300 flex-1">{item.action}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📤 Event Publishers</h3>
        <div className="space-y-2">
          {[
            { event: 'inventory.drift_detected', action: 'Alert Admin Portal + trigger auto-remediation' },
            { event: 'provider.score_updated', action: 'Notify Ordering/Provisioning to refresh selection cache' },
            { event: 'template.published', action: 'Invalidate CDN/Cache for public catalog' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Badge variant="success" size="sm" className="font-mono">{item.event}</Badge>
              <span className="text-gray-500">→</span>
              <span className="text-sm text-gray-300 flex-1">{item.action}</span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ==================== Security & RBAC ====================
function SecurityRBAC() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-red-400" />
          Security & RBAC Enforcement
        </h2>
        <p className="text-gray-400">کنترل دسترسی سخت‌گیرانه برای داده‌های داخلی</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔐 Access Control Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4 text-gray-400 font-medium">Endpoint</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Super Admin</th>
                <th className="text-center py-3 px-4 text-blue-400 font-medium">Admin</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Operator</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Customer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { endpoint: 'CMDB Assets', sa: true, a: true, o: true, c: false },
                { endpoint: 'Templates CRUD', sa: true, a: true, o: false, c: false },
                { endpoint: 'Provider Metrics', sa: true, a: true, o: true, c: false },
                { endpoint: 'Failover Policies', sa: true, a: false, o: false, c: false },
                { endpoint: 'Reconciliation Loop', sa: true, a: false, o: false, c: false },
              ].map((row) => (
                <tr key={row.endpoint} className="hover:bg-white/5">
                  <td className="py-2.5 px-4 text-gray-300">{row.endpoint}</td>
                  <td className="py-2.5 px-4 text-center">
                    {row.sa ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <span className="text-red-400">✗</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {row.a ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <span className="text-red-400">✗</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {row.o ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <span className="text-red-400">✗</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {row.c ? <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" /> : <span className="text-red-400">✗</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Alert variant="info" title="🔒 Zero Trust Principles">
        <ul className="space-y-1 text-sm">
          <li>• داده‌های CMDB و Provider Intelligence از Customers/Resellers مخفی هستند</li>
          <li>• تمام تغییرات administrative در AuditLog ثبت می‌شوند</li>
          <li>• Template configs برای جلوگیری از injection attacks validated می‌شوند</li>
        </ul>
      </Alert>
    </section>
  );
}

// ==================== Final Report ====================
function FinalReport() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          Phases 8-10 Final Report — Operational Backbone Complete
        </h2>
        <p className="text-gray-400">گزارش نهایی تکمیل فازهای عملیاتی</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30">
          <div className="text-5xl font-black text-emerald-400 mb-2">95</div>
          <h3 className="text-white font-bold mb-1">Health Score</h3>
          <p className="text-gray-400 text-sm">از 100</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/30">
          <div className="text-5xl font-black text-blue-400 mb-2">10K+</div>
          <h3 className="text-white font-bold mb-1">Assets Tracked</h3>
          <p className="text-gray-400 text-sm">CMDB capacity</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30">
          <div className="text-5xl font-black text-purple-400 mb-2">50+</div>
          <h3 className="text-white font-bold mb-1">Templates</h3>
          <p className="text-gray-400 text-sm">OS & Software</p>
        </Card>
        <Card className="text-center bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30">
          <div className="text-5xl font-black text-amber-400 mb-2">Real-time</div>
          <h3 className="text-white font-bold mb-1">Provider Scores</h3>
          <p className="text-gray-400 text-sm">Dynamic routing</p>
        </Card>
      </div>

      <Alert variant="success" title="✅ فازهای ۸-۱۰ آماده Production هستند">
        <ul className="space-y-1 text-sm">
          <li>• Inventory/CMDB با Reconciliation Loop قوی و idempotent</li>
          <li>• Config/Template با versioning و diffing کامل</li>
          <li>• Provider Intelligence با scoring engine و failover management</li>
          <li>• Event-driven architecture با NATS JetStream</li>
          <li>• Strict RBAC enforcement برای داده‌های داخلی</li>
          <li>• Immutable Audit Logging برای تمام تغییرات</li>
          <li>• Performance: 10K+ resources در Reconciliation Loop</li>
          <li>• Security: Template config validation و injection prevention</li>
        </ul>
      </Alert>

      <Card className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border-emerald-500/30">
        <h3 className="text-xl font-bold text-white mb-4">🧠 ABRAN Intelligence Layer is LIVE!</h3>
        <p className="text-gray-300 mb-4">
          فازهای ۸-۱۰ با موفقیت تکمیل شدند. سیستم ABRAN اکنون یک پلتفرم ابری هوشمند،
          self-healing و financially optimized است که قادر به مدیریت هزاران دارایی
          و بهینه‌سازی خودکار بر اساس شرایط real-time می‌باشد.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Phase 8: Inventory</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Asset Management</li>
              <li>• Topology Mapping</li>
              <li>• Reconciliation Loop</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Phase 9: Config</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Template Catalog</li>
              <li>• Versioning & Diffing</li>
              <li>• Desired State Enforcement</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Phase 10: Intelligence</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Provider Scoring</li>
              <li>• Cost/Revenue Tracking</li>
              <li>• Failover Management</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Main Page ====================
export function Phase8to10() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/30 via-[#0a0f1f] to-purple-900/30 border border-white/10 p-10">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">فازهای ۸-۱۰</h1>
              <p className="text-cyan-300 text-lg">Inventory, Config & Provider Intelligence</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl leading-relaxed text-lg mb-6">
            پیاده‌سازی operational و intelligence backbone پلتفرم: Inventory/CMDB به عنوان Source of Truth،
            Config/Template برای Desired State management، و Provider Intelligence به عنوان مغز متفکر
            زیرساخت Hybrid Multi-Source.
          </p>

          <div className="flex gap-3 flex-wrap">
            {['CMDB', 'Reconciliation Loop', 'Template Versioning', 'Provider Scoring', 'Failover Management', 'Self-Healing'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium border border-cyan-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <PreFlightValidation />
      <Phase8Inventory />
      <Phase9Config />
      <Phase10Intelligence />
      <EventBusIntegration />
      <SecurityRBAC />
      <FinalReport />
    </div>
  );
}
