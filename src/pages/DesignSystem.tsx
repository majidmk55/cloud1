export function DesignSystem() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🎨</span> سیستم طراحی
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          طراحی UX-First با RTL-First، Dark/Light mode، Storybook، shadcn/ui، و فونت Vazirmatn.
          Performance Budget: LCP &lt; 2.5s, FID &lt; 100ms, CLS &lt; 0.1.
        </p>
      </div>

      {/* Design Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="text-3xl mb-3">🇮🇷</div>
          <h3 className="text-white font-bold mb-2">RTL-First</h3>
          <p className="text-gray-400 text-sm">طراحی راست‌چین با فونت Vazirmatn. پشتیبانی کامل از زبان فارسی و اعداد فارسی.</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="text-3xl mb-3">🌓</div>
          <h3 className="text-white font-bold mb-2">Dark/Light Mode</h3>
          <p className="text-gray-400 text-sm">پشتیبانی از هر دو حالت تاریک و روشن با تغییر آنی. ذخیره ترجیح کاربر.</p>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="text-white font-bold mb-2">Performance Budget</h3>
          <p className="text-gray-400 text-sm">LCP &lt; 2.5s, FID &lt; 100ms, CLS &lt; 0.1. Lighthouse CI در pipeline.</p>
        </div>
      </div>

      {/* Design Tokens */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🎨 Design Tokens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { name: 'Primary', color: 'bg-blue-500', hex: '#3B82F6' },
            { name: 'Owned', color: 'bg-emerald-500', hex: '#10B981' },
            { name: 'Partner', color: 'bg-amber-500', hex: '#F59E0B' },
            { name: 'European', color: 'bg-indigo-500', hex: '#6366F1' },
            { name: 'Success', color: 'bg-green-500', hex: '#22C55E' },
            { name: 'Warning', color: 'bg-yellow-500', hex: '#EAB308' },
            { name: 'Error', color: 'bg-red-500', hex: '#EF4444' },
            { name: 'Info', color: 'bg-cyan-500', hex: '#06B6D4' },
          ].map((c) => (
            <div key={c.name} className="bg-gray-950 rounded-lg p-3 border border-gray-700">
              <div className={`w-full h-12 rounded-md ${c.color} mb-2`}></div>
              <p className="text-white text-xs font-medium">{c.name}</p>
              <p className="text-gray-500 text-[10px] font-mono" dir="ltr">{c.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📝 تایپوگرافی</h2>
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20">Display</span>
            <span className="text-4xl font-bold text-white">عنوان بزرگ</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20">H1</span>
            <span className="text-3xl font-bold text-white">عنوان سطح ۱</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20">H2</span>
            <span className="text-2xl font-semibold text-white">عنوان سطح ۲</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20">Body</span>
            <span className="text-base text-gray-300">متن بدنه — فونت Vazirmatn با وزن ۴۰۰</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20">Small</span>
            <span className="text-sm text-gray-400">متن کوچک — برای توضیحات و metadata</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-gray-500 text-xs w-20">Mono</span>
            <span className="text-sm text-gray-300 font-mono" dir="ltr">JetBrains Mono — برای کد</span>
          </div>
        </div>
      </div>

      {/* Components Preview */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🧩 کامپوننت‌ها (shadcn/ui)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">دکمه‌ها</h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                اصلی
              </button>
              <button className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                ثانویه
              </button>
              <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Outline
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">
                موفقیت
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">
                خطر
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">ورودی‌ها</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="متن ورودی..."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <select className="w-full px-3 py-2 bg-gray-950 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500">
                <option>انتخاب کنید...</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Storybook */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📚 Storybook</h2>
        <p className="text-gray-400 text-sm mb-4">
          Storybook برای مستندسازی و تست کامپوننت‌ها. هر کامپوننت دارای stories جداگانه با حالت‌های مختلف (RTL/LTR, Dark/Light, Sizes).
        </p>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono" dir="ltr">
{`// apps/design-system/.storybook/preview.ts

export const parameters = {
  layout: 'centered',
  directions: ['rtl', 'ltr'],
  themes: {
    default: 'dark',
    list: [
      { name: 'Dark', class: 'dark', color: '#0a0a0a' },
      { name: 'Light', class: 'light', color: '#ffffff' },
    ],
  },
};

// Button.stories.tsx
export const Primary = {
  args: {
    variant: 'primary',
    children: 'دکمه اصلی',
    size: 'md',
  },
};`}
          </pre>
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">♿ دسترس‌پذیری (WCAG 2.1 AA)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">الزامات</h3>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>• کنتراست رنگ حداقل ۴.۵:۱</li>
              <li>• پشتیبانی از keyboard navigation</li>
              <li>• ARIA labels برای تمام عناصر تعاملی</li>
              <li>• Focus indicators واضح</li>
              <li>• Alt text برای تصاویر</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-2">تست خودکار</h3>
            <ul className="space-y-1.5 text-sm text-gray-300">
              <li>• axe-core در CI pipeline</li>
              <li>• Playwright accessibility tests</li>
              <li>• Lighthouse accessibility audit</li>
              <li>• Manual testing با screen readers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
