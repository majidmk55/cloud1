import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Target, BarChart3 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export function BiDashboard() {
  const [activeTab, setActiveTab] = useState('command-center');

  const tabs = [
    { id: 'command-center', label: 'فرماندهی KPI', icon: Target },
    { id: 'financial', label: 'مالی', icon: DollarSign },
    { id: 'marketing', label: 'بازاریابی', icon: TrendingUp },
    { id: 'customers', label: 'مشتریان', icon: Users },
    { id: 'predictive', label: 'پیش‌بینی', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#00D4FF]" />
            هوش تجاری و تحلیل داده
          </h1>
          <p className="text-gray-400">داشبورد جامع BI با ۳۰ متد تحلیل در ۶ لایه</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'command-center' && <CommandCenter />}
        {activeTab === 'financial' && <FinancialDashboard />}
        {activeTab === 'marketing' && <MarketingDashboard />}
        {activeTab === 'customers' && <CustomerDashboard />}
        {activeTab === 'predictive' && <PredictiveDashboard />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMMAND CENTER (Spec #6)
// ═══════════════════════════════════════════════════════════

function CommandCenter() {
  const kpiCards = [
    { label: 'MRR', value: '۱۵۰M', change: '+۱۲٪', positive: true, color: '#00D4FF' },
    { label: 'Net Revenue', value: '۱۸۰M', change: '+۸٪', positive: true, color: '#00E5A0' },
    { label: 'Health Index', value: '۷۸.۵', change: '+۵٪', positive: true, color: '#9D6BFF' },
    { label: 'Active Customers', value: '۱,۲۵۰', change: '+۳٪', positive: true, color: '#00C9A7' },
    { label: 'Churn Rate', value: '۴.۵٪', change: '-۰.۵٪', positive: true, color: '#FF4D6D' },
    { label: 'Gross Margin', value: '۶۸٪', change: '+۲٪', positive: true, color: '#A8E063' },
  ];

  const mrrData = [
    { month: 'فروردین', value: 80 },
    { month: 'اردیبهشت', value: 85 },
    { month: 'خرداد', value: 88 },
    { month: 'تیر', value: 92 },
    { month: 'مرداد', value: 95 },
    { month: 'شهریور', value: 100 },
  ];

  const radarData = [
    { metric: 'MRR Growth', value: 85 },
    { metric: 'Margin', value: 68 },
    { metric: 'Customer Health', value: 78 },
    { metric: 'Retention', value: 75 },
    { metric: 'Expansion', value: 82 },
  ];

  return (
    <div>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpiCards.map((kpi, i) => (
          <div key={i} className="bg-[#0a0f1f] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
            <div className="text-gray-400 text-sm mb-2">{kpi.label}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className={`text-sm flex items-center gap-1 ${kpi.positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Trend */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">MRR Trend</h3>
          <div className="h-64 flex items-end gap-2">
            {mrrData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-[#00D4FF] to-[#4FC3F7] rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${d.value}%` }}
                />
                <span className="text-xs text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart (SVG) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">KPI Balance Radar</h3>
          <div className="h-64 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full max-w-[300px]">
              {/* Grid */}
              {[20, 40, 60, 80].map(r => (
                <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.1)" />
              ))}
              {/* Axes */}
              {radarData.map((d, i) => {
                const angle = (i * 72 - 90) * Math.PI / 180;
                const x = 100 + 80 * Math.cos(angle);
                const y = 100 + 80 * Math.sin(angle);
                return (
                  <line key={i} x1="100" y1="100" x2={x} y2={y} stroke="rgba(255,255,255,0.1)" />
                );
              })}
              {/* Data polygon */}
              <polygon
                points={radarData.map((d, i) => {
                  const angle = (i * 72 - 90) * Math.PI / 180;
                  const r = (d.value / 100) * 80;
                  const x = 100 + r * Math.cos(angle);
                  const y = 100 + r * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ')}
                fill="rgba(0, 212, 255, 0.3)"
                stroke="#00D4FF"
                strokeWidth="2"
              />
              {/* Labels */}
              {radarData.map((d, i) => {
                const angle = (i * 72 - 90) * Math.PI / 180;
                const x = 100 + 90 * Math.cos(angle);
                const y = 100 + 90 * Math.sin(angle);
                return (
                  <text key={i} x={x} y={y} textAnchor="middle" fill="#999" fontSize="8">
                    {d.metric}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-6 bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">خلاصه اجرایی</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-gray-300">
              📈 عملکرد کلی شرکت در ماه جاری <span className="text-emerald-400 font-bold">مثبت</span> بوده است.
              MRR با رشد ۱۲ درصدی به ۱۵۰ میلیون تومان رسیده و Health Index شرکت در سطح ۷۸.۵ قرار دارد.
            </p>
          </div>
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
            <p className="text-sm text-gray-300">
              ✅ نرخ Churn با کاهش ۰.۵ درصدی به ۴.۵٪ رسیده که نشان‌دهنده بهبود رضایت مشتریان است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FINANCIAL DASHBOARD (Spec #3-5)
// ═══════════════════════════════════════════════════════════

function FinancialDashboard() {
  const mrrData = [
    { month: 'فروردین', new: 15, expansion: 8, churn: -5, total: 100 },
    { month: 'اردیبهشت', new: 18, expansion: 10, churn: -6, total: 122 },
    { month: 'خرداد', new: 20, expansion: 12, churn: -7, total: 147 },
    { month: 'تیر', new: 22, expansion: 11, churn: -8, total: 172 },
    { month: 'مرداد', new: 25, expansion: 13, churn: -9, total: 201 },
    { month: 'شهریور', new: 28, expansion: 14, churn: -10, total: 233 },
  ];

  const marginData = [
    { product: 'VPS', datacenter: 15, ip: 5, gateway: 3, support: 8 },
    { product: 'GPU', datacenter: 25, ip: 4, gateway: 2, support: 12 },
    { product: 'Storage', datacenter: 12, ip: 3, gateway: 4, support: 6 },
    { product: 'CDN', datacenter: 18, ip: 6, gateway: 5, support: 7 },
    { product: 'AI API', datacenter: 20, ip: 3, gateway: 8, support: 15 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Waterfall (Spec #4) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">MRR Waterfall (Spec #4)</h3>
          <div className="h-64 flex items-end gap-2">
            {mrrData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5" style={{ height: '100%' }}>
                  <div className="bg-[#00E5A0] rounded-t" style={{ height: `${d.new}%` }} />
                  <div className="bg-[#A8E063]" style={{ height: `${d.expansion}%` }} />
                  <div className="bg-[#FF4D6D] rounded-b" style={{ height: `${Math.abs(d.churn)}%` }} />
                </div>
                <span className="text-xs text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00E5A0]" />New</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#A8E063]" />Expansion</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF4D6D]" />Churn</div>
          </div>
        </div>

        {/* Margin Matrix (Spec #5) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Margin Matrix (Spec #5)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-2 text-right text-gray-400">محصول</th>
                  <th className="p-2 text-center text-gray-400">Datacenter</th>
                  <th className="p-2 text-center text-gray-400">IP</th>
                  <th className="p-2 text-center text-gray-400">Gateway</th>
                  <th className="p-2 text-center text-gray-400">Support</th>
                </tr>
              </thead>
              <tbody>
                {marginData.map((row, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="p-2 text-gray-300">{row.product}</td>
                    <td className="p-2 text-center" style={{ backgroundColor: `rgba(255, 138, 61, ${row.datacenter / 30})` }}>{row.datacenter}%</td>
                    <td className="p-2 text-center" style={{ backgroundColor: `rgba(255, 176, 32, ${row.ip / 10})` }}>{row.ip}%</td>
                    <td className="p-2 text-center" style={{ backgroundColor: `rgba(157, 107, 255, ${row.gateway / 10})` }}>{row.gateway}%</td>
                    <td className="p-2 text-center" style={{ backgroundColor: `rgba(255, 107, 193, ${row.support / 20})` }}>{row.support}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MARKETING DASHBOARD (Spec #7-14)
// ═══════════════════════════════════════════════════════════

function MarketingDashboard() {
  const funnelData = [
    { stage: 'بازدید', count: 10000, width: '100%' },
    { stage: 'مشاهده', count: 4500, width: '75%' },
    { stage: 'سبد خرید', count: 2000, width: '50%' },
    { stage: 'پرداخت', count: 800, width: '30%' },
    { stage: 'فعال‌سازی', count: 750, width: '25%' },
  ];

  const cacLtvData = [
    { channel: 'Google', cac: 5, ltv: 25 },
    { channel: 'Meta', cac: 3, ltv: 18 },
    { channel: 'LinkedIn', cac: 8, ltv: 40 },
    { channel: 'Organic', cac: 1, ltv: 15 },
    { channel: 'Referral', cac: 2, ltv: 20 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Chart (Spec #7) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Sales Funnel (Spec #7)</h3>
          <div className="space-y-2">
            {funnelData.map((d, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-400">{d.stage}</div>
                <div className="flex-1 relative">
                  <div 
                    className="h-10 rounded-lg flex items-center justify-center text-white font-bold transition-all hover:opacity-80"
                    style={{ 
                      width: d.width,
                      background: `linear-gradient(90deg, #00D4FF, #4FC3F7)`,
                    }}
                  >
                    {d.count.toLocaleString('fa-IR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAC/LTV (Spec #8-10) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">CAC vs LTV (Spec #8-10)</h3>
          <div className="space-y-4">
            {cacLtvData.map((d, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-400">{d.channel}</div>
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 h-8 bg-[#FF8A3D] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    CAC: {d.cac}M
                  </div>
                  <div className="flex-1 h-8 bg-[#00E5A0] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    LTV: {d.ltv}M
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CUSTOMER DASHBOARD (Spec #15-19)
// ═══════════════════════════════════════════════════════════

function CustomerDashboard() {
  const rfmData = Array.from({ length: 30 }, () => ({
    recency: Math.floor(Math.random() * 90) + 1,
    frequency: Math.floor(Math.random() * 20) + 1,
    monetary: Math.floor(Math.random() * 50) + 10,
    segment: ['Champions', 'Loyal', 'At Risk', 'Hibernating'][Math.floor(Math.random() * 4)],
  }));

  const cohortData = [
    { cohort: 'فروردین', m0: 100, m1: 88, m2: 76, m3: 64, m4: 52, m5: 40 },
    { cohort: 'اردیبهشت', m0: 100, m1: 90, m2: 78, m3: 66, m4: 54, m5: 42 },
    { cohort: 'خرداد', m0: 100, m1: 92, m2: 80, m3: 68, m4: 56, m5: 44 },
    { cohort: 'تیر', m0: 100, m1: 94, m2: 82, m3: 70, m4: 58, m5: 46 },
    { cohort: 'مرداد', m0: 100, m1: 96, m2: 84, m3: 72, m4: 60, m5: 48 },
    { cohort: 'شهریور', m0: 100, m1: 98, m2: 86, m3: 74, m4: 62, m5: 50 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFM Scatter (Spec #15) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">RFM Segmentation (Spec #15)</h3>
          <div className="h-64 relative border border-white/10 rounded-lg p-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {rfmData.map((d, i) => (
                <circle
                  key={i}
                  cx={d.recency}
                  cy={100 - d.frequency * 5}
                  r={d.monetary / 10}
                  fill={
                    d.segment === 'Champions' ? '#00E5A0' :
                    d.segment === 'Loyal' ? '#00D4FF' :
                    d.segment === 'At Risk' ? '#FFB020' : '#8899AA'
                  }
                  opacity={0.6}
                />
              ))}
            </svg>
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00E5A0]" />Champions</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00D4FF]" />Loyal</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FFB020]" />At Risk</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#8899AA]" />Hibernating</div>
          </div>
        </div>

        {/* Cohort Heatmap (Spec #18) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Cohort Retention (Spec #18)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-right text-gray-400">Cohort</th>
                  {[0, 1, 2, 3, 4, 5].map(m => (
                    <th key={m} className="p-2 text-center text-gray-400">M{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.map((row, i) => (
                  <tr key={i}>
                    <td className="p-2 text-gray-300">{row.cohort}</td>
                    {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((value, j) => (
                      <td 
                        key={j} 
                        className="p-2 text-center text-white font-medium"
                        style={{ backgroundColor: `rgba(0, 212, 255, ${value / 100})` }}
                      >
                        {value}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PREDICTIVE DASHBOARD (Spec #20-24)
// ═══════════════════════════════════════════════════════════

function PredictiveDashboard() {
  const forecastData = Array.from({ length: 18 }, (_, i) => {
    const base = 100 + i * 8;
    const isForecast = i >= 12;
    return {
      month: i < 12 ? `M${i + 1}` : `F${i - 11}`,
      actual: isForecast ? null : base + (Math.random() - 0.5) * 10,
      forecast: isForecast ? base : null,
      upper: isForecast ? base * 1.15 : null,
      lower: isForecast ? base * 0.85 : null,
    };
  });

  const anomalyData = Array.from({ length: 30 }, (_, i) => {
    const base = 100;
    const isAnomaly = Math.random() < 0.1;
    return {
      day: i + 1,
      value: isAnomaly ? base + (Math.random() > 0.5 ? 40 : -40) : base + (Math.random() - 0.5) * 20,
      expected: base,
      isAnomaly,
    };
  });

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Forecast (Spec #20) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Revenue Forecast with CI (Spec #20)</h3>
          <div className="h-64 relative border border-white/10 rounded-lg p-4">
            <svg viewBox="0 0 180 100" className="w-full h-full" preserveAspectRatio="none">
              {/* Confidence interval */}
              <path
                d={`M ${forecastData.filter(d => d.forecast).map((d, i) => `${i * 10 + 120},${100 - d.upper! * 0.5}`).join(' L ')} 
                    L ${forecastData.filter(d => d.forecast).reverse().map((d, i) => `${(17 - i) * 10 + 120},${100 - d.lower! * 0.5}`).join(' L ')} Z`}
                fill="rgba(157, 107, 255, 0.2)"
              />
              {/* Actual line */}
              <path
                d={`M ${forecastData.filter(d => d.actual).map((d, i) => `${i * 10},${100 - d.actual! * 0.5}`).join(' L ')}`}
                fill="none"
                stroke="#00D4FF"
                strokeWidth="2"
              />
              {/* Forecast line */}
              <path
                d={`M ${forecastData.filter(d => d.forecast).map((d, i) => `${i * 10 + 120},${100 - d.forecast! * 0.5}`).join(' L ')}`}
                fill="none"
                stroke="#9D6BFF"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#00D4FF]" />Actual</div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#9D6BFF] border-dashed" />Forecast</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#9D6BFF]/20" />Confidence</div>
          </div>
        </div>

        {/* Anomaly Detection (Spec #22) */}
        <div className="bg-[#0a0f1f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Anomaly Detection (Spec #22)</h3>
          <div className="h-64 relative border border-white/10 rounded-lg p-4">
            <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
              {/* Expected line */}
              <line x1="0" y1="50" x2="300" y2="50" stroke="#8899AA" strokeWidth="1" strokeDasharray="5,5" />
              {/* Value line */}
              <path
                d={`M ${anomalyData.map((d, i) => `${i * 10},${100 - d.value * 0.5}`).join(' L ')}`}
                fill="none"
                stroke="#00D4FF"
                strokeWidth="2"
              />
              {/* Anomaly points */}
              {anomalyData.filter(d => d.isAnomaly).map((d, i) => (
                <circle
                  key={i}
                  cx={anomalyData.indexOf(d) * 10}
                  cy={100 - d.value * 0.5}
                  r="4"
                  fill="#FF4D6D"
                  stroke="#fff"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#00D4FF]" />Value</div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-[#8899AA] border-dashed" />Expected</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#FF4D6D] rounded-full" />Anomaly</div>
          </div>
        </div>
      </div>
    </div>
  );
}
