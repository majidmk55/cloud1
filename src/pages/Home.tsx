import { motion } from 'framer-motion';
import { Cloud, Server, Shield, Cpu, Globe, HardDrive } from 'lucide-react';
import { useSeo } from '../hooks';
import { SectionHeading, StatCounter, ServiceCard, PricingCard, TestimonialCard, FaqAccordion, CtaBanner, CodeBlock, fadeUp, staggerContainer } from '../components/shared';

const services = [
  { icon: <Cloud className="w-6 h-6 text-primary" />, title: 'سرور ابری', description: 'زیرساخت ابری مقیاس‌پذیر با عملکرد بالا', features: ['مقیاس‌پذیری آنی', 'پرداخت بر اساس مصرف', 'پشتیبان‌گیری خودکار', 'SLA ۹۹.۹۹٪'] },
  { icon: <Server className="w-6 h-6 text-success" />, title: 'سرور اختصاصی', description: 'سرورهای فیزیکی با منابع اختصاصی', features: ['منابع کاملاً اختصاصی', 'سخت‌افزار سفارشی', 'دسترسی Root کامل', 'شبکه ۴۰ گیگابیت'] },
  { icon: <HardDrive className="w-6 h-6 text-accent" />, title: 'کولوکیشن', description: 'میزبانی تجهیزات شما در دیتاسنتر ما', features: ['رک اختصاصی', 'برق N+1', 'سرمایش دقیق', 'امنیت فیزیکی ۲۴/۷'] },
  { icon: <Globe className="w-6 h-6 text-info" />, title: 'CDN و امنیت', description: 'شبکه توزیع محتوا و محافظت DDoS', features: ['۳۰+ نود جهانی', 'محافظت DDoS لایه ۷', 'گواهی SSL رایگان', 'WAF پیشرفته'] },
  { icon: <Cpu className="w-6 h-6 text-warn" />, title: 'هوش مصنوعی', description: 'API‌های هوش مصنوعی آنلاین', features: ['مدل‌های زبانی بزرگ', 'بینایی ماشین', 'تبدیل گفتار به متن', 'GPU ابری'] },
  { icon: <Shield className="w-6 h-6 text-danger" />, title: 'پشتیبان‌گیری', description: 'بکاپ ابری و بازیابی فاجعه', features: ['پشتیبان‌گیری روزانه', 'RPO کمتر از ۱ ساعت', 'ذخیره‌سازی ژئو رداندنت', 'بازیازی آنی'] },
];

const testimonials = [
  { name: 'علی محمدی', role: 'مدیر فنی، شرکت دیجی‌کالا', text: 'خدمات ابری ابران سیستم پایداری فوق‌العاده‌ای دارد. از وقتی مهاجرت کردیم، هیچ قطعی نداشتیم.' },
  { name: 'سارا احمدی', role: 'بنیان‌گذار، استارتاپ هوشمند', text: 'API هوش مصنوعی ابران بهترین گزینه برای بازار ایران است. سرعت پاسخ‌دهی عالی و قیمت مناسب.' },
  { name: 'رضا کریمی', role: 'CTO، فین‌تک پرداخت', text: 'پشتیبانی ۲۴/۷ ابران واقعاً فرق دارد. هر مشکلی داشتیم، در کمتر از ۱۵ دقیقه حل شد.' },
];

const faqItems = [
  { q: 'آیا امکان تست رایگان وجود دارد؟', a: 'بله، تمامی سرویس‌های ابری با ۷ روز تست رایگان ارائه می‌شوند. کافی است ثبت‌نام کنید و بدون نیاز به کارت اعتباری، سرویس مورد نظر را تست کنید.' },
  { q: 'دیتاسنتر شما چه گواهینامه‌هایی دارد؟', a: 'دیتاسنتر ابران دارای گواهینامه‌های Tier III، ISO 27001 و SOC 2 Type II است. همچنین مطابق با استانداردهای افتا طراحی شده است.' },
  { q: 'آیا مهاجرت از سرویس‌دهنده قبلی رایگان است؟', a: 'بله، تیم فنی ما مهاجرت رایگان از هر سرویس‌دهنده‌ای را انجام می‌دهد. فرآیند مهاجرت بدون وقفه و با حداقل downtime انجام می‌شود.' },
  { q: 'روش‌های پرداخت چیست؟', a: 'پرداخت از طریق کارت بانکی، انتقال بانکی، و کیف پول داخلی امکان‌پذیر است. برای سازمان‌ها، فاکتور رسمی و پرداخت اعتباری نیز ارائه می‌شود.' },
  { q: 'آیا SLA ارائه می‌دهید؟', a: 'بله، SLA ما ۹۹.۹۹٪ آپتایم است. در صورت عدم رعایت SLA، اعتبار حساب شما به صورت خودکار شارژ می‌شود.' },
];

export function Home() {
  useSeo('ابران سیستم — خدمات ابری، دیتاسنتر و هوش مصنوعی', 'ابران سیستم ارائه‌دهنده خدمات ابری، سرور اختصاصی، کولوکیشن، CDN و API‌های هوش مصنوعی برای کسب‌وکارهای ایرانی');

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-soft via-bg to-accent-soft">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative max-w-[1200px] mx-auto px-4 md:px-8 py-20 md:py-32">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
            <motion.div variants={fadeUp} className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium mb-6">
              🚀 نسل جدید زیرساخت ابری ایران
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black text-ink mb-6 leading-tight">
              زیرساخت ابری <span className="gradient-text">نسل آینده</span>
              <br />برای کسب‌وکار شما
            </motion.h1>
            <motion.p variants={fadeUp} className="text-body text-lg md:text-xl max-w-2xl mx-auto mb-8">
              ابران سیستم، ارائه‌دهنده خدمات ابری، دیتاسنتر و هوش مصنوعی با بالاترین سطح پایداری و امنیت
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mb-16">
              <a href="/services" className="btn-primary">
                مشاهده خدمات
              </a>
              <a href="/contact" className="btn-outline">
                درخواست دمو
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <StatCounter value={99.99} label="آپتایم (٪)" suffix="٪" />
              <StatCounter value={1200} label="سازمان مشتری" suffix="+" />
              <StatCounter value={2} label="دیتاسنتر فعال" />
              <StatCounter value={24} label="پشتیبانی (ساعت)" suffix="/۷" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border py-8 bg-surface">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <p className="text-center text-muted text-sm mb-6">مورد اعتماد سازمان‌های پیشرو</p>
          <div className="flex flex-wrap justify-center gap-6">
            {['دیجی‌کالا', 'اسنپ', 'تپسی', 'کافه‌بازار', 'دیوار', 'فیلیمو'].map((name) => (
              <span key={name} className="px-4 py-2 rounded-lg bg-bg text-body text-sm border border-border">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <SectionHeading badge="خدمات ما" title="خدمات ابری و زیرساخت" subtitle="مجموعه کاملی از خدمات زیرساختی برای هر نوع کسب‌وکار" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={i} {...service} />
          ))}
        </motion.div>
      </section>

      {/* AI Spotlight */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-soft text-accent text-sm font-medium mb-4">
              🤖 هوش مصنوعی
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink mb-4">API‌های هوش مصنوعی آنلاین</h2>
            <p className="text-body text-lg mb-6 leading-relaxed">
              دسترسی آسان به مدل‌های زبانی بزرگ، بینایی ماشین، تبدیل گفتار و سایر قابلیت‌های هوش مصنوعی از طریق API‌های ساده و مستند.
            </p>
            <ul className="space-y-3 mb-6">
              {['گفتگوی هوشمند با مدل‌های فارسی', 'بینایی ماشین و OCR', 'تبدیل گفتار به متن فارسی', 'تولید Embedding برای RAG'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-body">
                  <span className="text-success">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="/ai" className="inline-block px-6 py-3 rounded-xl bg-accent-soft text-accent border border-accent/20 font-bold hover:bg-accent-soft/80 transition-all">
              مشاهده خدمات AI ←
            </a>
          </div>
          <div>
            <CodeBlock language="bash" code={`curl -X POST https://api.abran.system/v1/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "abran-llm-fa",
    "messages": [
      {"role": "user", "content": "سلام، حالت چطوره؟"}
    ]
  }'`} />
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <SectionHeading badge="زیرساخت" title="دیتاسنتر Tier III" subtitle="زیرساخت فیزیکی با بالاترین استانداردهای جهانی" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '⚡', title: 'برق اضطراری N+1', desc: 'سیستم UPS و دیزل ژنراتور با ظرفیت اضافی برای تضمین پایداری برق' },
            { icon: '❄️', title: 'سرمایش دقیق', desc: 'سیستم سرمایش precision cooling با کنترل دما و رطوبت' },
            { icon: '🌐', title: 'شبکه ۴۰Gbps', desc: 'اتصال به اینترنت بین‌الملل با پهنای باند ۴۰ گیگابیت بر ثانیه' },
          ].map((item) => (
            <div key={item.title} className="card p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-ink font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-body text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <SectionHeading badge="تعرفه‌ها" title="پلن‌های ابری" subtitle="پلن مناسب خود را انتخاب کنید" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <PricingCard name="پایه" price={490000} period="ماه" features={['۲ هسته CPU', '۴ گیگ RAM', '۸۰ گیگ SSD', '۲ ترافیک TB', 'پشتیبانی ایمیل']} />
          <PricingCard name="حرفه‌ای" price={1490000} period="ماه" highlighted features={['۴ هسته CPU', '۸ گیگ RAM', '۱۶۰ گیگ SSD', '۵ ترافیک TB', 'پشتیبانی ۲۴/۷', 'IP اختصاصی']} />
          <PricingCard name="سازمانی" price={3990000} period="ماه" features={['۸ هسته CPU', '۱۶ گیگ RAM', '۳۲۰ گیگ SSD', 'ترافیک نامحدود', 'پشتیبانی اختصاصی', 'SLA اختصاصی']} />
        </div>
        <div className="text-center mt-8">
          <a href="/pricing" className="text-primary hover:text-primary-hover transition-colors">مشاهده تمام پلن‌ها ←</a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <SectionHeading badge="نظرات مشتریان" title="مشتریان ما چه می‌گویند" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-20">
        <SectionHeading badge="سوالات متداول" title="پاسخ به سوالات شما" />
        <FaqAccordion items={faqItems} />
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <CtaBanner
          title="آماده شروع هستید؟"
          subtitle="همین حالا ثبت‌نام کنید و ۷ روز رایگان از خدمات ابری ابران استفاده کنید."
          buttonText="شروع رایگان"
          buttonLink="/contact"
        />
      </section>
    </div>
  );
}
