import { useState } from 'react';
import { 
  Users, ShoppingCart, Cpu, Workflow, Scale, FileCode, Database,
  ChevronRight, Activity, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import { eventBus } from '../../shared/events/EventBus';

const contexts = [
  {
    id: 'identity',
    name: 'Identity Context',
    nameFa: 'هویت و دسترسی',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    description: 'احراز هویت، مجوزدهی و پروفایل‌های امنیتی',
    features: ['IAM / SSO / MFA', 'مدیریت کاربران و نقش‌ها', 'Multi-tenancy', 'RBAC / ABAC', 'API Keys & Tokens'],
    routes: ['/admin/users', '/admin/roles', '/admin/audit-log'],
    events: ['USER_CREATED', 'ROLE_ASSIGNED', 'LOGIN_SUCCESS'],
    status: 'active',
  },
  {
    id: 'ordering',
    name: 'Ordering Context',
    nameFa: 'سفارشات و تجارت',
    icon: ShoppingCart,
    color: 'from-emerald-500 to-emerald-600',
    description: 'کاتالوگ محصولات، قیمت‌گذاری، سبد خرید و پردازش سفارش',
    features: ['Product Catalog', 'Pricing & Packages', 'Order Management', 'Cart & Checkout', 'Order Events'],
    routes: ['/admin/orders', '/admin/pricing', '/admin/coupons'],
    events: ['ORDER_CREATED', 'ORDER_PAID', 'PAYMENT_RECEIVED'],
    status: 'active',
  },
  {
    id: 'provisioning',
    name: 'Provisioning Context',
    nameFa: 'چرخه حیات منابع',
    icon: Cpu,
    color: 'from-purple-500 to-purple-600',
    description: 'ایجاد، تغییر و حذف منابع ابری',
    features: ['Resource Management', 'Provisioning Engine', 'Stateless Workers', 'Operation Events'],
    routes: ['/admin/provisioning-queue', '/admin/resource-lifecycle'],
    events: ['RESOURCE_PROVISIONED', 'RESOURCE_FAILED', 'MIGRATION_COMPLETED'],
    status: 'active',
  },
  {
    id: 'ops',
    name: 'Platform Ops Context',
    nameFa: 'عملیات پلتفرم',
    icon: Workflow,
    color: 'from-amber-500 to-amber-600',
    description: 'ورک‌فلوها، زمان‌بندی و سلامت سیستم',
    features: ['Workflow Engine', 'Reconciliation Engine', 'Scheduler', 'Notification Service', 'Audit Logs'],
    routes: ['/admin/workflows', '/admin/scheduler', '/admin/notifications'],
    events: ['WORKFLOW_COMPLETED', 'HEALTH_CHECK_PASSED', 'NOTIFICATION_SENT'],
    status: 'active',
  },
  {
    id: 'policy',
    name: 'Policy Context',
    nameFa: 'حاکمیت و سیاست‌ها',
    icon: Scale,
    color: 'from-rose-500 to-rose-600',
    description: 'قوانین، سهمیه‌ها و اجرای انطباق',
    features: ['Policy Engine (OPA)', 'Quota Management', 'Tenant Isolation', 'Rate Limiting', 'Compliance Rules'],
    routes: ['/admin/policies', '/admin/quotas', '/admin/compliance'],
    events: ['POLICY_EVALUATED', 'QUOTA_EXCEEDED', 'COMPLIANCE_FLAG'],
    status: 'active',
  },
  {
    id: 'config',
    name: 'Config & Template Context',
    nameFa: 'پیکربندی و قالب‌ها',
    icon: FileCode,
    color: 'from-cyan-500 to-cyan-600',
    description: 'قالب‌های Infrastructure as Code و مدیریت پیکربندی',
    features: ['Template Catalog', 'Configuration Mgmt', 'Versioning & Diff', 'Parameter Store'],
    routes: ['/admin/templates', '/admin/images', '/admin/config-store'],
    events: ['TEMPLATE_CREATED', 'SSH_KEY_ADDED', 'CONFIG_UPDATED'],
    status: 'active',
  },
  {
    id: 'inventory',
    name: 'Inventory (CMDB) Context',
    nameFa: 'موجودی و CMDB',
    icon: Database,
    color: 'from-indigo-500 to-indigo-600',
    description: 'منبع واحد حقیقت برای تمام دارایی‌های فیزیکی و مجازی',
    features: ['Resource Inventory', 'Topology & Dependency', 'Asset Management', 'State of Truth'],
    routes: ['/admin/inventory', '/admin/topology-map', '/admin/assets'],
    events: ['ITEM_ADDED', 'TOPOLOGY_UPDATED', 'DRIFT_DETECTED'],
    status: 'active',
  },
];

export function BoundedContexts() {
  const [selectedContext, setSelectedContext] = useState<string | null>(null);
  const eventHistory = eventBus.getHistory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Bounded Contexts (DDD)</h1>
        <p className="text-gray-400 text-sm mt-1">معماری میکروسرویس با ۷ حوزه محدود مستقل</p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-bold text-white mb-4">نمای کلی معماری Event-Driven</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {contexts.map((ctx) => {
            const Icon = ctx.icon;
            return (
              <button
                key={ctx.id}
                onClick={() => setSelectedContext(selectedContext === ctx.id ? null : ctx.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedContext === ctx.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ctx.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-bold text-white">{ctx.nameFa}</div>
                <div className="text-xs text-gray-400 mt-1">{ctx.name}</div>
              </button>
            );
          })}
        </div>

        {/* Event Flow */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-sm font-bold text-white mb-3">جریان رویدادها (Event Flow)</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded">Ordering</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500">OrderPaid</span>
            <ChevronRight className="w-3 h-3" />
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">Provisioning</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500">ResourceCreated</span>
            <ChevronRight className="w-3 h-3" />
            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded">Inventory</span>
            <ChevronRight className="w-3 h-3" />
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded">Ops</span>
          </div>
        </div>
      </div>

      {/* Context Details */}
      {selectedContext && (
        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
          {(() => {
            const ctx = contexts.find(c => c.id === selectedContext)!;
            const Icon = ctx.icon;
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ctx.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{ctx.nameFa}</h2>
                    <p className="text-sm text-gray-400">{ctx.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Features */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">ویژگی‌ها</h3>
                    <ul className="space-y-1">
                      {ctx.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Routes */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">مسیرهای UI</h3>
                    <ul className="space-y-1">
                      {ctx.routes.map((r, i) => (
                        <li key={i} className="text-xs text-gray-400 font-mono" dir="ltr">{r}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Events */}
                  <div>
                    <h3 className="text-sm font-bold text-white mb-2">رویدادهای منتشر شده</h3>
                    <ul className="space-y-1">
                      {ctx.events.map((e, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                          <Activity className="w-3 h-3 text-blue-400" />
                          <span className="font-mono" dir="ltr">{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Event Bus Monitor */}
      <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">مانیتور Event Bus</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs text-gray-400">
              {eventBus.getSubscriberCount()} subscriber فعال
            </span>
          </div>
        </div>

        {eventHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">هنوز رویدادی منتشر نشده است</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {eventHistory.slice().reverse().map((event, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                <Activity className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-white truncate" dir="ltr">
                    {event.eventType}
                  </div>
                  <div className="text-xs text-gray-500">
                    از: {event.sourceContext} • {event.timestamp.toLocaleTimeString('fa-IR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Separation of Concerns */}
      <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-bold text-white mb-4">اصل جداسازی مسئولیت‌ها</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">مجاز</span>
            </div>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Ordering → Event → Provisioning</li>
              <li>• Provisioning → Event → Inventory</li>
              <li>• هر Context فقط از طریق Event Bus ارتباط می‌گیرد</li>
            </ul>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">ممنوع</span>
            </div>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• Ordering → مستقیم → Inventory ❌</li>
              <li>• Provisioning → مستقیم → Billing ❌</li>
              <li>• هیچ Context نباید مستقیماً DB دیگری را تغییر دهد</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
