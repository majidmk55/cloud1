export function RBAC() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🛡️</span> کنترل دسترسی (RBAC)
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          ماتریس مجوزها برای سه سطح مدیریتی: Super Admin، Admin و Operator. هر نقش دسترسی‌ها و محدودیت‌های مشخصی دارد.
        </p>
      </div>

      {/* Three Roles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 rounded-xl border border-red-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-2xl">
              👑
            </div>
            <div>
              <h3 className="text-red-400 font-bold">Super Admin</h3>
              <p className="text-xs text-gray-400">دسترسی کامل</p>
            </div>
          </div>
          <ul className="space-y-1.5 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مدیریت کاربران ادمین</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> قراردادهای Revenue Sharing</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> تأیید Settlements</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> تنظیمات سیستم</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Audit logs کامل</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> عملیات مخرب</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> MFA اجباری</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 rounded-xl border border-blue-500/30 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
              🔧
            </div>
            <div>
              <h3 className="text-blue-400 font-bold">Admin</h3>
              <p className="text-xs text-gray-400">عملیات روزانه</p>
            </div>
          </div>
          <ul className="space-y-1.5 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مدیریت سرویس‌ها</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مدیریت کاتالوگ و قیمت</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مدیریت سفارشات</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مدیریت مشتریان</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مشاهده Revenue Reports</li>
            <li className="flex items-start gap-2"><span className="text-red-400">✗</span> قراردادهای شراکت</li>
            <li className="flex items-start gap-2"><span className="text-red-400">✗</span> تنظیمات حساس</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/20 rounded-xl border border-gray-700 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-700/50 flex items-center justify-center text-2xl">
              👁️
            </div>
            <div>
              <h3 className="text-gray-300 font-bold">Operator</h3>
              <p className="text-xs text-gray-400">فقط خواندن + تیکت</p>
            </div>
          </div>
          <ul className="space-y-1.5 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مانیتورینگ سرویس‌ها</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مانیتورینگ ارائه‌دهندگان</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> مدیریت تیکت‌ها</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> ریست پسورد</li>
            <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> نصب مجدد OS</li>
            <li className="flex items-start gap-2"><span className="text-red-400">✗</span> دسترسی مالی</li>
            <li className="flex items-start gap-2"><span className="text-red-400">✗</span> تغییرات ساختاری</li>
          </ul>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📊 ماتریس مجوزها</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-right py-3 px-4 text-gray-400 font-medium">عملیات</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Super Admin</th>
                <th className="text-center py-3 px-4 text-blue-400 font-medium">Admin</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                { op: 'مدیریت کاربران ادمین', sa: true, a: false, o: false },
                { op: 'مدیریت قراردادهای شراکت', sa: true, a: false, o: false },
                { op: 'تأیید Settlements', sa: true, a: false, o: false },
                { op: 'تنظیمات سیستم', sa: true, a: false, o: false },
                { op: 'Audit logs کامل', sa: true, a: false, o: false },
                { op: 'مدیریت سرویس‌ها', sa: true, a: true, o: false },
                { op: 'مدیریت کاتالوگ', sa: true, a: true, o: false },
                { op: 'مدیریت قیمت‌گذاری', sa: true, a: true, o: false },
                { op: 'مدیریت سفارشات', sa: true, a: true, o: false },
                { op: 'مشاهده Revenue Reports', sa: true, a: true, o: false },
                { op: 'مانیتورینگ سرویس‌ها', sa: true, a: true, o: true },
                { op: 'مدیریت تیکت‌ها', sa: true, a: true, o: true },
                { op: 'ریست پسورد کاربر', sa: true, a: true, o: true },
                { op: 'نصب مجدد OS', sa: true, a: true, o: true },
              ].map((row) => (
                <tr key={row.op} className="hover:bg-gray-800/30">
                  <td className="py-2.5 px-4 text-gray-300">{row.op}</td>
                  <td className="py-2.5 px-4 text-center">
                    {row.sa ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {row.a ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {row.o ? <span className="text-emerald-400">✓</span> : <span className="text-red-400">✗</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Implementation */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">💻 پیاده‌سازی</h2>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`// modules/identity/src/permission-matrix.ts

export const PERMISSION_MATRIX = {
  SUPER_ADMIN: {
    // User Management
    'admin.users.create': true,
    'admin.users.update': true,
    'admin.users.delete': true,
    
    // Financial
    'financial.contracts.manage': true,
    'financial.settlements.approve': true,
    'financial.reports.view': true,
    
    // System
    'system.config.manage': true,
    'system.audit.view': true,
    
    // All other permissions
    '*': true,
  },
  
  ADMIN: {
    // Services
    'services.manage': true,
    'catalog.manage': true,
    'pricing.manage': true,
    'orders.manage': true,
    
    // Financial (read-only)
    'financial.reports.view': true,
    'financial.contracts.manage': false,
    'financial.settlements.approve': false,
    
    // Users
    'admin.users.manage': false,
    
    // System
    'system.config.manage': false,
    'system.audit.view': false,
  },
  
  OPERATOR: {
    // Monitoring
    'services.monitor': true,
    'providers.monitor': true,
    
    // Support
    'tickets.manage': true,
    'users.reset-password': true,
    'services.reinstall-os': true,
    
    // Restricted
    'services.manage': false,
    'financial.*': false,
    'system.*': false,
  },
};

// Guard implementation
@Injectable()
export class RbacGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler()
    );
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return PERMISSION_MATRIX[user.role][requiredPermission] === true;
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
