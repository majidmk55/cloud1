import { useState } from 'react';
import { Power, GitBranch, Edit2, MoreVertical } from 'lucide-react';
import type { Resource, ProviderType } from '../../types/admin';
import { resources } from '../../data/admin-data';

const providerTypeLabels: Record<ProviderType, string> = {
  INTERNAL: 'داخلی',
  LOCAL_EXTERNAL: 'خارجی داخلی',
  INTL_EXTERNAL: 'خارجی بین‌الملل',
};

const providerTypeColors: Record<ProviderType, string> = {
  INTERNAL: 'bg-green-500/20 text-green-400 border-green-500/30',
  LOCAL_EXTERNAL: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  INTL_EXTERNAL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const statusColors: Record<string, string> = {
  RUNNING: 'bg-green-500',
  STOPPED: 'bg-gray-500',
  MIGRATING: 'bg-yellow-500 animate-pulse',
  ERROR: 'bg-red-500',
  PROVISIONING: 'bg-blue-500 animate-pulse',
};

export function ResourceTable() {
  const [filter, setFilter] = useState<'all' | ProviderType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resources.filter(r => {
    const matchesFilter = filter === 'all' || r.provider.type === filter;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.ipAddress?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#0a0f1f] rounded-xl border border-white/5 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="جستجوی نام یا IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Provider Type Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            همه
          </button>
          <button
            onClick={() => setFilter('INTERNAL')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'INTERNAL' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            داخلی
          </button>
          <button
            onClick={() => setFilter('LOCAL_EXTERNAL')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'LOCAL_EXTERNAL' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            خارجی داخلی
          </button>
          <button
            onClick={() => setFilter('INTL_EXTERNAL')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'INTL_EXTERNAL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            بین‌الملل
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">نام</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">نوع ارائه‌دهنده</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">وضعیت</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">مشخصات</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">هزینه/ساعت</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredResources.map((resource) => (
              <ResourceRow key={resource.id} resource={resource} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          نمایش {filteredResources.length} از {resources.length} منبع
        </div>
      </div>
    </div>
  );
}

function ResourceRow({ resource }: { resource: Resource }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="hover:bg-white/5 transition-colors">
      {/* Name + IP */}
      <td className="px-4 py-3">
        <div>
          <div className="text-sm font-medium text-white">{resource.name}</div>
          {resource.ipAddress && (
            <div className="text-xs text-gray-400 font-mono" dir="ltr">{resource.ipAddress}</div>
          )}
        </div>
      </td>

      {/* Provider Type Badge */}
      <td className="px-4 py-3">
        <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${providerTypeColors[resource.provider.type]}`}>
          {providerTypeLabels[resource.provider.type]}
        </span>
        <div className="text-xs text-gray-400 mt-1">{resource.provider.name}</div>
      </td>

      {/* Status Toggle */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[resource.status]}`}></div>
          <span className="text-xs text-gray-300">
            {resource.status === 'RUNNING' ? 'در حال اجرا' :
             resource.status === 'STOPPED' ? 'متوقف' :
             resource.status === 'MIGRATING' ? 'در حال مهاجرت' :
             resource.status === 'ERROR' ? 'خطا' : 'در حال آماده‌سازی'}
          </span>
        </div>
      </td>

      {/* Specs */}
      <td className="px-4 py-3">
        <div className="text-xs text-gray-300 space-y-1">
          {resource.specs.cpu && <div>CPU: {resource.specs.cpu} cores</div>}
          {resource.specs.ram && <div>RAM: {(resource.specs.ram / 1024).toFixed(1)} GB</div>}
          {resource.specs.disk && <div>Disk: {resource.specs.disk} GB</div>}
          {resource.specs.gpu && <div>GPU: {resource.specs.gpu}</div>}
        </div>
      </td>

      {/* Cost */}
      <td className="px-4 py-3">
        <div className="text-sm text-white">
          {resource.costPerHour > 0 ? (
            <>
              <span dir="ltr">${resource.costPerHour.toFixed(3)}</span>
              <span className="text-xs text-gray-400 mr-1">/ساعت</span>
            </>
          ) : (
            <span className="text-green-400 text-xs">مالکیت داخلی</span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="روشن/خاموش">
            <Power className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="مهاجرت">
            <GitBranch className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="ویرایش">
            <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute left-0 top-full mt-1 w-40 bg-[#0a0f1f] border border-white/10 rounded-lg shadow-xl z-10">
                <button className="w-full px-3 py-2 text-right text-xs text-gray-300 hover:bg-white/5">
                  مشاهده لاگ‌ها
                </button>
                <button className="w-full px-3 py-2 text-right text-xs text-gray-300 hover:bg-white/5">
                  تنظیمات شبکه
                </button>
                <button className="w-full px-3 py-2 text-right text-xs text-red-400 hover:bg-white/5">
                  حذف منبع
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
