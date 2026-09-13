import { Shield } from 'lucide-react';

export function RBAC() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <Shield className="w-10 h-10 text-emerald-400" />
          کنترل دسترسی (RBAC)
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          ماتریس مجوزها برای سه سطح مدیریتی: Super Admin، Admin و Operator.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 rounded-2xl border border-red-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-2xl">👑</div>
            <div>
              <h3 className="text-red-400 font-bold text-lg">Super Admin</h3>
              <p className="text-xs text-gray-400">دسترسی کامل</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ مدیریت کاربران ادمین</li>
            <li>✓ قراردادهای Revenue Sharing</li>
            <li>✓ تأیید Settlements</li>
            <li>✓ تنظیمات سیستم</li>
            <li>✓ Audit logs کامل</li>
            <li>✓ MFA اجباری</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-blue-900/5 rounded-2xl border border-blue-500/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">🔧</div>
            <div>
              <h3 className="text-blue-400 font-bold text-lg">Admin</h3>
              <p className="text-xs text-gray-400">عملیات روزانه</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ مدیریت سرویس‌ها</li>
            <li>✓ مدیریت کاتالوگ و قیمت</li>
            <li>✓ مدیریت سفارشات</li>
            <li>✓ مدیریت مشتریان</li>
            <li>✓ مشاهده Revenue Reports</li>
            <li className="text-red-400">✗ قراردادهای شراکت</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/20 rounded-2xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-700/50 flex items-center justify-center text-2xl">👁️</div>
            <div>
              <h3 className="text-gray-300 font-bold text-lg">Operator</h3>
              <p className="text-xs text-gray-400">فقط خواندن + تیکت</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ مانیتورینگ سرویس‌ها</li>
            <li>✓ مانیتورینگ ارائه‌دهندگان</li>
            <li>✓ مدیریت تیکت‌ها</li>
            <li>✓ ریست پسورد</li>
            <li>✓ نصب مجدد OS</li>
            <li className="text-red-400">✗ دسترسی مالی</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">📊 ماتریس مجوزها</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4 text-gray-400 font-medium">عملیات</th>
                <th className="text-center py-3 px-4 text-red-400 font-medium">Super Admin</th>
                <th className="text-center py-3 px-4 text-blue-400 font-medium">Admin</th>
                <th className="text-center py-3 px-4 text-gray-400 font-medium">Operator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { op: 'مدیریت کاربران ادمین', sa: true, a: false, o: false },
                { op: 'مدیریت قراردادهای شراکت', sa: true, a: false, o: false },
                { op: 'تأیید Settlements', sa: true, a: false, o: false },
                { op: 'مدیریت سرویس‌ها', sa: true, a: true, o: false },
                { op: 'مدیریت کاتالوگ', sa: true, a: true, o: false },
                { op: 'مشاهده Revenue Reports', sa: true, a: true, o: false },
                { op: 'مانیتورینگ سرویس‌ها', sa: true, a: true, o: true },
                { op: 'مدیریت تیکت‌ها', sa: true, a: true, o: true },
              ].map((row) => (
                <tr key={row.op} className="hover:bg-white/5">
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
    </div>
  );
}
