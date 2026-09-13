import { Globe } from 'lucide-react';

export function HybridMultiSource() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <Globe className="w-10 h-10 text-blue-400" />
          زیرساخت ترکیبی چندمنبعی
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
          مدل زیرساختی ABRAN از سه لایه مجزا تشکیل شده که هر کدام مدل درآمدی، SLA، و ویژگی‌های خاص خود را دارند.
        </p>
      </div>

      {/* Three Layers Detail */}
      <div className="space-y-6">
        {/* Layer 1 */}
        <div className="layer-owned rounded-2xl border p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-4xl">🏢</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-emerald-400">لایه ۱ — زیرساخت مالکیتی</h2>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30 font-mono" dir="ltr">
                  OWNED
                </span>
              </div>
              <p className="text-gray-400">Owned Infrastructure — ABRAN's own servers in Iranian DCs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-emerald-400 mb-3">مشخصات</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> سرورهای اختصاصی در دیتاسنترهای آسیاتک، پارس‌آنلاین، نور</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> کنترل کامل بر سخت‌افزار و شبکه</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> کمترین تأخیر برای کاربران ایرانی</li>
                <li className="flex items-start gap-2"><span className="text-emerald-400">•</span> حاشیه سود بالا (۱۰۰٪ درآمد)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-400 mb-3">مدل درآمدی</h3>
              <div className="bg-[#050816] rounded-xl p-5 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">سهم ABRAN</span>
                  <span className="text-emerald-400 font-black text-2xl">۱۰۰٪</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-l from-emerald-400 to-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2 */}
        <div className="layer-partner rounded-2xl border p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-4xl">🤝</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-amber-400">لایه ۲ — شرکای ایرانی</h2>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30 font-mono" dir="ltr">
                  IRANIAN_PARTNER
                </span>
              </div>
              <p className="text-gray-400">Iranian Partner DCs — Colocation partners with Revenue Sharing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-amber-400 mb-3">مشخصات</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><span className="text-amber-400">•</span> همکاری با دیتاسنترهای ایرانی معتبر</li>
                <li className="flex items-start gap-2"><span className="text-amber-400">•</span> مدل Colocation</li>
                <li className="flex items-start gap-2"><span className="text-amber-400">•</span> مقیاس‌پذیری سریع</li>
                <li className="flex items-start gap-2"><span className="text-amber-400">•</span> تسهیم درآمد ۷۰/۳۰</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-400 mb-3">مدل درآمدی</h3>
              <div className="bg-[#050816] rounded-xl p-5 border border-amber-500/20">
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">سهم ABRAN</span>
                    <span className="text-amber-400 font-bold">۷۰٪</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">سهم شریک</span>
                    <span className="text-amber-400 font-bold">۳۰٪</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden flex">
                  <div className="bg-amber-500 h-full" style={{ width: '70%' }}></div>
                  <div className="bg-amber-800 h-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3 */}
        <div className="layer-european rounded-2xl border p-8">
          <div className="flex items-start gap-5 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-4xl">🌍</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-indigo-400">لایه ۳ — ارائه‌دهندگان اروپایی</h2>
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/30 font-mono" dir="ltr">
                  EUROPEAN
                </span>
              </div>
              <p className="text-gray-400">European Providers — Hetzner, OVH, Leaseweb, DigitalOcean</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-indigo-400 mb-3">ارائه‌دهندگان</h3>
              <div className="space-y-2">
                {[
                  { name: 'Hetzner', location: 'آلمان / فنلاند', cost: '€' },
                  { name: 'OVH', location: 'فرانسه', cost: '€€' },
                  { name: 'Leaseweb', location: 'هلند', cost: '€€' },
                  { name: 'DigitalOcean', location: 'آلمان', cost: '€€€' },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between bg-[#050816] rounded-lg p-3 border border-indigo-500/20">
                    <div>
                      <span className="text-white font-medium text-sm">{p.name}</span>
                      <span className="text-gray-500 text-xs mr-2">({p.location})</span>
                    </div>
                    <span className="text-indigo-400 text-xs font-mono" dir="ltr">{p.cost}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-400 mb-3">مدل درآمدی</h3>
              <div className="bg-[#050816] rounded-xl p-5 border border-indigo-500/20">
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">هزینه ارائه‌دهنده</span>
                    <span className="text-gray-300 font-medium">Fixed Cost</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">حاشیه ABRAN</span>
                    <span className="text-indigo-400 font-bold">۳۰-۵۰٪</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden flex">
                  <div className="bg-indigo-500 h-full" style={{ width: '40%' }}></div>
                  <div className="bg-gray-600 h-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Flow */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">💸 جریان درآمد</h2>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 whitespace-pre font-mono leading-relaxed" dir="ltr">
{`Customer Payment (100%)
        │
        ▼
┌───────────────────┐
│   ABRAN SYSTEM    │
│   (API Gateway)   │
└─────────┬─────────┘
          │
    ┌─────┴─────┬─────────────┐
    │           │             │
    ▼           ▼             ▼
┌────────┐ ┌────────┐   ┌────────┐
│ Layer 1│ │ Layer 2│   │ Layer 3│
│ OWNED  │ │PARTNER │   │EUROPE  │
│        │ │        │   │        │
│ 100%   │ │ 70/30  │   │Fixed+  │
│ ABRAN  │ │ Split  │   │Margin  │
└────────┘ └────────┘   └────────┘
    │           │             │
    │           ▼             ▼
    │    ┌────────────┐  ┌────────┐
    │    │  Partner   │  │Provider│
    │    │Settlement  │  │ Invoice│
    │    │(Monthly)   │  │(Monthly│
    │    └────────────┘  └────────┘
    │
    ▼
┌───────────────────┐
│  ABRAN Revenue    │
│  - Operating Cost │
│  - Reseller Comm. │
│  - Net Profit     │
└───────────────────┘`}
          </pre>
        </div>
      </div>
    </div>
  );
}
