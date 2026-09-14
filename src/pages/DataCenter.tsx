import { useSeo } from '../hooks';
import { SectionHeading, CtaBanner } from '../components/shared';

export function DataCenter() {
  useSeo('دیتاسنتر — ابران سیستم', 'دیتاسنتر Tier III ابران با بالاترین استانداردهای پایداری و امنیت');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <SectionHeading badge="🏢 دیتاسنتر" title="دیتاسنتر حرفه‌ای ابران" subtitle="زیرساخت فیزیکی با استانداردهای جهانی Tier III" center />

      {/* Facility Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="card p-8">
          <h3 className="text-xl font-bold text-ink mb-4">مشخصات دیتاسنتر</h3>
          <div className="space-y-3">
            {[
              ['رتبه‌بندی', 'Tier III'],
              ['مساحت', '۵٬۰۰۰ متر مربع'],
              ['تعداد رک', '۲۰۰+ رک'],
              ['ظرفیت برق', '۲ مگاوات'],
              ['اتصال شبکه', '۴۰ گیگابیت'],
              ['موقعیت', 'تهران، ایران'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-border">
                <span className="text-muted">{k}</span>
                <span className="text-ink font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-8">
          <h3 className="text-xl font-bold text-ink mb-4">گواهینامه‌ها</h3>
          <div className="space-y-4">
            {[
              { name: 'Tier III Certified', desc: 'طراحی و عملیات مطابق استاندارد Uptime Institute' },
              { name: 'ISO 27001', desc: 'مدیریت امنیت اطلاعات' },
              { name: 'SOC 2 Type II', desc: 'کنترل‌های امنیتی و عملیاتی' },
              { name: 'افتا', desc: 'مطابق الزامات مرکز افتای جمهوری اسلامی ایران' },
            ].map((cert) => (
              <div key={cert.name} className="flex items-start gap-3">
                <span className="text-success mt-1">✓</span>
                <div>
                  <div className="text-ink font-medium text-sm">{cert.name}</div>
                  <div className="text-muted text-xs">{cert.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Power & Cooling */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">برق و سرمایش</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'UPS N+1', desc: 'سیستم UPS آنلاین دوبل با ظرفیت اضافی برای تضمین برق بدون وقفه' },
            { icon: '🔋', title: 'دیزل ژنراتور', desc: 'ژنراتورهای دیزلی با سوخت ۷۲ ساعته برای شرایط بحرانی' },
            { icon: '❄️', title: 'سرمایش دقیق', desc: 'سیستم Precision Cooling با کنترل دمای ±۰.۵ درجه و رطوبت ۴۵-۵۵٪' },
          ].map((item) => (
            <div key={item.title} className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Network */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">شبکه و اتصال</h2>
        <div className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">آمار شبکه</h3>
              <div className="space-y-3">
                {[['پهنای باند بین‌الملل', '۴۰ Gbps'], ['پهنای باند داخلی', '۱۰۰ Gbps'], ['تعداد ISP', '۵ اپراتور'], ['Peering', 'IX تهران']].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-4">شرکای شبکه</h3>
              <div className="flex flex-wrap gap-2">
                {['MCI', 'Irancell', 'AsiaTech', 'Pars Online', 'Respina', 'Fanap', 'Afranet'].map((p) => (
                  <span key={p} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-xs border border-white/10">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">امنیت فیزیکی</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: '🔒', title: 'کنترل دسترسی', desc: 'احراز هویت چند مرحله‌ای' },
            { icon: '📹', title: 'CCTV 24/7', desc: 'دوربین‌های پوششی کامل' },
            { icon: '🔥', title: 'اطفاء حریق', desc: 'سیستم گازی FM200' },
            { icon: '👮', title: 'نگهبانی', desc: 'تیم امنیتی ۲۴ ساعته' },
          ].map((item) => (
            <div key={item.title} className="bg-[#0a0f1f] rounded-xl border border-white/10 p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
              <p className="text-gray-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <CtaBanner title="بازدید از دیتاسنتر" subtitle="برای هماهنگی بازدید حضوری از دیتاسنتر با ما تماس بگیرید" buttonText="درخواست بازدید" buttonLink="/contact" />
    </div>
  );
}
