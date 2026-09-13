import { Palette } from 'lucide-react';

export function DesignSystem() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <Palette className="w-10 h-10 text-pink-400" />
          سیستم طراحی
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          طراحی UX-First با RTL-First، Dark/Light mode، Storybook، shadcn/ui، و فونت Vazirmatn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
          <div className="text-4xl mb-3">🇮🇷</div>
          <h3 className="text-white font-bold text-lg mb-2">RTL-First</h3>
          <p className="text-gray-400 text-sm">طراحی راست‌چین با فونت Vazirmatn. پشتیبانی کامل از زبان فارسی.</p>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
          <div className="text-4xl mb-3">🌓</div>
          <h3 className="text-white font-bold text-lg mb-2">Dark/Light Mode</h3>
          <p className="text-gray-400 text-sm">پشتیبانی از هر دو حالت تاریک و روشن با تغییر آنی.</p>
        </div>
        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-white font-bold text-lg mb-2">Performance Budget</h3>
          <p className="text-gray-400 text-sm">LCP &lt; 2.5s, FID &lt; 100ms, CLS &lt; 0.1. Lighthouse CI در pipeline.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">🎨 Design Tokens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <div key={c.name} className="bg-[#050816] rounded-xl p-3 border border-white/5">
              <div className={`w-full h-12 rounded-lg ${c.color} mb-2`}></div>
              <p className="text-white text-xs font-medium">{c.name}</p>
              <p className="text-gray-500 text-[10px] font-mono" dir="ltr">{c.hex}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">🧩 کامپوننت‌ها</h2>
        <div className="flex flex-wrap gap-3">
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
    </div>
  );
}
