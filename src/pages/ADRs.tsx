import { useState } from 'react';
import { BookOpen } from 'lucide-react';

const adrs = [
  { id: '0001', title: 'معماری Modular Monolith', titleEn: 'Modular Monolith', status: 'Accepted', summary: 'چرا Modular Monolith به جای Microservices برای MVP', decision: 'استفاده از Modular Monolith با Bounded Contexts سخت. هر ماژول اسکیما دیتابیس مستقل دارد و از طریق contracts ارتباط برقرار می‌کند.', consequences: ['✅ توسعه سریع‌تر', '✅ دیباگ ساده‌تر', '⚠️ نیاز به نظم در رعایت مرزها'] },
  { id: '0002', title: 'تعریف Bounded Contexts', titleEn: 'Bounded Contexts', status: 'Accepted', summary: 'تعریف ۹ محدوده مرزی و مرزهای سخت آن‌ها', decision: '۹ Bounded Context: Identity, Ordering, Provisioning, Lifecycle, Financial, Inventory, Config, Provider-Intelligence, Analytics.', consequences: ['✅ مالکیت واضح', '✅ تکامل مستقل', '⚠️ eventual consistency'] },
  { id: '0003', title: 'نسخه‌بندی Event Schema', titleEn: 'Event Schema Versioning', status: 'Accepted', summary: 'استراتژی نسخه‌بندی و سازگاری schema رویدادها', decision: 'JSON Schema با قوانین BACKWARD/FORWARD/FULL compatibility. Dual-Publish 90 روزه.', consequences: ['✅ تکامل امن', '✅ مسیر مهاجرت واضح', '⚠️ payload بزرگتر'] },
  { id: '0004', title: 'مدل‌های Consistency', titleEn: 'Consistency Models', status: 'Accepted', summary: 'Strong (Financial) در مقابل Eventually Consistent', decision: 'Financial با SERIALIZABLE isolation. بقیه contextها با eventual consistency و reconciliation loop.', consequences: ['✅ امنیت مالی', '✅ عملکرد بالا', '⚠️ پیچیدگی دو مدل'] },
  { id: '0005', title: 'RBAC سه‌سطحی Admin', titleEn: 'Admin RBAC 3-Level', status: 'Accepted', summary: 'ماتریس مجوزها برای Super Admin / Admin / Operator', decision: 'Super Admin: دسترسی کامل. Admin: عملیات روزانه. Operator: فقط خواندن و تیکت‌ها.', consequences: ['✅ جدایی وظایف', '✅ audit trail', '⚠️ پیچیدگی ماتریس'] },
  { id: '0006', title: 'Visibility Toggle', titleEn: 'Service Visibility', status: 'Accepted', summary: 'حالت‌های Public / Hidden / Deprecated / Invite-Only', decision: '۴ حالت visibility برای کنترل دسترسی به خدمات.', consequences: ['✅ انعطاف‌پذیری', '✅ کاتالوگ تمیز', '⚠️ race conditions'] },
  { id: '0007', title: 'Turborepo + pnpm', titleEn: 'Turborepo Monorepo', status: 'Accepted', summary: 'چرا Turborepo + pnpm', decision: 'Turborepo با caching خودکار و اجرای موازی. pnpm برای disk efficiency.', consequences: ['✅ build سریع', '✅ setup ساده', '⚠️ اکوسیستم کوچکتر'] },
  { id: '0008', title: 'تکنولوژی‌های Deferred', titleEn: 'Deferred Technologies', status: 'Accepted', summary: 'تعویق Temporal, Keycloak, NATS, Kubernetes', decision: 'MVP: PostgreSQL Outbox + BullMQ + Custom JWT. فازهای بعدی: Temporal, Keycloak, NATS, K8s.', consequences: ['✅ MVP سریع‌تر', '✅ پیچیدگی کمتر', '⚠️ بدهی فنی'] },
  { id: '0009', title: 'زیرساخت ترکیبی', titleEn: 'Hybrid Multi-Source', status: 'Accepted', summary: 'مدل سه‌لایه: Owned / Partner / European', decision: 'لایه ۱: مالکیتی (۱۰۰٪). لایه ۲: شرکای ایرانی (Revenue Share). لایه ۳: اروپایی (Fixed + Margin).', consequences: ['✅ بهینه‌سازی هزینه', '✅ بدون ریسک تحریم', '⚠️ پیچیدگی مدیریت'] },
  { id: '0010', title: 'مدل Revenue Sharing', titleEn: 'Revenue Sharing', status: 'Accepted', summary: 'تسهیم درآمد با Partner DCs', decision: 'محاسبه خودکار سهم ABRAN و شریک. تسویه ماهانه/هفتگی با dual approval.', consequences: ['✅ تسویه خودکار', '✅ شفافیت مالی', '⚠️ پیچیدگی حسابداری'] },
  { id: '0011', title: 'رویکرد Design System', titleEn: 'Design System', status: 'Accepted', summary: 'UX-First, RTL-First, Storybook, shadcn/ui', decision: 'shadcn/ui + Storybook + Vazirmatn + Tailwind. Dark/Light mode.', consequences: ['✅ UX حرفه‌ای', '✅ RTL کامل', '⚠️ نیاز به maintenance'] },
  { id: '0012', title: 'Performance Budget', titleEn: 'Performance Budget', status: 'Accepted', summary: 'LCP < 2.5s, FID < 100ms, CLS < 0.1', decision: 'Lighthouse CI + Web Vitals tracking + CDN + Image optimization.', consequences: ['✅ UX سریع', '✅ SEO بهتر', '⚠️ monitoring مداوم'] },
];

export function ADRs() {
  const [expandedADR, setExpandedADR] = useState<string | null>('0001');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <BookOpen className="w-10 h-10 text-blue-400" />
          تصمیمات معماری (ADRs)
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          ۱۲ سند تصمیم معماری که تمام انتخاب‌های مهم سیستم را مستند می‌کنند.
        </p>
      </div>

      <div className="space-y-3">
        {adrs.map((adr) => (
          <div key={adr.id} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setExpandedADR(expandedADR === adr.id ? null : adr.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors text-right"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-500 bg-black/30 px-2 py-1 rounded" dir="ltr">
                  ADR-{adr.id}
                </span>
                <div className="text-right">
                  <h3 className="text-white font-bold">{adr.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5 font-mono" dir="ltr">{adr.titleEn}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                  {adr.status}
                </span>
                <span className={`text-gray-400 text-xs transition-transform ${expandedADR === adr.id ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>

            {expandedADR === adr.id && (
              <div className="px-6 pb-6 space-y-4 border-t border-white/5 pt-4">
                <div>
                  <h4 className="text-xs font-bold text-blue-400 mb-1">خلاصه</h4>
                  <p className="text-gray-300 text-sm">{adr.summary}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 mb-1">تصمیم</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{adr.decision}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-400 mb-2">پیامدها</h4>
                  <div className="flex flex-wrap gap-2">
                    {adr.consequences.map((c, i) => (
                      <span key={i} className="px-2 py-1 bg-black/30 rounded text-xs text-gray-300 border border-white/10">
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
