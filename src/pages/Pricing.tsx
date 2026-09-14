import { useState } from 'react';
import { useSeo } from '../hooks';
import { SectionHeading, PricingCard, FaqAccordion } from '../components/shared';
import { toFaDigits } from '../lib/utils';

const cloudPlans = [
  { name: 'پایه', price: 490000, period: 'ماه', features: ['۲ هسته CPU', '۴ گیگ RAM', '۸۰ گیگ SSD', '۲ ترافیک TB', 'پشتیبانی ایمیل'] },
  { name: 'حرفه‌ای', price: 1490000, period: 'ماه', features: ['۴ هسته CPU', '۸ گیگ RAM', '۱۶۰ گیگ SSD', '۵ ترافیک TB', 'پشتیبانی ۲۴/۷', 'IP اختصاصی'], highlighted: true },
  { name: 'سازمانی', price: 3990000, period: 'ماه', features: ['۸ هسته CPU', '۱۶ گیگ RAM', '۳۲۰ گیگ SSD', 'ترافیک نامحدود', 'پشتیبانی اختصاصی', 'SLA اختصاصی', 'مدیر حساب'] },
];

const aiPlans = [
  { name: 'شروع', price: 190000, period: 'ماه', features: ['۱ میلیون توکن LLM', '۱۰۰۰ درخواست OCR', '۱۰ ساعت گفتار', 'پشتیبانی ایمیل'] },
  { name: 'توسعه‌دهنده', price: 690000, period: 'ماه', features: ['۱۰ میلیون توکن LLM', '۱۰٬۰۰۰ درخواست OCR', '۱۰۰ ساعت گفتار', 'پشتیبانی ۲۴/۷', 'GPU اشتراکی'], highlighted: true },
  { name: 'سازمانی', price: 2490000, period: 'ماه', features: ['۱۰۰ میلیون توکن LLM', 'نامحدود OCR', 'نامحدود گفتار', 'GPU اختصاصی', 'مدیر حساب', 'SLA اختصاصی'] },
];

const pricingFaq = [
  { q: 'آیا امکان پرداخت سالانه وجود دارد؟', a: 'بله، با پرداخت سالانه ۲ ماه رایگان دریافت می‌کنید. یعنی ۱۷٪ تخفیف.' },
  { q: 'آیا امکان ارتقای پلن وجود دارد؟', a: 'بله، هر زمان می‌توانید پلن خود را ارتقا دهید. مابه‌التفاوت به صورت روزانه محاسبه می‌شود.' },
  { q: 'آیا گارانتی بازگشت وجه دارید؟', a: 'بله، تا ۷ روز پس از خرید، امکان بازگشت کامل وجه وجود دارد.' },
];

export function Pricing() {
  useSeo('تعرفه‌ها — ابران سیستم', 'پلن‌های ابری و هوش مصنوعی با قیمت مناسب');
  const [isYearly, setIsYearly] = useState(false);
  const [vcpu, setVcpu] = useState(4);
  const [ram, setRam] = useState(8);
  const [storage, setStorage] = useState(160);

  const estimatedPrice = (vcpu * 200000) + (ram * 50000) + (storage * 1000);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <SectionHeading badge="💰 تعرفه‌ها" title="پلن‌های قیمت‌گذاری" subtitle="پلن مناسب خود را انتخاب کنید" center />

      {/* Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-500'}`}>ماهانه</span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`w-14 h-7 rounded-full transition-all ${isYearly ? 'bg-blue-600' : 'bg-white/10'} relative`}
          aria-label="تغییر بین ماهانه و سالانه"
        >
          <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${isYearly ? 'left-1' : 'left-8'}`} />
        </button>
        <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-500'}`}>سالانه</span>
        {isYearly && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">۲ ماه رایگان</span>}
      </div>

      {/* Cloud Plans */}
      <h2 className="text-xl font-bold text-white mb-6 text-center">سرویس‌های ابری</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
        {cloudPlans.map((plan) => (
          <PricingCard key={plan.name} {...plan} isYearly={isYearly} price={isYearly ? Math.round(plan.price * 10) : plan.price} period={isYearly ? 'سال' : 'ماه'} />
        ))}
      </div>

      {/* AI Plans */}
      <h2 className="text-xl font-bold text-white mb-6 text-center">سرویس‌های هوش مصنوعی</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
        {aiPlans.map((plan) => (
          <PricingCard key={plan.name} {...plan} isYearly={isYearly} price={isYearly ? Math.round(plan.price * 10) : plan.price} period={isYearly ? 'سال' : 'ماه'} />
        ))}
      </div>

      {/* Calculator */}
      <div className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-8 max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-bold text-white mb-6 text-center">محاسبه‌گر قیمت</h2>
        <div className="space-y-6">
          <div>
            <label className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">تعداد هسته CPU</span>
              <span className="text-white font-bold">{toFaDigits(vcpu)}</span>
            </label>
            <input type="range" min="1" max="32" value={vcpu} onChange={(e) => setVcpu(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">حافظه RAM (گیگابایت)</span>
              <span className="text-white font-bold">{toFaDigits(ram)}</span>
            </label>
            <input type="range" min="2" max="128" step="2" value={ram} onChange={(e) => setRam(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div>
            <label className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">فضای ذخیره‌سازی (گیگابایت)</span>
              <span className="text-white font-bold">{toFaDigits(storage)}</span>
            </label>
            <input type="range" min="40" max="1000" step="10" value={storage} onChange={(e) => setStorage(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm mb-2">قیمت تخمینی ماهانه</p>
            <p className="text-4xl font-black text-white">{toFaDigits(estimatedPrice.toLocaleString('en-US').replace(/,/g, '٬'))} <span className="text-lg text-gray-400">تومان</span></p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mb-16">
        <h2 className="text-xl font-bold text-white mb-6 text-center">سوالات متداول تعرفه‌ها</h2>
        <FaqAccordion items={pricingFaq} />
      </div>
    </div>
  );
}
