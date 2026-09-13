import { Plug } from 'lucide-react';

export function ProviderAdapters() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <Plug className="w-10 h-10 text-amber-400" />
          آداپتورهای ارائه‌دهنده
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          رابط ProviderAdapter با سه پیاده‌سازی برای لایه‌های مختلف زیرساخت.
        </p>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">📐 رابط ProviderAdapter</h2>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`export interface ResourceRequest {
  product: Product;
  tenant: Tenant;
  location?: string;
  specs: {
    cpu: number;
    ram: number;      // GB
    storage: number;  // GB
    bandwidth?: number;
    os?: string;
  };
}

export interface ProvisionResult {
  resourceId: string;
  providerId: string;
  status: 'provisioning' | 'active' | 'failed';
  accessCredentials?: {
    ip: string;
    username: string;
    password?: string;
  };
  meta Record<string, any>;
}

export interface ResourceState {
  resourceId: string;
  status: 'active' | 'stopped' | 'suspended' | 'terminated';
  powerState: 'on' | 'off';
  metrics?: {
    cpu: number;
    ram: number;
    disk: number;
  };
  meta Record<string, any>;
}

export interface ProviderAdapter {
  provision(request: ResourceRequest): Promise<ProvisionResult>;
  deprovision(resourceId: string): Promise<void>;
  getState(resourceId: string): Promise<ResourceState>;
  powerOn(resourceId: string): Promise<void>;
  powerOff(resourceId: string): Promise<void>;
  reboot(resourceId: string): Promise<void>;
  reinstall(resourceId: string, template: string): Promise<void>;
}`}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">🔧 سه پیاده‌سازی</h2>

        <div className="layer-owned rounded-2xl border p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🏢</span>
            <div>
              <h3 className="text-emerald-400 font-bold text-lg">OwnedProviderAdapter</h3>
              <p className="text-xs text-gray-400">لایه ۱ — سرورهای مالکیتی ABRAN</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">Direct API calls to ABRAN's infrastructure. Full control, lowest latency, 100% revenue.</p>
        </div>

        <div className="layer-partner rounded-2xl border p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🤝</span>
            <div>
              <h3 className="text-amber-400 font-bold text-lg">IranianPartnerProviderAdapter</h3>
              <p className="text-xs text-gray-400">لایه ۲ — دیتاسنترهای همکار ایرانی</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">API calls to partner DC systems. Revenue sharing tracked automatically. Settlement calculated.</p>
        </div>

        <div className="layer-european rounded-2xl border p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🌍</span>
            <div>
              <h3 className="text-indigo-400 font-bold text-lg">EuropeanProviderAdapter</h3>
              <p className="text-xs text-gray-400">لایه ۳ — Hetzner, OVH, Leaseweb, DigitalOcean</p>
            </div>
          </div>
          <p className="text-sm text-gray-300">REST API calls to European providers. Fixed cost model with margin. No sanctions risk.</p>
        </div>
      </div>
    </div>
  );
}
