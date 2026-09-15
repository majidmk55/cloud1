export interface ProductItem {
  slug: string;
  label: string;
  description?: string;
}

export interface ProductCategory {
  slug: string;
  label: string;
  icon: string;
  items: ProductItem[];
}

export const productData: ProductCategory[] = [
  {
    slug: 'cloud',
    label: 'خدمات ابری',
    icon: '☁️',
    items: [
      { slug: 'vps', label: 'سرور مجازی ابری', description: 'سرور مجازی با منابع اختصاصی' },
      { slug: 'server', label: 'سرور ابری', description: 'سرور ابری مقیاس‌پذیر' },
      { slug: 'cpu', label: 'CPU ابری', description: 'پردازنده ابری اختصاصی' },
      { slug: 'gpu', label: 'GPU ابری', description: 'گرافیک ابری برای AI' },
      { slug: 'bare-metal', label: 'سرور فیزیکی', description: 'سرور bare-metal اختصاصی' },
      { slug: 'dedicated', label: 'سرور اختصاصی', description: 'سرور کاملاً اختصاصی' },
    ],
  },
  {
    slug: 'vps',
    label: 'سرور مجازی',
    icon: '🖥️',
    items: [
      { slug: 'iran', label: 'VPS ایران', description: 'سرور مجازی در دیتاسنتر ایران' },
      { slug: 'europe', label: 'VPS اروپا', description: 'سرور مجازی در اروپا' },
      { slug: 'usa', label: 'VPS آمریکا', description: 'سرور مجازی در آمریکا' },
      { slug: 'turkey', label: 'VPS ترکیه', description: 'سرور مجازی در ترکیه' },
      { slug: 'economy', label: 'VPS اقتصادی', description: 'سرور مجازی مقرون‌به‌صرفه' },
      { slug: 'pro', label: 'VPS حرفه‌ای', description: 'سرور مجازی حرفه‌ای' },
      { slug: 'enterprise', label: 'VPS سازمانی', description: 'سرور مجازی سازمانی' },
    ],
  },
  {
    slug: 'ai',
    label: 'هوش مصنوعی',
    icon: '🤖',
    items: [
      { slug: 'cloud', label: 'AI Cloud', description: 'زیرساخت ابری برای AI' },
      { slug: 'gpu', label: 'GPU برای AI', description: 'GPU اختصاصی برای آموزش مدل' },
      { slug: 'vps', label: 'VPS هوش مصنوعی', description: 'سرور مجازی بهینه برای AI' },
      { slug: 'api', label: 'API هوش مصنوعی', description: 'API‌های آماده AI' },
      { slug: 'llm', label: 'مدل‌های زبانی', description: 'LLM فارسی و چندزبانه' },
      { slug: 'inference', label: 'استنتاج مدل', description: 'سرویس inference مدل‌ها' },
      { slug: 'training', label: 'آموزش مدل', description: 'زیرساخت آموزش مدل' },
      { slug: 'gpu-rental', label: 'اجاره GPU', description: 'اجاره GPU ساعتی' },
      { slug: 'agents', label: 'ایجنت‌های AI', description: 'ایجنت‌های هوشمند' },
    ],
  },
  {
    slug: 'storage',
    label: 'فضای ذخیره‌سازی',
    icon: '💾',
    items: [
      { slug: 'object', label: 'ذخیره‌سازی شیء', description: 'Object Storage سازگار با S3' },
      { slug: 'block', label: 'ذخیره‌سازی بلوکی', description: 'Block Storage پرسرعت' },
      { slug: 'file', label: 'ذخیره‌سازی فایلی', description: 'File Storage اشتراکی' },
      { slug: 'backup', label: 'پشتیبان‌گیری', description: 'بکاپ ابری خودکار' },
      { slug: 'snapshot', label: 'اسنپ‌شات', description: 'Snapshot از سرورها' },
    ],
  },
  {
    slug: 'network',
    label: 'شبکه و امنیت',
    icon: '🔒',
    items: [
      { slug: 'IP', label: 'IP اختصاصی', description: 'آی‌پی ثابت اختصاصی' },
      { slug: 'private', label: 'شبکه خصوصی', description: 'شبکه خصوصی مجازی' },
      { slug: 'VPC', label: 'VPC', description: 'Virtual Private Cloud' },
      { slug: 'firewall', label: 'فایروال', description: 'فایروال پیشرفته' },
      { slug: 'WAF', label: 'WAF', description: 'Web Application Firewall' },
      { slug: 'DDOS', label: 'محافظت DDoS', description: 'محافظت در برابر حملات DDoS' },
      { slug: 'load-balancer', label: 'Load Balancer', description: 'توزیع‌کننده بار' },
      { slug: 'CDN', label: 'CDN', description: 'شبکه توزیع محتوا' },
      { slug: 'DNS', label: 'DNS', description: 'سرویس DNS مدیریت‌شده' },
    ],
  },
  {
    slug: 'database',
    label: 'پایگاه داده',
    icon: '🗄️',
    items: [
      { slug: 'mysql', label: 'MySQL', description: 'دیتابیس MySQL مدیریت‌شده' },
      { slug: 'postgresql', label: 'PostgreSQL', description: 'دیتابیس PostgreSQL مدیریت‌شده' },
      { slug: 'redis', label: 'Redis', description: 'کش و دیتابیس Redis' },
      { slug: 'managed', label: 'دیتابیس مدیریت‌شده', description: 'دیتابیس کاملاً مدیریت‌شده' },
    ],
  },
  {
    slug: 'enterprise',
    label: 'راهکارهای سازمانی',
    icon: '🏢',
    items: [
      { slug: 'private-cloud', label: 'ابر خصوصی', description: 'زیرساخت ابری خصوصی' },
      { slug: 'hybrid-cloud', label: 'ابر ترکیبی', description: 'راهکار ابر هیبریدی' },
      { slug: 'colocation', label: 'کولوکیشن', description: 'میزبانی تجهیزات در دیتاسنتر' },
      { slug: 'disaster-recovery', label: 'بازیابی فاجعه', description: 'راهکار DR' },
      { slug: 'managed-services', label: 'سرویس‌های مدیریت‌شده', description: 'مدیریت کامل زیرساخت' },
    ],
  },
];
