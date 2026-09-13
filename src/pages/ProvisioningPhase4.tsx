import { Server, Cpu, RefreshCw, CheckCircle2, Database, Zap, Shield, GitBranch } from 'lucide-react';
import { Card, Badge, Alert } from '../components/ui';

// ==================== Validation Report ====================
function ValidationReport() {
  const phase01Checks = [
    { item: 'CI/CD Pipeline', status: 'pass', note: 'turbo run test/lint/typecheck برای تمام ماژول‌ها پاس می‌شوند' },
    { item: 'Design System', status: 'pass', note: 'کامپوننت‌های PowerControl، SourceLayerBadge و VisibilityToggle پیاده‌سازی شده‌اند' },
  ];

  const phase2Checks = [
    { item: 'Audit Logging', status: 'pass', note: 'AuditService می‌تواند اکشن‌های resource-specific را ثبت کند' },
    { item: 'RBAC', status: 'pass', note: 'RbacGuard به درستی Operator را از اجرای دستورات مخرب محدود می‌کند' },
  ];

  const phase3Checks = [
    { item: 'Order Items', status: 'pass', note: 'OrderItem به درستی sourceLayer و unitPrice را snapshot می‌کند' },
    { item: 'Events', status: 'pass', note: 'order.created payload شامل تمام داده‌های لازم برای Provisioning است' },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          Validation Report — Phase 0-3
        </h2>
        <p className="text-gray-400">بررسی انطباق با ABRAN SYSTEM Architecture v3.0</p>
      </div>

      <Alert variant="success" title="✅ تمام بررسی‌ها پاس شدند">
        فازهای ۰ تا ۳ با معماری v3.0 کاملاً منطبق هستند. هیچ موردی نیاز به اصلاح ندارد.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            Phase 0 & 1
          </h3>
          <div className="space-y-2">
            {phase01Checks.map((check) => (
              <div key={check.item} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{check.item}</p>
                  <p className="text-xs text-gray-400">{check.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            Phase 2 (Identity)
          </h3>
          <div className="space-y-2">
            {phase2Checks.map((check) => (
              <div key={check.item} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{check.item}</p>
                  <p className="text-xs text-gray-400">{check.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            Phase 3 (Ordering)
          </h3>
          <div className="space-y-2">
            {phase3Checks.map((check) => (
              <div key={check.item} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{check.item}</p>
                  <p className="text-xs text-gray-400">{check.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

// ==================== Database Schema ====================
function DatabaseSchemaSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Database className="w-7 h-7 text-indigo-400" />
          Database Schema — Provisioning & Lifecycle Models
        </h2>
        <p className="text-gray-400">مدل‌های جدید اضافه شده به Prisma schema</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📊 Enums</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`enum ProviderType {
  OWNED
  IRANIAN_PARTNER
  EUROPEAN
}

enum ResourceStatus {
  PENDING
  PROVISIONING
  ACTIVE
  SUSPENDED
  TERMINATED
  ERROR
}

enum PowerState {
  ON
  OFF
  REBOOTING
  UNKNOWN
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🏢 Provider & ProviderContract Models</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Provider {
  id           String   @id @default(uuid())
  name         String
  type         ProviderType
  apiConfig    Json     // Encrypted credentials and endpoints
  capabilities Json     // Supported OS, specs, regions
  healthStatus String   @default("HEALTHY") // HEALTHY, DEGRADED, DOWN
  score        Int      @default(100)       // For Selection Engine
  
  resources    Resource[]
  contracts    ProviderContract[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ProviderContract {
  id          String   @id @default(uuid())
  providerId  String
  provider    Provider @relation(fields: [providerId], references: [id])
  serviceType String   // e.g., "VPS", "DEDICATED"
  costPerHour Decimal  @db.Decimal(10, 4)
  currency    String   @default("USD")
  
  @@unique([providerId, serviceType])
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🖥️ Resource Model</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Resource {
  id            String         @id @default(uuid())
  orderId       String         @unique
  
  providerId    String
  provider      Provider       @relation(fields: [providerId], references: [id])
  
  externalId    String?        // ID on the actual hypervisor/provider
  
  status        ResourceStatus @default(PENDING)
  powerState    PowerState     @default(OFF)
  
  specs         Json           // CPU, RAM, Disk, IP addresses
  location      String         // e.g., "Tehran-DC1", "Frankfurt-DC2"
  
  desiredState  Json           // Desired config from Config context
  actualState   Json           // Last known actual state from hypervisor
  
  lastSyncedAt  DateTime?
  
  stateHistory  ResourceStateHistory[]
  
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  @@index([providerId, status])
  @@index([orderId])
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📜 ResourceStateHistory Model</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model ResourceStateHistory {
  id                 String         @id @default(uuid())
  resourceId         String
  resource           Resource       @relation(fields: [resourceId], references: [id], onDelete: Cascade)
  
  previousStatus     ResourceStatus?
  newStatus          ResourceStatus
  previousPowerState PowerState?
  newPowerState      PowerState
  
  triggeredBy        String         // User ID or "SYSTEM_RECONCILIATION"
  reason             String?
  
  createdAt          DateTime       @default(now())
  
  @@index([resourceId, createdAt])
}`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Provider Adapters ====================
function ProviderAdaptersSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Cpu className="w-7 h-7 text-blue-400" />
          Provider Adapters — Three Implementations
        </h2>
        <p className="text-gray-400">رابط Provider Adapter و سه پیاده‌سازی برای Hybrid Multi-Source</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📐 Provider Adapter Interface</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`export interface ProviderAdapter {
  provision(request: ProvisionRequest): Promise<ProvisionResult>;
  deprovision(externalId: string): Promise<void>;
  getState(externalId: string): Promise<ResourceState>;
  powerOn(externalId: string): Promise<void>;
  powerOff(externalId: string): Promise<void>;
  reboot(externalId: string): Promise<void>;
  reinstall(externalId: string, templateId: string): Promise<void>;
  getConsoleAccess(externalId: string): Promise<ConsoleAccessDetails>;
}`}
          </pre>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-emerald-400 mb-3">🏢 OwnedProviderAdapter</h3>
          <p className="text-sm text-gray-300 mb-3">لایه ۱ — سرورهای مالکیتی ABRAN</p>
          <ul className="space-y-1 text-xs text-gray-400">
            <li>• Direct API calls به زیرساخت داخلی</li>
            <li>• کنترل کامل بر سخت‌افزار</li>
            <li>• کمترین تأخیر</li>
            <li>• ۱۰۰٪ درآمد متعلق به ABRAN</li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-amber-400 mb-3">🤝 IranianPartnerProviderAdapter</h3>
          <p className="text-sm text-gray-300 mb-3">لایه ۲ — دیتاسنترهای همکار ایرانی</p>
          <ul className="space-y-1 text-xs text-gray-400">
            <li>• API calls به سیستم‌های شریک</li>
            <li>• Revenue sharing tracked</li>
            <li>• Settlement خودکار</li>
            <li>• مدل Colocation</li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-indigo-400 mb-3">🌍 EuropeanProviderAdapter</h3>
          <p className="text-sm text-gray-300 mb-3">لایه ۳ — Hetzner, OVH, Leaseweb</p>
          <ul className="space-y-1 text-xs text-gray-400">
            <li>• REST API calls به ارائه‌دهندگان اروپایی</li>
            <li>• Fixed cost + margin</li>
            <li>• بدون ریسک تحریم</li>
            <li>• تأخیر بیشتر برای کاربران ایرانی</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

// ==================== Selection Engine ====================
function SelectionEngineSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-amber-400" />
          Provider Selection Engine
        </h2>
        <p className="text-gray-400">منطق انتخاب بهترین ارائه‌دهنده بر اساس معیارهای مختلف</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🎯 Selection Criteria</h3>
        <div className="space-y-3">
          {[
            { criterion: 'ProviderType', desc: 'فیلتر بر اساس نوع ارائه‌دهنده (در صورت مشخص بودن در Order)', weight: 'Required' },
            { criterion: 'healthStatus', desc: 'فقط ارائه‌دهندگان با وضعیت HEALTHY', weight: 'Required' },
            { criterion: 'score', desc: 'مرتب‌سازی بر اساس امتیاز (descending)', weight: 'High' },
            { criterion: 'costPerHour', desc: 'مرتب‌سازی بر اساس هزینه (ascending)', weight: 'Medium' },
            { criterion: 'location', desc: 'اولویت بر اساس موقعیت جغرافیایی', weight: 'Medium' },
            { criterion: 'capabilities', desc: 'بررسی پشتیبانی از OS و specs مورد نیاز', weight: 'Required' },
          ].map((item) => (
            <div key={item.criterion} className="flex items-start gap-3 p-3 bg-[#050816] rounded-lg border border-white/5">
              <Badge variant="info" size="sm" className="font-mono w-32 justify-center">
                {item.weight}
              </Badge>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{item.criterion}</h4>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 Selection Flow</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-4">
            {[
              { step: 1, title: 'Filter by ProviderType', desc: 'اگر Order نوع خاصی را مشخص کرده باشد' },
              { step: 2, title: 'Filter by healthStatus', desc: 'فقط ارائه‌دهندگان HEALTHY' },
              { step: 3, title: 'Filter by capabilities', desc: 'بررسی پشتیبانی از OS و specs' },
              { step: 4, title: 'Sort by score', desc: 'مرتب‌سازی بر اساس امتیاز (descending)' },
              { step: 5, title: 'Sort by costPerHour', desc: 'در صورت تساوی امتیاز، بر اساس هزینه' },
              { step: 6, title: 'Return best provider', desc: 'بازگرداندن ارائه‌دهنده با بالاترین رتبه' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
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
    </section>
  );
}

// ==================== Lifecycle Service ====================
function LifecycleServiceSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Server className="w-7 h-7 text-purple-400" />
          Lifecycle Service — State Machine & Self-Service
        </h2>
        <p className="text-gray-400">مدیریت چرخه حیات منابع با state machine و self-service capabilities</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 State Machine — Valid Transitions</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-3">
            {[
              { from: 'PENDING', to: 'PROVISIONING', action: 'Start provisioning' },
              { from: 'PROVISIONING', to: 'ACTIVE', action: 'Provisioning complete' },
              { from: 'ACTIVE', to: 'SUSPENDED', action: 'Suspend by admin' },
              { from: 'SUSPENDED', to: 'ACTIVE', action: 'Resume by admin' },
              { from: 'ACTIVE', to: 'TERMINATED', action: 'Terminate by user/admin' },
              { from: 'ACTIVE', to: 'ERROR', action: 'Error during operation' },
              { from: 'ERROR', to: 'ACTIVE', action: 'Retry after fix' },
            ].map((transition, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                <Badge variant="default" size="sm" className="font-mono">{transition.from}</Badge>
                <span className="text-gray-500">→</span>
                <Badge variant="success" size="sm" className="font-mono">{transition.to}</Badge>
                <span className="text-gray-400 text-xs flex-1">{transition.action}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">⚡ Power Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <h4 className="text-emerald-400 font-semibold text-sm mb-2">▶ Power ON</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• فقط اگر status === ACTIVE</li>
              <li>• Idempotent (تکرار خطا نمی‌دهد)</li>
              <li>• Audit log ثبت می‌شود</li>
            </ul>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <h4 className="text-red-400 font-semibold text-sm mb-2">■ Power OFF</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• فقط اگر status === ACTIVE</li>
              <li>• Idempotent</li>
              <li>• Audit log ثبت می‌شود</li>
            </ul>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <h4 className="text-amber-400 font-semibold text-sm mb-2">↻ Reboot</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• فقط اگر status === ACTIVE</li>
              <li>• Idempotent</li>
              <li>• Audit log ثبت می‌شود</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Reconciliation Loop ====================
function ReconciliationLoopSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <RefreshCw className="w-7 h-7 text-cyan-400" />
          Reconciliation Loop — Background Worker
        </h2>
        <p className="text-gray-400">همگام‌سازی Desired State با Actual State هر ۵ دقیقه</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔄 Reconciliation Flow</h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-4">
            {[
              { step: 1, title: 'Fetch all ACTIVE resources', desc: 'دریافت تمام منابع با status === ACTIVE' },
              { step: 2, title: 'Call adapter.getState()', desc: 'دریافت وضعیت واقعی از hypervisor برای هر منبع' },
              { step: 3, title: 'Compare states', desc: 'مقایسه actualState با resource.actualState در دیتابیس' },
              { step: 4, title: 'Detect drift', desc: 'اگر تفاوت وجود دارد، drift شناسایی می‌شود' },
              { step: 5, title: 'Update DB', desc: 'به‌روزرسانی resource.actualState و lastSyncedAt' },
              { step: 6, title: 'Create history', desc: 'ایجاد ResourceStateHistory record' },
              { step: 7, title: 'Publish event', desc: 'انتشار resource.state_drifted به NATS' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
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

      <Alert variant="info" title="⏱️ SLO Target">
        Reconciliation Loop باید ۱۰۰۰ منبع را در کمتر از ۵ دقیقه پردازش کند.
      </Alert>
    </section>
  );
}

// ==================== API Endpoints ====================
function APIEndpointsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <GitBranch className="w-7 h-7 text-blue-400" />
          API Endpoints — Lifecycle & Provisioning
        </h2>
        <p className="text-gray-400">تمام endpointهای پیاده‌سازی شده با Swagger documentation</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🎮 Lifecycle (Self-Service)</h3>
        <div className="space-y-2">
          {[
            { method: 'POST', path: '/lifecycle/resources/:id/power', desc: 'اجرای power action (on, off, reboot)', auth: true, perm: 'SERVICES_UPDATE' },
            { method: 'POST', path: '/lifecycle/resources/:id/reinstall', desc: 'نصب مجدد OS با template خاص', auth: true, perm: 'SERVICES_UPDATE' },
            { method: 'GET', path: '/lifecycle/resources/:id/console', desc: 'دریافت VNC/WebSSH console URL', auth: true, perm: 'SERVICES_READ' },
          ].map((ep) => (
            <div key={ep.path + ep.method} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-white/5">
              <Badge variant={ep.method === 'GET' ? 'info' : 'success'} size="sm" className="font-mono w-16 justify-center">
                {ep.method}
              </Badge>
              <code className="text-sm text-white font-mono flex-1" dir="ltr">{ep.path}</code>
              <span className="text-sm text-gray-400 flex-1">{ep.desc}</span>
              <Badge variant="default" size="sm">🔒 {ep.perm}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🔧 Admin/Provisioning</h3>
        <div className="space-y-2">
          {[
            { method: 'GET', path: '/provisioning/resources', desc: 'لیست منابع (با فیلتر status, provider)', auth: true, perm: 'SERVICES_READ' },
            { method: 'GET', path: '/provisioning/resources/:id', desc: 'جزئیات منبع و state history', auth: true, perm: 'SERVICES_READ' },
            { method: 'POST', path: '/provisioning/reconciliation/run', desc: 'اجرای دستی reconciliation', auth: true, perm: 'SYSTEM_CONFIG', role: 'Super Admin' },
          ].map((ep) => (
            <div key={ep.path + ep.method} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-white/5">
              <Badge variant={ep.method === 'GET' ? 'info' : 'success'} size="sm" className="font-mono w-16 justify-center">
                {ep.method}
              </Badge>
              <code className="text-sm text-white font-mono flex-1" dir="ltr">{ep.path}</code>
              <span className="text-sm text-gray-400 flex-1">{ep.desc}</span>
              <Badge variant="default" size="sm">🔒 {ep.role || ep.perm}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

// ==================== Event Schemas ====================
function EventSchemasSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-purple-400" />
          Event Schemas — Provisioning & Lifecycle
        </h2>
        <p className="text-gray-400">اسکیما رویدادهای منتشر شده به NATS JetStream</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📨 ResourceProvisionedEvent</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`export interface ResourceProvisionedEvent {
  eventId: string;
  timestamp: string;
   {
    resourceId: string;
    orderId: string;
    providerId: string;
    externalId: string;
    specs: any;
  };
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📨 ResourceStateDriftedEvent</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`export interface ResourceStateDriftedEvent {
  eventId: string;
  timestamp: string;
   {
    resourceId: string;
    expectedState: any;
    actualState: any;
  };
}`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Integration ====================
function IntegrationSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-emerald-400" />
          Integration & Security
        </h2>
        <p className="text-gray-400">یکپارچگی با سایر contextها و امنیت</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">🔐 Provisioning ↔ Identity</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>@UseGuards(JwtAuthGuard) و @Permissions('SERVICES_UPDATE') روی تمام Lifecycle endpoints</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>هر power/reinstall action یک entry غیرقابل تغییر در AuditLog ثبت می‌کند</span>
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4">🛒 Provisioning ↔ Ordering</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Provisioning worker به رویداد order.created گوش می‌دهد</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>پس از provisioning موفق، resource.provisioned منتشر می‌شود</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🎨 Provisioning ↔ Design System</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>پاسخ‌های API شامل sourceLayer و powerState برای رندر SourceLayerBadge و PowerControl</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>پیام‌های خطا استاندارد برای کامپوننت Alert</span>
          </li>
        </ul>
      </Card>
    </section>
  );
}

// ==================== Performance ====================
function PerformanceSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-orange-400" />
          Performance & Security
        </h2>
        <p className="text-gray-400">معیارهای عملکرد و امنیت</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-4xl font-black text-emerald-400 mb-2">&lt; 300ms</div>
          <h3 className="text-white font-bold mb-1">Lifecycle API</h3>
          <p className="text-gray-400 text-sm">p95 latency</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-black text-blue-400 mb-2">&lt; 5 min</div>
          <h3 className="text-white font-bold mb-1">Reconciliation</h3>
          <p className="text-gray-400 text-sm">1000 resources</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-black text-purple-400 mb-2">Audited</div>
          <h3 className="text-white font-bold mb-1">All Actions</h3>
          <p className="text-gray-400 text-sm">Immutable logs</p>
        </Card>
      </div>

      <Alert variant="success" title="✅ امنیت تضمین شده">
        <ul className="space-y-1 text-sm">
          <li>• تمام اکشن‌های مخرب (deprovision, reinstall) نیاز به تأیید صریح دارند</li>
          <li>• تمام تغییرات وضعیت به صورت غیرقابل تغییر audit می‌شوند</li>
          <li>• State machine از انتقال‌های غیرمجاز جلوگیری می‌کند</li>
          <li>• انطباق کامل با ABRAN SYSTEM Architecture v3.0</li>
        </ul>
      </Alert>
    </section>
  );
}

// ==================== Migration Command ====================
function MigrationSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Database className="w-7 h-7 text-cyan-400" />
          Database Migration
        </h2>
        <p className="text-gray-400">دستورات migration برای اعمال تغییرات schema</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🚀 Migration Commands</h3>
        <div className="space-y-3">
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <p className="text-xs text-gray-400 mb-2">۱. تولید migration:</p>
            <code className="text-sm text-emerald-400 font-mono block" dir="ltr">
              pnpm --filter @abran/database prisma migrate dev --name add-provisioning-lifecycle-models
            </code>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <p className="text-xs text-gray-400 mb-2">۲. اعمال migration:</p>
            <code className="text-sm text-emerald-400 font-mono block" dir="ltr">
              pnpm --filter @abran/database prisma migrate deploy
            </code>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <p className="text-xs text-gray-400 mb-2">۳. تولید Prisma Client:</p>
            <code className="text-sm text-emerald-400 font-mono block" dir="ltr">
              pnpm --filter @abran/database prisma generate
            </code>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Main Page ====================
export function ProvisioningPhase4() {
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
              <Server className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">فاز ۴: Provisioning & Lifecycle</h1>
              <p className="text-cyan-300 text-lg">Resource Management & Self-Service</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl leading-relaxed text-lg mb-6">
            پیاده‌سازی کامل Provisioning و Lifecycle Context با پشتیبانی از Hybrid Multi-Source Infrastructure
            از طریق سه Provider Adapter، Provider Selection Engine، Reconciliation Loop و Self-Service capabilities.
          </p>

          <div className="flex gap-3 flex-wrap">
            {['Provider Adapters', 'Selection Engine', 'State Machine', 'Reconciliation Loop', 'Self-Service', 'Zero Trust'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-medium border border-cyan-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <ValidationReport />
      <DatabaseSchemaSection />
      <ProviderAdaptersSection />
      <SelectionEngineSection />
      <LifecycleServiceSection />
      <ReconciliationLoopSection />
      <APIEndpointsSection />
      <EventSchemasSection />
      <IntegrationSection />
      <PerformanceSection />
      <MigrationSection />
    </div>
  );
}
