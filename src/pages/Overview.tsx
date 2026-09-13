import { Page } from '../App';

interface OverviewProps {
  onNavigate: (page: Page) => void;
}

export function Overview({ onNavigate }: OverviewProps) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 via-gray-900 to-purple-900/40 border border-gray-800 p-8">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/30">
              A
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">ABRAN SYSTEM</h1>
              <p className="text-blue-300 text-lg">پلتفرم ابری و دیتاسنتر — بازار ایران</p>
            </div>
          </div>
          
          <p className="text-gray-300 max-w-3xl leading-relaxed text-lg">
            پلتفرم ابری B2C/B2B با <strong className="text-white">زیرساخت ترکیبی چندمنبعی</strong>، 
            سیستم <strong className="text-white">تسهیم درآمد</strong>، طراحی <strong className="text-white">UX-First</strong>، 
            و قابلیت‌های پیشرفته BI. ارائه VPS، سرور اختصاصی، Bare Metal، GPU/AI، ذخیره‌سازی، پشتیبان‌گیری، 
            و شبکه با سیستم ریسلر جامع.
          </p>
          
          <div className="flex gap-3 mt-6 flex-wrap">
            <span className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30">Phase 0</span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">Hybrid Multi-Source</span>
            <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium border border-amber-500/30">Revenue Sharing</span>
            <span className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">RTL-First</span>
            <span className="px-3 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-sm font-medium border border-pink-500/30">UX-First</span>
          </div>
        </div>
      </div>

      {/* Hybrid Multi-Source Layers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>🌐</span> زیرساخت ترکیبی چندمنبعی
          </h2>
          <button 
            onClick={() => onNavigate('hybrid')}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            مشاهده جزئیات ←
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="layer-owned rounded-xl border p-5 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🏢</span>
              <div>
                <h3 className="text-emerald-400 font-bold">لایه ۱ — مالکیتی</h3>
                <p className="text-xs text-gray-400">Owned Infrastructure</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">سرورهای اختصاصی ABRAN در دیتاسنترهای ایران</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold">۱۰۰٪ درآمد</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 rounded text-emerald-400">کمترین هزینه</span>
            </div>
          </div>

          <div className="layer-partner rounded-xl border p-5 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🤝</span>
              <div>
                <h3 className="text-amber-400 font-bold">لایه ۲ — شرکای ایرانی</h3>
                <p className="text-xs text-gray-400">Iranian Partner DCs</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">دیتاسنترهای همکار با مدل Colocation</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400 font-semibold">تسهیم درآمد</span>
              <span className="px-2 py-0.5 bg-amber-500/20 rounded text-amber-400">مقیاس‌پذیر</span>
            </div>
          </div>

          <div className="layer-european rounded-xl border p-5 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🌍</span>
              <div>
                <h3 className="text-indigo-400 font-bold">لایه ۳ — اروپایی</h3>
                <p className="text-xs text-gray-400">European Providers</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">Hetzner، OVH، Leaseweb، DigitalOcean</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-400 font-semibold">هزینه ثابت + حاشیه</span>
              <span className="px-2 py-0.5 bg-indigo-500/20 rounded text-indigo-400">بدون ریسک تحریم</span>
            </div>
          </div>
        </div>
      </section>

      {/* C4 Context Diagram */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📊</span> نمودار C4 — نمای کلی سیستم
        </h2>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="bg-gray-950 rounded-lg p-6 border border-gray-700 overflow-x-auto">
            <pre className="text-xs text-gray-300 whitespace-pre font-mono leading-relaxed" dir="ltr">
{`┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ABRAN SYSTEM                                        │
│                                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Customer │  │ Reseller │  │  Admin   │  │ Partner  │  │ Provider │         │
│  │ (B2C/B2B)│  │  Portal  │  │  Portal  │  │   DCs    │  │ Systems  │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       │             │             │             │             │                  │
│       └─────────────┴─────────────┴─────────────┴─────────────┘                  │
│                             │                                                    │
│  ┌──────────────────────────▼──────────────────────────────────────────────┐    │
│  │                      API GATEWAY (NestJS)                               │    │
│  │           Auth │ Rate Limit │ Routing │ Validation │ i18n               │    │
│  └──────────────────────────┬──────────────────────────────────────────────┘    │
│                             │                                                    │
│  ┌──────────────────────────▼──────────────────────────────────────────────┐    │
│  │                       MODULAR MONOLITH                                   │    │
│  │                                                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │    │
│  │  │ Identity │ │ Ordering │ │Provisioning│ │ Lifecycle│ │ Financial│     │    │
│  │  │  + RBAC  │ │+ Visibility│ │+ Adapters│ │          │ │+ Revenue │     │    │
│  │  │          │ │           │ │           │ │          │ │  Split   │     │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │    │
│  │                                                                          │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │    │
│  │  │Inventory │ │  Config  │ │Provider- │ │Analytics │ │          │     │    │
│  │  │          │ │          │ │Intelligence│ │  + BI    │ │          │     │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │    │
│  └──────────────────────────────────────────────────────────────────────────┘    │
│                             │                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │PostgreSQL│ │  Redis   │ │  MinIO   │ │  NATS    │ │ClickHouse│             │
│  │  + Prisma│ │  + CDN   │ │  (S3)    │ │JetStream │ │  (BI)    │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘

External Systems:
  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ Keycloak │ │  Vault   │ │ Grafana  │ │  Hetzner │ │   OVH    │
  │ (Phase 2)│ │(Secrets) │ │+ Loki    │ │  (EU)    │ │  (EU)    │
  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘`}
            </pre>
          </div>
          <p className="text-sm text-gray-400 mt-4 italic">
            شکل ۱: نمودار C4 سطح ۱ — نمای کلی سیستم ABRAN و وابستگی‌های خارجی آن
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>💎</span> ویژگی‌های کلیدی
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'زیرساخت ترکیبی', desc: 'سه لایه ارائه‌دهنده با مدل‌های درآمدی متفاوت', icon: '🌐', color: 'blue' },
            { title: 'تسهیم درآمد', desc: 'محاسبه خودکار سهم شرکا و تسویه دوره‌ای', icon: '💰', color: 'amber' },
            { title: 'RBAC سه سطحی', desc: 'Super Admin / Admin / Operator با مجوزهای دقیق', icon: '🛡️', color: 'emerald' },
            { title: 'Visibility Toggle', desc: 'Public / Hidden / Deprecated / Invite-Only', icon: '👁️', color: 'purple' },
            { title: 'RTL-First', desc: 'طراحی راست‌چین با پشتیبانی کامل فارسی', icon: '🇮🇷', color: 'pink' },
            { title: 'Dark/Light Mode', desc: 'پشتیبانی از هر دو حالت تاریک و روشن', icon: '🌓', color: 'cyan' },
            { title: 'Performance Budget', desc: 'LCP < 2.5s, FID < 100ms, CLS < 0.1', icon: '⚡', color: 'orange' },
            { title: 'Accessibility', desc: 'WCAG 2.1 AA compliance با axe-core', icon: '♿', color: 'indigo' },
            { title: 'BI & Analytics', desc: 'داشبوردهای پیشرفته با ClickHouse', icon: '📊', color: 'green' },
          ].map((item) => (
            <div key={item.title} className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-gray-700 transition-all hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-white font-semibold">{item.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Catalog */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🖥️</span> کاتالوگ خدمات
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'VPS', icon: '🖥️' },
            { name: 'Dedicated', icon: '🏢' },
            { name: 'Bare Metal', icon: '⚡' },
            { name: 'GPU/AI', icon: '🧠' },
            { name: 'Storage', icon: '💾' },
            { name: 'Backup', icon: '🔄' },
            { name: 'Network', icon: '🌐' },
            { name: 'Reseller', icon: '🤝' },
          ].map((service) => (
            <div key={service.name} className="bg-gray-900 rounded-lg border border-gray-800 p-4 text-center hover:border-gray-600 transition-all hover:scale-[1.02]">
              <span className="text-3xl block mb-2">{service.icon}</span>
              <span className="text-sm text-gray-300 font-medium">{service.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
