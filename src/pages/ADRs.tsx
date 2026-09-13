import { useState } from 'react';

interface ADR {
  id: string;
  title: string;
  titleEn: string;
  status: string;
  summary: string;
  decision: string;
  consequences: string[];
}

const adrs: ADR[] = [
  { id: '0001', title: 'معماری Modular Monolith', titleEn: 'Modular Monolith Architecture', status: 'Accepted', summary: 'چرا Modular Monolith به جای Microservices برای MVP', decision: 'استفاده از Modular Monolith با Bounded Contexts سخت. هر ماژول اسکیما دیتابیس مستقل دارد، از طریق contracts ارتباط برقرار می‌کند، و در آینده قابل استخراج به microservice است.', consequences: ['✅ توسعه سریع‌تر', '✅ دیباگ ساده‌تر', '✅ بار DevOps کمتر', '⚠️ نیاز به نظم در رعایت مرزها'] },
  { id: '0002', title: 'تعریف Bounded Contexts', titleEn: 'Bounded Contexts Definition', status: 'Accepted', summary: 'تعریف ۹ محدوده مرزی و مرزهای سخت آن‌ها', decision: '۹ Bounded Context: Identity, Ordering, Provisioning, Lifecycle, Financial, Inventory, Config, Provider-Intelligence, Analytics. هر کدام با مالکیت داده مستقل.', consequences: ['✅ مالکیت واضح', '✅ تکامل مستقل', '✅ ایزوله بودن داده', '⚠️ eventual consistency بین contextها'] },
  { id: '0003', title: 'نسخه‌بندی Event Schema', titleEn: 'Event Schema Versioning', status: 'Accepted', summary: 'استراتژی نسخه‌بندی و سازگاری schema رویدادها', decision: 'استفاده از JSON Schema با قوانین BACKWARD/FORWARD/FULL compatibility. Dual-Publish 90 روزه برای مهاجرت.', consequences: ['✅ تکامل امن', '✅ مسیر مهاجرت واضح', '✅ CI enforcement', '⚠️ payload بزرگتر'] },
  { id: '0004', title: 'مدل‌های Consistency', titleEn: 'Consistency Models', status: 'Accepted', summary: 'Strong (Financial) در مقابل Eventually Consistent (Inventory/Lifecycle)', decision: 'Financial با SERIALIZABLE isolation و double-entry bookkeeping. بقیه contextها با eventual consistency و reconciliation loop.', consequences: ['✅ امنیت مالی', '✅ عملکرد بالا', '✅ بازیابی خودکار', '⚠️ پیچیدگی دو مدل'] },
  { id: '0005', title: 'RBAC سه‌سطحی Admin', titleEn: 'Admin RBAC 3-Level', status: 'Accepted', summary: 'ماتریس مجوزها برای Super Admin / Admin / Operator', decision: 'Super Admin: دسترسی کامل. Admin: عملیات روزانه بدون تنظیمات حساس. Operator: فقط خواندن و تیکت‌ها.', consequences: ['✅ جدایی وظایف', '✅ audit trail', '✅ MFA برای نقش‌های ویژه', '⚠️ پیچیدگی ماتریس'] },
  { id: '0006', title: 'Visibility Toggle', titleEn: 'Service Visibility Toggle', status: 'Accepted', summary: 'حالت‌های Public / Hidden / Deprecated / Invite-Only', decision: '۴ حالت visibility. Public: قابل مشاهده و خرید. Hidden: فقط با لینک مستقیم. Deprecated: بدون خرید جدید. Invite-Only: فقط برای مشتریان دعوت‌شده.', consequences: ['✅ انعطاف‌پذیری', '✅ کاتالوگ تمیز', '✅ deprecation ملایم', '⚠️ race conditions'] },
  { id: '0007', title: 'Turborepo + pnpm', titleEn: 'Turborepo Monorepo', status: 'Accepted', summary: 'چرا Turborepo + pnpm به جای Nx یا Lerna', decision: 'Turborepo با caching خودکار، اجرای موازی، و remote caching. pnpm برای disk efficiency و strict dependency resolution.', consequences: ['✅ build سریع', '✅ setup ساده', '✅ DX عالی', '⚠️ اکوسیستم کوچکتر'] },
  { id: '0008', title: 'تکنولوژی‌های Deferred', titleEn: 'Deferred Technologies', status: 'Accepted', summary: 'تعویق Temporal, Keycloak, NATS, Kubernetes به فازهای بعد', decision: 'MVP: PostgreSQL Outbox + BullMQ + Custom JWT + EventEmitter + Docker Compose. فازهای بعدی: Temporal (Phase 3), Keycloak (Phase 2), NATS (Phase 2), K8s (Phase 4).', consequences: ['✅ MVP سریع‌تر', '✅ پیچیدگی کمتر', '✅ پذیرش اثبات‌شده', '⚠️ بدهی فنی'] },
  { id: '0009', title: 'زیرساخت ترکیبی چندمنبعی', titleEn: 'Hybrid Multi-Source Infrastructure', status: 'Accepted', summary: 'مدل سه‌لایه: Owned / Iranian Partner / European', decision: 'لایه ۱: سرورهای مالکیتی ABRAN (۱۰۰٪ درآمد). لایه ۲: شرکای ایرانی (Revenue Share). لایه ۳: ارائه‌دهندگان اروپایی (Fixed Cost + Margin).', consequences: ['✅ بهینه‌سازی هزینه', '✅ بدون ریسک تحریم', '✅ مقیاس‌پذیری', '⚠️ پیچیدگی مدیریت چند ارائه‌دهنده'] },
  { id: '0010', title: 'مدل Revenue Sharing', titleEn: 'Revenue Sharing Model', status: 'Accepted', summary: 'تسهیم درآمد با Partner DCs و فرآیند تسویه', decision: 'محاسبه خودکار سهم ABRAN و شریک بر اساس قرارداد. تسویه ماهانه/هفتگی با dual approval. ثبت در FinancialLedger.', consequences: ['✅ تسویه خودکار', '✅ شفافیت مالی', '✅ گزارش‌گیری', '⚠️ پیچیدگی حسابداری'] },
  { id: '0011', title: 'رویکرد Design System', titleEn: 'Design System Approach', status: 'Accepted', summary: 'UX-First, RTL-First, Storybook, shadcn/ui', decision: 'shadcn/ui به عنوان پایه. Storybook برای documentation. Vazirmatn font برای فارسی. Tailwind CSS با custom tokens. Dark/Light mode.', consequences: ['✅ UX حرفه‌ای', '✅ RTL کامل', '✅ consistency', '⚠️ نیاز به maintenance'] },
  { id: '0012', title: 'Performance Budget', titleEn: 'Performance Budget', status: 'Accepted', summary: 'LCP < 2.5s, FID < 100ms, CLS < 0.1', decision: 'Lighthouse CI در pipeline. Web Vitals tracking. CDN Edge Cache. Image optimization. Code splitting. Lazy loading.', consequences: ['✅ UX سریع', '✅ SEO بهتر', '✅ conversion بالاتر', '⚠️ نیاز به monitoring مداوم'] },
];

export function ADRs() {
  const [expandedADR, setExpandedADR] = useState<string | null>('0001');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>📋</span> تصمیمات معماری (ADRs)
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          ۱۲ سند تصمیم معماری که تمام انتخاب‌های مهم سیستم را مستند می‌کنند.
          هر ADR شامل Context، Decision، Consequences و Alternatives است.
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-gray-400">Accepted: {adrs.filter(a => a.status === 'Accepted').length}</span>
        </span>
        <span className="text-gray-600">|</span>
        <span className="text-gray-400">مجموع: {adrs.length} ADR</span>
      </div>

      <div className="space-y-3">
        {adrs.map((adr) => (
          <div key={adr.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <button
              onClick={() => setExpandedADR(expandedADR === adr.id ? null : adr.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-right"
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  ADR-{adr.id}
                </span>
                <div className="text-right">
                  <h3 className="text-white font-semibold text-sm">{adr.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5" dir="ltr">{adr.titleEn}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full border border-emerald-500/30">
                  {adr.status}
                </span>
                <span className={`text-gray-400 text-xs transition-transform ${expandedADR === adr.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {expandedADR === adr.id && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-800 pt-4">
                <div>
                  <h4 className="text-xs font-semibold text-blue-400 mb-1">خلاصه</h4>
                  <p className="text-gray-300 text-sm">{adr.summary}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-emerald-400 mb-1">تصمیم</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{adr.decision}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-amber-400 mb-2">پیامدها</h4>
                  <div className="flex flex-wrap gap-2">
                    {adr.consequences.map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-950 rounded text-xs text-gray-300 border border-gray-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
