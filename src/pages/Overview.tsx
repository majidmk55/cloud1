import { Cloud, Zap, Shield, Globe, TrendingUp, Users, Eye, BarChart3, ArrowLeft } from 'lucide-react';

interface OverviewProps {
  onNavigate: (page: string) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/50 via-[#0a0f1f] to-purple-950/50 border border-white/10 p-10">
        <div className="absolute inset-0 grid-pattern opacity-50"></div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="relative">
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-float">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0a0f1f] animate-pulse-slow"></div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-5xl font-black text-white tracking-tight">ABRAN</h1>
                <span className="text-5xl font-black gradient-text">SYSTEM</span>
              </div>
              <p className="text-blue-300 text-lg font-medium">پلتفرم ابری و دیتاسنتر — بازار ایران</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl leading-loose text-lg mb-8">
            پلتفرم ابری B2C/B2B با{' '}
            <strong className="text-white">زیرساخت ترکیبی چندمنبعی</strong>، سیستم{' '}
            <strong className="text-white">تسهیم درآمد</strong>، طراحی{' '}
            <strong className="text-white">UX-First</strong> و قابلیت‌های پیشرفته BI.
          </p>

          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Phase 0', color: 'blue' },
              { label: 'Hybrid Multi-Source', color: 'emerald' },
              { label: 'Revenue Sharing', color: 'amber' },
              { label: 'RTL-First', color: 'purple' },
              { label: 'UX-First', color: 'pink' },
              { label: 'WCAG 2.1 AA', color: 'cyan' },
            ].map((tag) => (
              <span
                key={tag.label}
                className={`px-4 py-1.5 rounded-full bg-${tag.color}-500/10 text-${tag.color}-300 text-sm font-medium border border-${tag.color}-500/20`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hybrid Multi-Source Layers */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-400" />
            زیرساخت ترکیبی چندمنبعی
          </h2>
          <button
            onClick={() => onNavigate('hybrid')}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors group"
          >
            <span>مشاهده جزئیات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="layer-owned rounded-2xl border p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">🏢</div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30 font-mono" dir="ltr">
                Layer 1
              </span>
            </div>
            <h3 className="text-emerald-400 font-bold text-lg mb-1">مالکیتی</h3>
            <p className="text-xs text-gray-500 mb-3">Owned Infrastructure</p>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              سرورهای اختصاصی ABRAN در دیتاسنترهای ایران
            </p>
            <div className="pt-4 border-t border-emerald-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">سهم درآمد</span>
                <span className="text-emerald-400 font-bold text-lg">۱۰۰٪</span>
              </div>
            </div>
          </div>

          <div className="layer-partner rounded-2xl border p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl">🤝</div>
              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30 font-mono" dir="ltr">
                Layer 2
              </span>
            </div>
            <h3 className="text-amber-400 font-bold text-lg mb-1">شرکای ایرانی</h3>
            <p className="text-xs text-gray-500 mb-3">Iranian Partner DCs</p>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              دیتاسنترهای همکار با مدل Colocation
            </p>
            <div className="pt-4 border-t border-amber-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">تسهیم درآمد</span>
                <span className="text-amber-400 font-bold text-lg">۷۰/۳۰</span>
              </div>
            </div>
          </div>

          <div className="layer-european rounded-2xl border p-6 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl">🌍</div>
              <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/30 font-mono" dir="ltr">
                Layer 3
              </span>
            </div>
            <h3 className="text-indigo-400 font-bold text-lg mb-1">ارائه‌دهندگان اروپایی</h3>
            <p className="text-xs text-gray-500 mb-3">European Providers</p>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              Hetzner، OVH، Leaseweb، DigitalOcean
            </p>
            <div className="pt-4 border-t border-indigo-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">حاشیه سود</span>
                <span className="text-indigo-400 font-bold text-lg">۳۰-۵۰٪</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Zap className="w-6 h-6 text-amber-400" />
          ویژگی‌های کلیدی
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: 'زیرساخت ترکیبی', desc: 'سه لایه ارائه‌دهنده با مدل‌های درآمدی متفاوت', color: 'blue' },
            { icon: TrendingUp, title: 'تسهیم درآمد', desc: 'محاسبه خودکار سهم شرکا و تسویه دوره‌ای', color: 'amber' },
            { icon: Shield, title: 'RBAC سه‌سطحی', desc: 'Super Admin / Admin / Operator', color: 'emerald' },
            { icon: Eye, title: 'Visibility Toggle', desc: 'Public / Hidden / Deprecated / Invite-Only', color: 'purple' },
            { icon: Users, title: 'RTL-First', desc: 'طراحی راست‌چین با فونت Vazirmatn', color: 'pink' },
            { icon: BarChart3, title: 'BI & Analytics', desc: 'داشبوردهای پیشرفته با ClickHouse', color: 'cyan' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-all hover:scale-[1.02] group"
              >
                <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/10 border border-${item.color}-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 text-${item.color}-400`} />
                </div>
                <h3 className="text-white font-bold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* C4 Context Diagram */}
      <section className="space-y-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          نمودار C4 — نمای کلی سیستم
        </h2>
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
          <div className="bg-[#050816] rounded-xl p-6 border border-white/5 overflow-x-auto">
            <pre className="text-xs text-gray-300 whitespace-pre font-mono leading-relaxed" dir="ltr">
{`┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ABRAN SYSTEM                                        │
│                                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Customer │  │ Reseller │  │  Admin   │  │ Partner  │  │ Provider │         │
│  │ (B2C/B2B)│  │  Portal  │  │  Portal  │  │   DCs    │  │ Systems  │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       └─────────────┴─────────────┴─────────────┴─────────────┘                  │
│                             │                                                    │
│  ┌──────────────────────────▼──────────────────────────────────────────────┐    │
│  │                      API GATEWAY (NestJS)                               │    │
│  │           Auth │ Rate Limit │ Routing │ Validation │ i18n (fa/en)       │    │
│  └──────────────────────────┬──────────────────────────────────────────────┘    │
│                             │                                                    │
│  ┌──────────────────────────▼──────────────────────────────────────────────┐    │
│  │                       MODULAR MONOLITH                                   │    │
│  │                                                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │    │
│  │  │ Identity │ │ Ordering │ │Provisioning│ │ Lifecycle│ │ Financial│     │    │
│  │  │  + RBAC  │ │+ Visibility│ │+ Adapters│ │          │ │+ Revenue │     │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │  Split   │     │    │
│  │                                                       └──────────┘     │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │    │
│  │  │Inventory │ │  Config  │ │Provider- │ │Analytics │                  │    │
│  │  │          │ │          │ │Intelligence│ │  + BI    │                  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │    │
│  └──────────────────────────────────────────────────────────────────────────┘    │
│                             │                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │PostgreSQL│ │  Redis   │ │  MinIO   │ │  NATS    │ │ClickHouse│             │
│  │  + Prisma│ │  + CDN   │ │  (S3)    │ │JetStream │ │  (BI)    │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘`}
            </pre>
          </div>
          <p className="text-sm text-gray-500 mt-4 italic text-center">
            شکل ۱: نمودار C4 سطح ۱ — نمای کلی سیستم ABRAN و وابستگی‌های خارجی
          </p>
        </div>
      </section>
    </div>
  );
}
