import type { LucideIcon } from 'lucide-react';
import { Cloud, HardDrive, Database, Globe, ShieldCheck, Network, Server, Cpu, Building2, Wifi, MessageSquare, Eye, Mic, Volume2, Link2, Play, Wrench, ShieldAlert, Gauge, Truck } from 'lucide-react';

export type Category = 'cloud' | 'servers' | 'ai' | 'datacenter';
export type PricingModel = 'hourly' | 'monthly' | 'per-gb' | 'per-token' | 'per-minute' | 'per-char' | 'rack' | 'ticket' | 'project';

export interface Service {
  slug: string;
  category: Category;
  titleFa: string;
  taglineFa: string;
  icon: LucideIcon;
  featuresFa: string[];
  specs: { label: string; value: string }[];
  pricingModel: PricingModel;
  priceFromToman: number;
  popular?: boolean;
}

export const categories: { id: Category; label: string; icon: LucideIcon }[] = [
  { id: 'cloud', label: 'خدمات ابری', icon: Cloud },
  { id: 'servers', label: 'سرورها', icon: Server },
  { id: 'ai', label: 'هوش مصنوعی', icon: Cpu },
  { id: 'datacenter', label: 'دیتاسنتر', icon: Building2 },
];

export const services: Service[] = [
  // CLOUD
  {
    slug: 'cloud-vm', category: 'cloud', titleFa: 'سرور ابری',
    taglineFa: 'زیرساخت مجازی مقیاس‌پذیر با عملکرد بالا',
    icon: Cloud,
    featuresFa: ['مقیاس‌پذیری آنی منابع', 'پنل مدیریت پیشرفته', 'پشتیبان‌گیری خودکار', 'مانیتورینگ لحظه‌ای', 'API کامل اتوماسیون'],
    specs: [{ label: 'SLA', value: '۹۹.۹۹٪' }, { label: 'CPU', value: 'Intel Xeon / AMD EPYC' }, { label: 'Storage', value: 'NVMe SSD' }, { label: 'Network', value: '۱۰ Gbps' }],
    pricingModel: 'hourly', priceFromToman: 490000, popular: true,
  },
  {
    slug: 'object-storage', category: 'cloud', titleFa: 'ذخیره‌سازی شیء',
    taglineFa: 'فضای ذخیره‌سازی سازگار با S3',
    icon: HardDrive,
    featuresFa: ['سازگار با Amazon S3', 'CDN داخلی', 'نسخه‌بندی خودکار', 'رمزنگاری سمت سرور'],
    specs: [{ label: 'دوام', value: '۱۱×9' }, { label: 'دسترسی', value: '۹۹.۹٪' }, { label: 'حداکثر شیء', value: '۵ ترابایت' }],
    pricingModel: 'per-gb', priceFromToman: 90000,
  },
  {
    slug: 'managed-db', category: 'cloud', titleFa: 'دیتابیس مدیریت‌شده',
    taglineFa: 'PostgreSQL، MySQL و Redis مدیریت‌شده',
    icon: Database,
    featuresFa: ['پشتیبان‌گیری خودکار', 'Replication خودکار', 'مانیتورینگ عملکرد', 'ارتقاء نسخه بدون وقفه'],
    specs: [{ label: 'انجین‌ها', value: 'PostgreSQL, MySQL, Redis' }, { label: 'Backup', value: 'روزانه + PITR' }, { label: 'HA', value: 'فعال' }],
    pricingModel: 'monthly', priceFromToman: 690000,
  },
  {
    slug: 'cdn', category: 'cloud', titleFa: 'شبکه توزیع محتوا',
    taglineFa: 'تحویل سریع محتوا با ۳۰+ نود جهانی',
    icon: Globe,
    featuresFa: ['۳۰+ نود جهانی', 'گواهی SSL رایگان', 'WAF پیشرفته', 'Analytics ترافیک'],
    specs: [{ label: 'نودها', value: '۳۰+' }, { label: 'کش', value: 'SSD' }, { label: 'HTTPS', value: '۱۰۰٪' }],
    pricingModel: 'per-gb', priceFromToman: 290000,
  },
  {
    slug: 'backup', category: 'cloud', titleFa: 'پشتیبان‌گیری و DR',
    taglineFa: 'بکاپ ابری و بازیابی فاجعه',
    icon: ShieldCheck,
    featuresFa: ['بکاپ افزایشی', 'RPO کمتر از ۱ ساعت', 'RTO کمتر از ۴ ساعت', 'ذخیره ژئو رداندنت'],
    specs: [{ label: 'RPO', value: '< ۱ ساعت' }, { label: 'RTO', value: '< ۴ ساعت' }, { label: 'Retention', value: 'تا ۳۶۵ روز' }],
    pricingModel: 'per-gb', priceFromToman: 190000,
  },
  {
    slug: 'lb-vpc', category: 'cloud', titleFa: 'بالانسر بار و VPC',
    taglineFa: 'شبکه خصوصی مجازی و توزیع بار',
    icon: Network,
    featuresFa: ['Load Balancer لایه ۷', 'شبکه خصوصی', 'Security Groups', 'Subnet سفارشی'],
    specs: [{ label: 'نوع LB', value: 'L7 Application' }, { label: 'VPC', value: 'نامحدود' }, { label: 'Subnets', value: 'سفارشی' }],
    pricingModel: 'monthly', priceFromToman: 390000,
  },

  // SERVERS
  {
    slug: 'dedicated', category: 'servers', titleFa: 'سرور اختصاصی',
    taglineFa: 'سرور فیزیکی با منابع کاملاً اختصاصی',
    icon: Server,
    featuresFa: ['پردازنده Intel/AMD', 'حافظه ECC تا ۵۱۲GB', 'ذخیره NVMe', 'IPMI دسترسی', 'پیکربندی سفارشی'],
    specs: [{ label: 'CPU', value: 'Xeon / EPYC' }, { label: 'RAM', value: 'تا ۵۱۲GB ECC' }, { label: 'Network', value: '۴۰ Gbps' }],
    pricingModel: 'monthly', priceFromToman: 2900000, popular: true,
  },
  {
    slug: 'gpu-server', category: 'servers', titleFa: 'سرور GPU',
    taglineFa: 'GPU‌های NVIDIA برای AI و HPC',
    icon: Cpu,
    featuresFa: ['NVIDIA A100/H100', 'CUDA کامل', 'RDMA شبکه', 'مناسب آموزش مدل'],
    specs: [{ label: 'GPU', value: 'A100 80GB / H100' }, { label: 'VRAM', value: '۸۰GB' }, { label: 'Interconnect', value: 'NVLink' }],
    pricingModel: 'hourly', priceFromToman: 5000000,
  },
  {
    slug: 'colocation', category: 'servers', titleFa: 'کولوکیشن',
    taglineFa: 'میزبانی تجهیزات شما در دیتاسنتر',
    icon: Building2,
    featuresFa: ['رک ۴۲U استاندارد', 'برق ۱ تا ۴ کیلووات', 'پهنای باند اختصاصی', 'دسترسی ۲۴/۷'],
    specs: [{ label: 'رک', value: '۴۲U ۶۰۰×۱۰۰۰' }, { label: 'برق', value: '۱-۴ kW' }, { label: 'SLA', value: '۹۹.۹٪' }],
    pricingModel: 'rack', priceFromToman: 1500000,
  },
  {
    slug: 'bandwidth', category: 'servers', titleFa: 'پهنای باند اختصاصی',
    taglineFa: 'اتصال اختصاصی به اینترنت بین‌الملل',
    icon: Wifi,
    featuresFa: ['BGP Multi-homing', '۹۵th-percentile billing', 'Anycast', 'DDoS Protection'],
    specs: [{ label: 'حداقل', value: '۱ Gbps' }, { label: 'حداکثر', value: '۱۰۰ Gbps' }, { label: 'Billing', value: '95th percentile' }],
    pricingModel: 'monthly', priceFromToman: 890000,
  },

  // AI
  {
    slug: 'llm-api', category: 'ai', titleFa: 'API گفتگوی هوشمند',
    taglineFa: 'مدل‌های زبانی بزرگ با پشتیبانی فارسی',
    icon: MessageSquare,
    featuresFa: ['پشتیبانی فارسی کامل', 'Streaming پاسخ', 'Function Calling', 'Context 128K'],
    specs: [{ label: 'Input', value: '۵۰٬۰۰۰ ت/میلیون توکن' }, { label: 'Output', value: '۱۰۰٬۰۰۰ ت/میلیون توکن' }, { label: 'Latency', value: '< ۲ ثانیه' }],
    pricingModel: 'per-token', priceFromToman: 50000, popular: true,
  },
  {
    slug: 'vision-api', category: 'ai', titleFa: 'بینایی و OCR',
    taglineFa: 'تشخیص تصویر و تبدیل تصویر به متن',
    icon: Eye,
    featuresFa: ['OCR فارسی/انگلیسی', 'تشخیص چهره', 'تحلیل تصویر', 'Batch processing'],
    specs: [{ label: 'قیمت', value: '۳۰٬۰۰۰ ت/هزار' }, { label: 'دقت OCR', value: '۹۸٪' }, { label: 'Throughput', value: '۱۰۰۰ req/s' }],
    pricingModel: 'monthly', priceFromToman: 30000,
  },
  {
    slug: 'stt-api', category: 'ai', titleFa: 'گفتار به متن',
    taglineFa: 'تبدیل صدای فارسی به متن',
    icon: Mic,
    featuresFa: ['پشتیبانی فارسی محاوره', 'Real-time streaming', 'تشخیص گوینده', '۵۰+ زبان'],
    specs: [{ label: 'قیمت', value: '۲۰٬۰۰۰ ت/ساعت' }, { label: 'WER فارسی', value: '< ۸٪' }, { label: 'Latency', value: '< ۵۰۰ms' }],
    pricingModel: 'per-minute', priceFromToman: 20000,
  },
  {
    slug: 'tts-api', category: 'ai', titleFa: 'متن به گفتار',
    taglineFa: 'تولید صدای طبیعی فارسی',
    icon: Volume2,
    featuresFa: ['۱۰+ صدای فارسی', 'کنترل احساس', 'SSML پشتیبانی', 'Streaming'],
    specs: [{ label: 'قیمت', value: '۲۵٬۰۰۰ ت/میلیون کاراکتر' }, { label: 'صداهای فارسی', value: '۱۰+' }, { label: 'Sample Rate', value: '۴۸kHz' }],
    pricingModel: 'per-char', priceFromToman: 25000,
  },
  {
    slug: 'embeddings-api', category: 'ai', titleFa: 'بردار معنایی',
    taglineFa: 'تولید Embedding برای RAG و جستجو',
    icon: Link2,
    featuresFa: ['۱۵۳۶ بعد', 'پشتیبانی فارسی', 'Batch API', 'مناسب RAG'],
    specs: [{ label: 'قیمت', value: '۱۰٬۰۰۰ ت/میلیون توکن' }, { label: 'ابعاد', value: '۱۵۳۶' }, { label: 'Max tokens', value: '۸۱۹۲' }],
    pricingModel: 'per-token', priceFromToman: 10000,
  },
  {
    slug: 'ai-playground', category: 'ai', titleFa: 'زمین آزمایش آنلاین',
    taglineFa: 'تست مدل‌ها بدون کدنویسی',
    icon: Play,
    featuresFa: ['رابط بصری', 'مقایسه مدل‌ها', 'تنظیم Hyperparameters', 'Export نتایج'],
    specs: [{ label: 'مدل‌ها', value: '۱۰+' }, { label: 'رایگان', value: '۱۰۰۰ درخواست' }, { label: 'Session', value: 'نامحدود' }],
    pricingModel: 'ticket', priceFromToman: 0,
  },

  // DATACENTER
  {
    slug: 'smart-hands', category: 'datacenter', titleFa: 'دست هوشمند',
    taglineFa: 'پشتیبانی فیزیکی از تجهیزات شما',
    icon: Wrench,
    featuresFa: ['Reboot سرور', 'تعویض قطعات', 'کابل‌کشی', 'عکاسی از رک'],
    specs: [{ label: 'زمان پاسخ', value: '< ۳۰ دقیقه' }, { label: 'ساعات', value: '۲۴/۷' }, { label: 'تکنسین', value: 'مجرب' }],
    pricingModel: 'ticket', priceFromToman: 250000,
  },
  {
    slug: 'ddos-protection', category: 'datacenter', titleFa: 'حفاظت DDoS',
    taglineFa: 'محافظت L3/L4/L7 در برابر حملات',
    icon: ShieldAlert,
    featuresFa: ['لایه ۳/۴/۷', 'ظرفیت ۱ Tbps', 'تشخیص هوشمند', 'گزارش لحظه‌ای'],
    specs: [{ label: 'ظرفیت', value: '۱ Tbps' }, { label: 'لایه‌ها', value: 'L3/L4/L7' }, { label: 'Mitigation', value: '< ۱۰ ثانیه' }],
    pricingModel: 'monthly', priceFromToman: 590000,
  },
  {
    slug: 'env-monitoring', category: 'datacenter', titleFa: 'پایش محیطی',
    taglineFa: 'مانیتورینگ دما، رطوبت و برق',
    icon: Gauge,
    featuresFa: ['دمای دقیق ±۰.۵°C', 'رطوبت ۴۵-۵۵٪', 'هشدار آنی', 'گزارش‌های ماهانه'],
    specs: [{ label: 'دقت دما', value: '±۰.۵°C' }, { label: 'رطوبت', value: '۴۵-۵۵٪' }, { label: 'PUE', value: '۱.۴' }],
    pricingModel: 'monthly', priceFromToman: 150000,
  },
  {
    slug: 'migration', category: 'datacenter', titleFa: 'مهاجرت و استقرار',
    taglineFa: 'مهاجرت رایگان از هر سرویس‌دهنده',
    icon: Truck,
    featuresFa: ['مهاجرت رایگان', 'بدون وقفه', 'تیم متخصص', 'گارانتی صحت'],
    specs: [{ label: 'هزینه', value: 'رایگان' }, { label: 'Downtime', value: '< ۵ دقیقه' }, { label: 'پلتفرم‌ها', value: 'همه' }],
    pricingModel: 'project', priceFromToman: 0,
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug);
}

export function getServicesByCategory(category: Category): Service[] {
  return services.filter(s => s.category === category);
}

export function getPopularServices(): Service[] {
  return services.filter(s => s.popular);
}
