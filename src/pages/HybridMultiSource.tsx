export function HybridMultiSource() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🌐</span> زیرساخت ترکیبی چندمنبعی
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          مدل زیرساختی ABRAN از سه لایه مجزا تشکیل شده که هر کدام مدل درآمدی، SLA، و ویژگی‌های خاص خود را دارند.
          سیستم به صورت هوشمند بهترین ارائه‌دهنده را بر اساس نیاز مشتری، موقعیت، و هزینه انتخاب می‌کند.
        </p>
      </div>

      {/* Three Layers Detail */}
      <div className="space-y-6">
        {/* Layer 1 - Owned */}
        <div className="layer-owned rounded-xl border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-3xl">
              🏢
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-emerald-400">لایه ۱ — زیرساخت مالکیتی</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                  ۱۰۰٪ درآمد
                </span>
              </div>
              <p className="text-gray-400 text-sm">Owned Infrastructure — ABRAN's own servers in Iranian DCs</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">مشخصات</h3>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li>• سرورهای اختصاصی در دیتاسنترهای آسیاتک، پارس‌آنلاین، نور</li>
                <li>• کنترل کامل بر سخت‌افزار و شبکه</li>
                <li>• کمترین تأخیر برای کاربران ایرانی</li>
                <li>• حاشیه سود بالا (۱۰۰٪ درآمد متعلق به ABRAN)</li>
                <li>• ظرفیت محدود — نیاز به برنامه‌ریزی برای توسعه</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">مدل درآمدی</h3>
              <div className="bg-gray-950 rounded-lg p-4 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">سهم ABRAN</span>
                  <span className="text-emerald-400 font-bold">۱۰۰٪</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">فقط هزینه عملیاتی (برق، شبکه، نگهداری)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 2 - Iranian Partner */}
        <div className="layer-partner rounded-xl border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center text-3xl">
              🤝
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-amber-400">لایه ۲ — شرکای ایرانی</h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
                  تسهیم درآمد
                </span>
              </div>
              <p className="text-gray-400 text-sm">Iranian Partner DCs — Colocation partners with Revenue Sharing</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-amber-400 mb-2">مشخصات</h3>
              <ul className="space-y-1.5 text-sm text-gray-300">
                <li>• همکاری با دیتاسنترهای ایرانی معتبر</li>
                <li>• مدل Colocation — تجهیزات متعلق به ABRAN، فضا متعلق به شریک</li>
                <li>• مقیاس‌پذیری سریع بدون سرمایه‌گذاری سنگین</li>
                <li>• تأخیر کم (مشابه لایه ۱)</li>
                <li>• تسهیم درآمد بر اساس قرارداد (معمولاً ۷۰/۳۰ یا ۶۰/۴۰)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-400 mb-2">مدل درآمدی</h3>
              <div className="bg-gray-950 rounded-lg p-4 border border-amber-500/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">سهم ABRAN</span>
                    <span className="text-amber-400 font-bold">۷۰٪</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">سهم شریک</span>
                    <span className="text-amber-400 font-bold">۳۰٪</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden mt-3 flex">
                  <div className="bg-amber-500 h-full" style={{ width: '70%' }}></div>
                  <div className="bg-amber-700 h-full" style={{ width: '30%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">تسویه ماهانه یا هفتگی بر اساس قرارداد</p>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3 - European */}
        <div className="layer-european rounded-xl border p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center text-3xl">
              🌍
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-indigo-400">لایه ۳ — ارائه‌دهندگان اروپایی</h2>
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/30">
                  بدون ریسک تحریم
                </span>
              </div>
              <p className="text-gray-400 text-sm">European Providers — Hetzner, OVH, Leaseweb, DigitalOcean</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">ارائه‌دهندگان</h3>
              <div className="space-y-2">
                {[
                  { name: 'Hetzner', location: 'آلمان / فنلاند', cost: '€' },
                  { name: 'OVH', location: 'فرانسه', cost: '€€' },
                  { name: 'Leaseweb', location: 'هلند', cost: '€€' },
                  { name: 'DigitalOcean', location: 'آلمان / هلند', cost: '€€€' },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between bg-gray-950 rounded-lg p-3 border border-indigo-500/20">
                    <div>
                      <span className="text-white font-medium text-sm">{p.name}</span>
                      <span className="text-gray-500 text-xs mr-2">({p.location})</span>
                    </div>
                    <span className="text-indigo-400 text-xs">{p.cost}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-indigo-400 mb-2">مدل درآمدی</h3>
              <div className="bg-gray-950 rounded-lg p-4 border border-indigo-500/20">
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
                <p className="text-xs text-gray-500 mt-2">۴۰٪ حاشیه ABRAN + ۶۰٪ هزینه ارائه‌دهنده</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Selection Engine */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>🧠</span> موتور انتخاب ارائه‌دهنده
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          سیستم به صورت هوشمند بهترین ارائه‌دهنده را بر اساس فاکتورهای زیر انتخاب می‌کند:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { factor: 'موقعیت جغرافیایی', icon: '📍', desc: 'نزدیکی به کاربر نهایی' },
            { factor: 'دسترسی‌پذیری', icon: '✅', desc: 'موجودی منابع' },
            { factor: 'هزینه', icon: '💰', desc: 'بهینه‌سازی حاشیه سود' },
            { factor: 'SLA', icon: '📊', desc: 'تضمین سطح خدمات' },
            { factor: 'نوع سرویس', icon: '🖥️', desc: 'VPS, Dedicated, GPU' },
            { factor: 'اولویت مشتری', icon: '⭐', desc: 'ترجیحات مشتری' },
          ].map((f) => (
            <div key={f.factor} className="bg-gray-950 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <span>{f.icon}</span>
                <span className="text-white text-sm font-medium">{f.factor}</span>
              </div>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Flow */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>💸</span> جریان درآمد
        </h2>
        <div className="bg-gray-950 rounded-lg p-6 border border-gray-700">
          <pre className="text-xs text-gray-300 whitespace-pre font-mono leading-relaxed" dir="ltr">
{`
Customer Payment (100%)
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
└───────────────────┘
`}
          </pre>
        </div>
      </div>
    </div>
  );
}
