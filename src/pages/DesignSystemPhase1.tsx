import { useState } from 'react';
import { Palette, Type, Ruler, Layers, Sparkles, Accessibility, Gauge, BookOpen } from 'lucide-react';
import {
  Button, Card, Input, Badge, Alert, Skeleton, LoadingSpinner, EmptyState,
  SourceLayerBadge, VisibilityToggle, PowerControl, ThemeToggle, LanguageToggle
} from '../components/ui';
import { ThemeProvider, LanguageProvider, useTheme, useLanguage } from '../providers';

// ==================== Design Tokens Section ====================
function DesignTokensSection() {
  const colors = [
    { name: 'Primary', shades: ['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900'] },
    { name: 'Success', shades: ['bg-emerald-50', 'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-300', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-800', 'bg-emerald-900'] },
    { name: 'Warning', shades: ['bg-amber-50', 'bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-amber-600', 'bg-amber-700', 'bg-amber-800', 'bg-amber-900'] },
    { name: 'Error', shades: ['bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900'] },
  ];

  const sourceLayers = [
    { name: 'Owned', color: 'bg-emerald-500', hex: '#10B981' },
    { name: 'Partner', color: 'bg-amber-500', hex: '#F59E0B' },
    { name: 'European', color: 'bg-indigo-500', hex: '#6366F1' },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Palette className="w-7 h-7 text-pink-400" />
          Design Tokens
        </h2>
        <p className="text-gray-400">سیستم رنگ، تایپوگرافی، فاصله‌گذاری و سایر توکن‌های طراحی</p>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">🎨 پالت رنگ</h3>
        <div className="space-y-3">
          {colors.map((color) => (
            <div key={color.name} className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">{color.name}</h4>
              <div className="flex gap-1">
                {color.shades.map((shade, i) => (
                  <div key={i} className={`flex-1 h-12 rounded-md ${shade} transition-transform hover:scale-110`} title={`${color.name}-${(i + 1) * 100}`}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Layer Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">🌐 رنگ‌های Source Layer</h3>
        <div className="grid grid-cols-3 gap-4">
          {sourceLayers.map((layer) => (
            <div key={layer.name} className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-4">
              <div className={`w-full h-16 rounded-lg ${layer.color} mb-3`}></div>
              <h4 className="text-white font-medium text-sm">{layer.name}</h4>
              <p className="text-gray-500 text-xs font-mono" dir="ltr">{layer.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Type className="w-5 h-5 text-blue-400" />
          تایپوگرافی
        </h3>
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6 space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20 font-mono" dir="ltr">text-4xl</span>
            <span className="text-4xl font-black text-white">عنوان بزرگ</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20 font-mono" dir="ltr">text-3xl</span>
            <span className="text-3xl font-bold text-white">عنوان سطح ۱</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20 font-mono" dir="ltr">text-2xl</span>
            <span className="text-2xl font-semibold text-white">عنوان سطح ۲</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20 font-mono" dir="ltr">text-base</span>
            <span className="text-base text-gray-300">متن بدنه — فونت Vazirmatn با وزن ۴۰۰</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20 font-mono" dir="ltr">text-sm</span>
            <span className="text-sm text-gray-400">متن کوچک — برای توضیحات و metadata</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20 font-mono" dir="ltr">font-mono</span>
            <span className="text-sm text-gray-300 font-mono" dir="ltr">JetBrains Mono — برای کد</span>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Ruler className="w-5 h-5 text-emerald-400" />
          فاصله‌گذاری (4px Grid)
        </h3>
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((space) => (
              <div key={space} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-12 font-mono" dir="ltr">{space * 4}px</span>
                <div className="bg-blue-500/30 h-4 rounded" style={{ width: `${space * 8}px` }}></div>
                <span className="text-xs text-gray-400">space-{space}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== Components Section ====================
function ComponentsSection() {
  const [visibility, setVisibility] = useState<'public' | 'hidden' | 'deprecated' | 'inviteOnly'>('public');
  const [powerStatus, setPowerStatus] = useState<'running' | 'stopped' | 'starting' | 'stopping'>('running');

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Layers className="w-7 h-7 text-purple-400" />
          کتابخانه کامپوننت‌ها
        </h2>
        <p className="text-gray-400">کامپوننت‌های UI قابل استفاده با تمام variantها و stateها</p>
      </div>

      {/* Buttons */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🔘 Button</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Variants</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">اصلی</Button>
              <Button variant="secondary">ثانویه</Button>
              <Button variant="outline">خطی</Button>
              <Button variant="ghost">شفاف</Button>
              <Button variant="destructive">مخرب</Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">کوچک</Button>
              <Button size="md">متوسط</Button>
              <Button size="lg">بزرگ</Button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">States</p>
            <div className="flex flex-wrap gap-3">
              <Button disabled>غیرفعال</Button>
              <Button loading>در حال بارگذاری</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🃏 Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default">
            <h4 className="text-white font-semibold mb-2">کارت پیش‌فرض</h4>
            <p className="text-gray-400 text-sm">این یک کارت با variant پیش‌فرض است.</p>
          </Card>
          <Card variant="elevated" hover>
            <h4 className="text-white font-semibold mb-2">کارت برجسته</h4>
            <p className="text-gray-400 text-sm">این کارت با hover effect است.</p>
          </Card>
        </div>
      </div>

      {/* Input */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📝 Input</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="متن ورودی..." />
          <Input label="ایمیل" type="email" placeholder="example@abran.ir" />
          <Input label="با خطا" error="این فیلد الزامی است" />
          <Input label="غیرفعال" disabled placeholder="غیرفعال" />
        </div>
      </div>

      {/* Badges */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🏷️ Badge</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">پیش‌فرض</Badge>
          <Badge variant="success">موفقیت</Badge>
          <Badge variant="warning">هشدار</Badge>
          <Badge variant="error">خطا</Badge>
          <Badge variant="info">اطلاعات</Badge>
          <Badge variant="owned">مالکیتی</Badge>
          <Badge variant="partner">شریک</Badge>
          <Badge variant="european">اروپایی</Badge>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚠️ Alert</h3>
        <div className="space-y-3">
          <Alert variant="info" title="اطلاعات">این یک پیام اطلاعاتی است.</Alert>
          <Alert variant="success" title="موفقیت">عملیات با موفقیت انجام شد.</Alert>
          <Alert variant="warning" title="هشدار">لطفاً توجه کنید.</Alert>
          <Alert variant="error" title="خطا">خطایی رخ داده است.</Alert>
        </div>
      </div>

      {/* Skeleton */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💀 Skeleton</h3>
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-3">
            <Skeleton variant="circular" className="w-12 h-12" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">⏳ LoadingSpinner</h3>
        <div className="flex items-center gap-6">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📭 EmptyState</h3>
        <EmptyState
          icon="📦"
          title="هیچ سرویسی وجود ندارد"
          description="هنوز سرویسی خریداری نکرده‌اید. از کاتالوگ ما دیدن کنید."
          action={<Button>مشاهده کاتالوگ</Button>}
        />
      </div>

      {/* SourceLayerBadge */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🌐 SourceLayerBadge</h3>
        <div className="flex flex-wrap gap-3">
          <SourceLayerBadge layer="owned" />
          <SourceLayerBadge layer="partner" />
          <SourceLayerBadge layer="european" />
        </div>
      </div>

      {/* VisibilityToggle */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">👁️ VisibilityToggle</h3>
        <VisibilityToggle value={visibility} onChange={setVisibility} />
        <p className="text-sm text-gray-400 mt-3">مقدار فعلی: <code className="text-blue-400 font-mono" dir="ltr">{visibility}</code></p>
      </div>

      {/* PowerControl */}
      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚡ PowerControl</h3>
        <PowerControl
          status={powerStatus}
          onStart={() => setPowerStatus('starting')}
          onStop={() => setPowerStatus('stopping')}
          onReboot={() => setPowerStatus('starting')}
        />
        <p className="text-sm text-gray-400 mt-3">وضعیت: <code className="text-blue-400 font-mono" dir="ltr">{powerStatus}</code></p>
      </div>
    </section>
  );
}

// ==================== Theme & Language Section ====================
function ThemeLanguageSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Sparkles className="w-7 h-7 text-amber-400" />
          تم و زبان
        </h2>
        <p className="text-gray-400">پشتیبانی از Dark/Light mode و RTL/LTR</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🌓 Theme Toggle</h3>
          <ThemeToggle />
        </div>
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🌐 Language Toggle</h3>
          <LanguageToggle />
        </div>
      </div>
    </section>
  );
}

// ==================== Accessibility Section ====================
function AccessibilitySection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Accessibility className="w-7 h-7 text-cyan-400" />
          دسترس‌پذیری (WCAG 2.1 AA)
        </h2>
        <p className="text-gray-400">الزامات دسترس‌پذیری برای تمام کامپوننت‌ها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-white font-bold mb-3">👁️ Perceivable</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ کنتراست رنگ حداقل ۴.۵:۱</li>
            <li>✓ متن جایگزین برای تصاویر</li>
            <li>✓ رنگ تنها وسیله انتقال اطلاعات نیست</li>
            <li>✓ متن تا ۲۰۰٪ قابل بزرگ‌نمایی</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-white font-bold mb-3">⌨️ Operable</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ تمام عملکردها با کیبورد قابل دسترسی</li>
            <li>✓ بدون keyboard trap</li>
            <li>✓ ترتیب focus منطقی</li>
            <li>✓ focus indicator واضح</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-white font-bold mb-3">🧠 Understandable</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ متن خوانا و قابل فهم</li>
            <li>✓ صفحات قابل پیش‌بینی</li>
            <li>✓ کمک به جلوگیری از خطا</li>
            <li>✓ پیام‌های خطای واضح</li>
          </ul>
        </Card>
        <Card>
          <h3 className="text-white font-bold mb-3">🔧 Robust</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ سازگاری با assistive technologies</li>
            <li>✓ ARIA labels و roles صحیح</li>
            <li>✓ HTML semantic</li>
            <li>✓ تست خودکار با axe-core</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}

// ==================== Performance Section ====================
function PerformanceSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Gauge className="w-7 h-7 text-orange-400" />
          Performance Budget
        </h2>
        <p className="text-gray-400">محدودیت‌های عملکردی enforced در CI/CD</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-4xl font-black text-emerald-400 mb-2">&lt; 2.5s</div>
          <h3 className="text-white font-bold mb-1">LCP</h3>
          <p className="text-gray-400 text-sm">Largest Contentful Paint</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-black text-blue-400 mb-2">&lt; 100ms</div>
          <h3 className="text-white font-bold mb-1">FID</h3>
          <p className="text-gray-400 text-sm">First Input Delay</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-black text-purple-400 mb-2">&lt; 0.1</div>
          <h3 className="text-white font-bold mb-1">CLS</h3>
          <p className="text-gray-400 text-sm">Cumulative Layout Shift</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-white font-bold mb-4">🚀 تکنیک‌های بهینه‌سازی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Image Optimization</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Next.js Image component</li>
              <li>• WebP/AVIF format</li>
              <li>• Lazy loading</li>
              <li>• Responsive srcset</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">Font Optimization</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Preload critical fonts</li>
              <li>• font-display: swap</li>
              <li>• Subset for Persian</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-purple-400 mb-2">Bundle Optimization</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Tree shaking</li>
              <li>• Dynamic imports</li>
              <li>• Code splitting</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-400 mb-2">Caching</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Static assets long TTL</li>
              <li>• CDN edge cache</li>
              <li>• API response caching</li>
            </ul>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Documentation Section ====================
function DocumentationSection() {
  const docs = [
    { title: 'Brand Guidelines', icon: '🎨', desc: 'لوگو، رنگ‌ها، تایپوگرافی' },
    { title: 'Component Library', icon: '🧩', desc: 'مستندات تمام کامپوننت‌ها' },
    { title: 'RTL Design', icon: '🇮🇷', desc: 'راهنمای طراحی راست‌چین' },
    { title: 'Accessibility', icon: '♿', desc: 'الزامات WCAG 2.1 AA' },
    { title: 'Performance', icon: '⚡', desc: 'Performance budget و بهینه‌سازی' },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <BookOpen className="w-7 h-7 text-indigo-400" />
          مستندات
        </h2>
        <p className="text-gray-400">مستندات کامل Design System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <Card key={doc.title} hover>
            <div className="text-3xl mb-3">{doc.icon}</div>
            <h3 className="text-white font-bold mb-1">{doc.title}</h3>
            <p className="text-gray-400 text-sm">{doc.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ==================== Main Page ====================
export function DesignSystemPhase1() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="space-y-12">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/30 via-[#0a0f1f] to-pink-900/30 border border-white/10 p-10">
            <div className="absolute inset-0 grid-pattern opacity-30"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white">فاز ۱: Design System</h1>
                  <p className="text-purple-300 text-lg">Design System & UX Foundation</p>
                </div>
              </div>

              <p className="text-gray-300 max-w-3xl leading-relaxed text-lg mb-6">
                زیرساخت کامل Design System، کتابخانه کامپوننت‌ها، Storybook، پشتیبانی RTL،
                Dark/Light mode، دسترس‌پذیری و بهینه‌سازی عملکرد.
              </p>

              <div className="flex gap-3 flex-wrap">
                {['UX-First', 'RTL-First', 'Dark/Light', 'WCAG 2.1 AA', 'Performance Budget', 'Storybook'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sections */}
          <DesignTokensSection />
          <ComponentsSection />
          <ThemeLanguageSection />
          <AccessibilitySection />
          <PerformanceSection />
          <DocumentationSection />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
