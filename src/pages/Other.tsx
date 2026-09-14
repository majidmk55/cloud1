import { useState } from 'react';
import { useSeo } from '../hooks';
import { SectionHeading } from '../components/shared';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export function About() {
  useSeo('درباره ما — ابران سیستم', 'داستان ابران سیستم، مأموریت و ارزش‌های ما');

  const timeline = [
    { year: '۱۳۹۸', title: 'تأسیس', desc: 'شروع فعالیت با تیم ۵ نفره' },
    { year: '۱۳۹۹', title: 'اولین دیتاسنتر', desc: 'راه‌اندازی دیتاسنتر تهران' },
    { year: '۱۴۰۰', title: 'خدمات ابری', desc: 'ارائه سرویس‌های ابری عمومی' },
    { year: '۱۴۰۱', title: 'توسعه شبکه', desc: 'ارتباط با ۵ ISP و پینگ بین‌الملل' },
    { year: '۱۴۰۲', title: 'هوش مصنوعی', desc: 'راه‌اندازی API‌های هوش مصنوعی' },
    { year: '۱۴۰۳', title: 'دومین دیتاسنتر', desc: 'افتتاح دیتاسنتر دوم با ظرفیت ۲ مگاوات' },
  ];

  const values = [
    { icon: '🎯', title: 'نوآوری', desc: 'همیشه در خط مقدم فناوری' },
    { icon: '🤝', title: 'اعتماد', desc: 'شفافیت و صداقت در همه تعاملات' },
    { icon: '⚡', title: 'عملکرد', desc: 'تعهد به بالاترین سطح SLA' },
    { icon: '🛡️', title: 'امنیت', desc: 'اولویت اول ما امنیت داده‌های شماست' },
  ];

  const team = [
    { name: 'مجید خوش‌بخت', role: 'بنیان‌گذار و CEO', initial: 'م' },
    { name: 'سارا رضایی', role: 'مدیر فنی (CTO)', initial: 'س' },
    { name: 'علی احمدی', role: 'مدیر زیرساخت', initial: 'ع' },
    { name: 'مریم کریمی', role: 'مدیر محصول', initial: 'م' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <SectionHeading badge="🏢 درباره ما" title="داستان ابران سیستم" subtitle="از یک ایده تا بزرگ‌ترین ارائه‌دهنده خدمات ابری ایران" center />

      {/* Story */}
      <div className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-8 mb-16 max-w-3xl mx-auto">
        <p className="text-gray-300 leading-relaxed mb-4">
          ابران سیستم در سال ۱۳۹۸ با هدف ارائه زیرساخت ابری بومی و باکیفیت تأسیس شد. ما معتقدیم کسب‌وکارهای ایرانی شایسته بهترین زیرساخت فناوری هستند.
        </p>
        <p className="text-gray-300 leading-relaxed">
          امروز با بیش از ۱۲۰۰ مشتری سازمانی، ۲ دیتاسنتر فعال و تیمی متشکل از ۵۰ متخصص، به یکی از پیشروترین ارائه‌دهندگان خدمات ابری و هوش مصنوعی در ایران تبدیل شده‌ایم.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-3">🎯 مأموریت</h3>
          <p className="text-gray-400">ارائه زیرساخت ابری قابل اعتماد، مقرون‌به‌صرفه و امن برای تمام کسب‌وکارهای ایرانی.</p>
        </div>
        <div className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-3">🔭 چشم‌انداز</h3>
          <p className="text-gray-400">تبدیل شدن به مرجع اصلی خدمات ابری و هوش مصنوعی در خاورمیانه تا سال ۱۴۰۵.</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">مسیر رشد ما</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                  {item.year}
                </div>
                {i < timeline.length - 1 && <div className="w-0.5 h-8 bg-blue-500/20 mt-1" />}
              </div>
              <div className="pt-2">
                <h4 className="text-white font-bold">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">ارزش‌های ما</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {values.map((v) => (
            <div key={v.title} className="bg-[#0a0f1f] rounded-xl border border-white/10 p-4 text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <h4 className="text-white font-bold text-sm mb-1">{v.title}</h4>
              <p className="text-gray-500 text-xs">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">تیم مدیریت</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                {member.initial}
              </div>
              <h4 className="text-white font-bold text-sm">{member.name}</h4>
              <p className="text-gray-500 text-xs">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Contact() {
  useSeo('تماس با ما — ابران سیستم', 'با ابران سیستم تماس بگیرید');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'نام الزامی است';
    if (!form.email.trim()) errs.email = 'ایمیل الزامی است';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'ایمیل نامعتبر است';
    if (!form.message.trim()) errs.message = 'پیام الزامی است';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('contact_requests').insert({ id: uuidv4(), ...form, created_at: new Date().toISOString() });
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-2xl font-bold text-white mb-4">پیام شما ارسال شد!</h2>
        <p className="text-gray-400">کارشناسان ما طی یک روز کاری با شما تماس خواهند گرفت.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <SectionHeading badge="📞 تماس" title="تماس با ما" subtitle="سوالی دارید؟ با ما در میان بگذارید" center />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6 space-y-4">
          {[
            { key: 'name', label: 'نام و نام خانوادگی', type: 'text' },
            { key: 'email', label: 'ایمیل', type: 'email' },
            { key: 'phone', label: 'تلفن', type: 'tel' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm text-gray-400 mb-1">{label}</label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={`w-full bg-[#050816] border ${errors[key] ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500`}
              />
              {errors[key] && <p className="text-red-400 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}
          <div>
            <label className="block text-sm text-gray-400 mb-1">موضوع</label>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-[#050816] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
              <option value="">انتخاب کنید</option>
              <option value="sales">فروش و مشاوره</option>
              <option value="support">پشتیبانی فنی</option>
              <option value="billing">مالی و factur</option>
              <option value="other">سایر</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">پیام</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className={`w-full bg-[#050816] border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-2 text-white resize-none focus:outline-none focus:border-blue-500`}
            />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-l from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
            ارسال پیام
          </button>
          {!isSupabaseConfigured && (
            <p className="text-amber-400 text-xs text-center">حالت نمایشی — Supabase تنظیم نشده است</p>
          )}
        </form>

        {/* Info */}
        <div className="space-y-4">
          {[
            { icon: '📍', title: 'آدرس', value: 'تهران، خیابان ولیعصر، برج ابران، طبقه ۱۲' },
            { icon: '📞', title: 'تلفن', value: '۰۲۱-۱۲۳۴-۵۶۷۸' },
            { icon: '📧', title: 'ایمیل', value: 'info@abran.system' },
            { icon: '🕐', title: 'ساعات پشتیبانی', value: '۲۴ ساعته، ۷ روز هفته' },
          ].map((item) => (
            <div key={item.title} className="bg-[#0a0f1f] rounded-xl border border-white/10 p-4 flex items-center gap-4">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <div className="text-white font-bold text-sm">{item.title}</div>
                <div className="text-gray-400 text-sm">{item.value}</div>
              </div>
            </div>
          ))}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
            <p className="text-emerald-400 text-sm font-bold">⏱️ پاسخ طی یک روز کاری</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Status() {
  useSeo('وضعیت سرویس‌ها — ابران سیستم', 'وضعیت لحظه‌ای سرویس‌های ابری ابران');

  const services = [
    { name: 'وب‌سایت', status: 'operational' },
    { name: 'API ابری', status: 'operational' },
    { name: 'API هوش مصنوعی', status: 'operational' },
    { name: 'ذخیره‌سازی شیء', status: 'operational' },
    { name: 'CDN', status: 'degraded' },
    { name: 'پنل مدیریت', status: 'operational' },
  ];

  const incidents = [
    { date: '۱۴۰۳/۰۶/۱۵', title: 'کندی موقت CDN', desc: 'بروزرسانی شبکه باعث کندی ۱۵ دقیقه‌ای شد', resolved: true },
    { date: '۱۴۰۳/۰۵/۲۸', title: 'تعمیرات برنامه‌ریزی‌شده', desc: 'تعمیرات سرورهای ذخیره‌سازی', resolved: true },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
      <SectionHeading badge="📊 وضعیت" title="وضعیت سرویس‌ها" subtitle="وضعیت لحظه‌ای سرویس‌های ابری ابران" center />

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center mb-8">
        <p className="text-emerald-400 font-bold">✅ تمام سیستم‌ها عملیاتی هستند</p>
        <p className="text-gray-400 text-sm mt-1">آخرین بروزرسانی: همین الان</p>
      </div>

      <div className="space-y-3 mb-12">
        {services.map((s) => (
          <div key={s.name} className="bg-[#0a0f1f] rounded-xl border border-white/10 p-4 flex items-center justify-between">
            <span className="text-white">{s.name}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              s.status === 'operational' ? 'bg-emerald-500/20 text-emerald-400' :
              s.status === 'degraded' ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {s.status === 'operational' ? 'عملیاتی' : s.status === 'degraded' ? 'کندی' : 'قطعی'}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-4">سابقه حوادث</h2>
      <div className="space-y-3">
        {incidents.map((inc, i) => (
          <div key={i} className="bg-[#0a0f1f] rounded-xl border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm">{inc.title}</span>
              <span className="text-gray-500 text-xs">{inc.date}</span>
            </div>
            <p className="text-gray-400 text-sm">{inc.desc}</p>
            {inc.resolved && <span className="text-emerald-400 text-xs mt-2">✓ رفع شده</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotFound() {
  useSeo('۴۰۴ — صفحه یافت نشد', '');
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl font-black text-white/10 mb-4">۴۰۴</div>
        <h1 className="text-2xl font-bold text-white mb-4">صفحه مورد نظر یافت نشد</h1>
        <p className="text-gray-400 mb-8">متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد.</p>
        <div className="flex gap-4 justify-center">
          <a href="/" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">بازگشت به خانه</a>
          <a href="/services" className="px-6 py-3 rounded-xl bg-white/5 text-white border border-white/10 font-bold hover:bg-white/10 transition-colors">مشاهده خدمات</a>
        </div>
      </div>
    </div>
  );
}
