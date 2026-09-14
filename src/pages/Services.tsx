import { Cloud, Server, HardDrive, Globe, Shield, Cpu } from 'lucide-react';
import { useSeo } from '../hooks';
import { SectionHeading, CtaBanner } from '../components/shared';

const serviceDetails = [
  {
    icon: <Cloud className="w-8 h-8 text-primary" />, title: 'سرور ابری', price: '۴۹۰٬۰۰۰',
    desc: 'زیرساخت ابری مقیاس‌پذیر با عملکرد بالا و پرداخت بر اساس مصرف',
    features: ['مقیاس‌پذیری آنی منابع', 'پنل مدیریت پیشرفته', 'پشتیبان‌گیری خودکار روزانه', 'مانیتورینگ لحظه‌ای', 'API کامل برای اتوماسیون', 'Snapshot و Clone'],
  },
  {
    icon: <Server className="w-8 h-8 text-success" />, title: 'سرور اختصاصی', price: '۲٬۹۰۰٬۰۰۰',
    desc: 'سرورهای فیزیکی با منابع کاملاً اختصاصی و قابل سفارشی‌سازی',
    features: ['پردازنده Intel Xeon / AMD EPYC', 'حافظه ECC تا ۵۱۲ گیگابایت', 'ذخیره‌سازی NVMe SSD', 'شبکه ۴۰ گیگابیت', 'IPMI دسترسی از راه دور', 'پیکربندی سفارشی'],
  },
  {
    icon: <HardDrive className="w-8 h-8 text-accent" />, title: 'کولوکیشن', price: '۱٬۵۰۰٬۰۰۰',
    desc: 'میزبانی سرورها و تجهیزات شما در دیتاسنتر حرفه‌ای ابران',
    features: ['رک ۴۲U استاندارد', 'برق ۱ تا ۴ کیلووات', 'پهنای باند اختصاصی', 'دسترسی ۲۴/۷', 'Remote Hands', 'مانیتورینگ محیطی'],
  },
  {
    icon: <Globe className="w-8 h-8 text-info" />, title: 'CDN و امنیت', price: '۲۹۰٬۰۰۰',
    desc: 'شبکه توزیع محتوا با محافظت پیشرفته در برابر حملات DDoS',
    features: ['۳۰+ نود در سراسر جهان', 'محافظت DDoS لایه ۳/۴/۷', 'گواهی SSL رایگان', 'Web Application Firewall', 'Caching هوشمند', 'Analytics ترافیک'],
  },
  {
    icon: <Cpu className="w-8 h-8 text-warn" />, title: 'ذخیره‌سازی شیء', price: '۹۰٬۰۰۰',
    desc: 'فضای ذخیره‌سازی شیء سازگار با S3 برای فایل‌ها و بکاپ‌ها',
    features: ['سازگار با Amazon S3', 'دسترسی از طریق API و SDK', 'CDN داخلی', 'نسخه‌بندی خودکار', 'Lifecycle Management', 'رمزنگاری سمت سرور'],
  },
  {
    icon: <Shield className="w-8 h-8 text-danger" />, title: 'پشتیبان‌گیری و DR', price: '۱۹۰٬۰۰۰',
    desc: 'بکاپ ابری و راه‌حل بازیابی فاجعه برای تداوم کسب‌وکار',
    features: ['بکاپ افزایشی روزانه', 'RPO کمتر از ۱ ساعت', 'RTO کمتر از ۴ ساعت', 'ذخیره ژئو رداندنت', 'تست بازیابی خودکار', 'گزارش‌دهی جامع'],
  },
];

export function Services() {
  useSeo('خدمات ابری — ابران سیستم', 'سرور ابری، سرور اختصاصی، کولوکیشن، CDN، ذخیره‌سازی شیء و پشتیبان‌گیری');

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16">
      <SectionHeading badge="خدمات ابری" title="خدمات زیرساختی ابران" subtitle="مجموعه کاملی از خدمات ابری و زیرساختی برای هر اندازه کسب‌وکار" center />

      <div className="space-y-8 mb-16">
        {serviceDetails.map((service, i) => (
          <div key={i} className="card p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center">
                  {service.icon}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-bold text-ink">{service.title}</h3>
                  <span className="text-primary font-bold">از {service.price} تومان/ماه</span>
                </div>
                <p className="text-body mb-4">{service.desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-body">
                      <span className="text-success">✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-ink mb-6 text-center">مقایسه سرویس‌ها</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 text-muted font-medium">ویژگی</th>
                <th className="text-center py-3 px-4 text-primary font-medium">سرور ابری</th>
                <th className="text-center py-3 px-4 text-success font-medium">سرور اختصاصی</th>
                <th className="text-center py-3 px-4 text-accent font-medium">کولوکیشن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ['SLA', '۹۹.۹۹٪', '۹۹.۹۵٪', '۹۹.۹٪'],
                ['مقیاس‌پذیری', 'آنی', 'محدود', 'ندارد'],
                ['مدیریت', 'کاملاً مدیریت‌شده', 'نیمه مدیریت‌شده', 'مشتری'],
                ['مناسب برای', 'استارتاپ‌ها و SME', 'کارهای سنگین', 'تجهیزات اختصاصی'],
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-3 px-4 text-body">{row[0]}</td>
                  <td className="py-3 px-4 text-center text-muted">{row[1]}</td>
                  <td className="py-3 px-4 text-center text-muted">{row[2]}</td>
                  <td className="py-3 px-4 text-center text-muted">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CtaBanner title="نیاز به مشاوره دارید؟" subtitle="تیم فنی ما آماده پاسخگویی به سوالات شما است" buttonText="تماس با ما" buttonLink="/contact" />
    </div>
  );
}
