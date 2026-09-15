import { Server, TrendingUp, DollarSign, Users, GitBranch, Activity } from 'lucide-react';
import { dashboardMetrics, providers, migrations } from '../../data/admin-data';
import { toFaDigits, formatToman } from '../../lib/utils';

export function AdminDashboard() {
  const internalProviders = providers.filter(p => p.type === 'INTERNAL');
  const localProviders = providers.filter(p => p.type === 'LOCAL_EXTERNAL');
  const intlProviders = providers.filter(p => p.type === 'INTL_EXTERNAL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">داشبورد مدیریت</h1>
        <p className="text-gray-400 text-sm mt-1">نمای کلی زیرساخت سه‌گانه</p>
      </div>

      {/* Provider Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Internal Infrastructure */}
        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">زیرساخت داخلی</h3>
                <p className="text-xs text-gray-400">On-Premise</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {toFaDigits(dashboardMetrics.providerHealth.internal)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">ارائه‌دهندگان</span>
              <span className="text-white">{toFaDigits(internalProviders.length)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">منابع</span>
              <span className="text-white">{toFaDigits(internalProviders.reduce((sum, p) => sum + p.resourceCount, 0))}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">هزینه ماهانه</span>
              <span className="text-white">مالکیت داخلی</span>
            </div>
          </div>
        </div>

        {/* Local External */}
        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">خارجی داخلی</h3>
                <p className="text-xs text-gray-400">Local Datacenters</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {toFaDigits(dashboardMetrics.providerHealth.local)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">ارائه‌دهندگان</span>
              <span className="text-white">{toFaDigits(localProviders.length)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">منابع</span>
              <span className="text-white">{toFaDigits(localProviders.reduce((sum, p) => sum + p.resourceCount, 0))}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">هزینه ماهانه</span>
              <span className="text-white">{formatToman(500000000)}</span>
            </div>
          </div>
        </div>

        {/* International External */}
        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">بین‌الملل</h3>
                <p className="text-xs text-gray-400">International DCs</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {toFaDigits(dashboardMetrics.providerHealth.international)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">ارائه‌دهندگان</span>
              <span className="text-white">{toFaDigits(intlProviders.length)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">منابع</span>
              <span className="text-white">{toFaDigits(intlProviders.reduce((sum, p) => sum + p.resourceCount, 0))}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">هزینه ماهانه</span>
              <span className="text-white" dir="ltr">$16,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-400">منابع فعال</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {toFaDigits(dashboardMetrics.runningResources)}
            <span className="text-sm text-gray-400 mr-1">/ {toFaDigits(dashboardMetrics.totalResources)}</span>
          </div>
        </div>

        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400">مشتریان</span>
          </div>
          <div className="text-2xl font-bold text-white">{toFaDigits(dashboardMetrics.totalCustomers)}</div>
        </div>

        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-gray-400">سود ماهانه</span>
          </div>
          <div className="text-xl font-bold text-white">{formatToman(dashboardMetrics.profit)}</div>
        </div>

        <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">مهاجرت‌های فعال</span>
          </div>
          <div className="text-2xl font-bold text-white">{toFaDigits(dashboardMetrics.activeMigrations)}</div>
        </div>
      </div>

      {/* Active Migrations */}
      <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-bold text-white mb-4">مهاجرت‌های فعال</h2>
        <div className="space-y-3">
          {migrations.filter(m => m.status === 'IN_PROGRESS').map((migration) => (
            <div key={migration.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-white">{migration.resource.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {migration.fromProvider.name} → {migration.toProvider.name}
                  </div>
                </div>
                <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                  در حال انجام
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>پیشرفت</span>
                  <span>45%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-[#0a0f1f] rounded-xl border border-white/5 p-6">
        <h2 className="text-lg font-bold text-white mb-4">نمودار درآمد و هزینه</h2>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-sm">نمودار درآمد ماهانه (به زودی)</p>
        </div>
      </div>
    </div>
  );
}
