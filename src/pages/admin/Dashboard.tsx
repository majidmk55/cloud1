import { useAuth } from '../../lib/auth';
import { TrendingUp, Users, Server, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'درآمد ماهانه', value: '۱۲۴,۵۰۰,۰۰۰', unit: 'تومان', icon: DollarSign, color: 'text-success', bg: 'bg-success-soft' },
    { label: 'مشتریان فعال', value: '۱,۲۴۸', unit: '', icon: Users, color: 'text-primary', bg: 'bg-primary-soft' },
    { label: 'سرویس‌های فعال', value: '۳,۴۵۶', unit: '', icon: Server, color: 'text-accent', bg: 'bg-accent-soft' },
    { label: 'رشد ماهانه', value: '۱۲.۵', unit: '٪', icon: TrendingUp, color: 'text-success', bg: 'bg-success-soft' },
  ];

  const alerts = [
    { type: 'warning', message: '۳ فاکتور overdue نیاز به پیگیری دارد', time: '۲ ساعت پیش' },
    { type: 'success', message: 'پرداخت ۱۲,۵۰۰,۰۰۰ تومان از شرکت دیجی‌کالا دریافت شد', time: '۵ ساعت پیش' },
    { type: 'info', message: 'سرور جدید در دیتاسنتر تهران ۲ فعال شد', time: '۱ روز پیش' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">داشبورد</h1>
        <p className="text-body text-sm mt-1">خوش آمدید، {user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-ink">
                {stat.value}
                {stat.unit && <span className="text-sm text-muted mr-1">{stat.unit}</span>}
              </div>
              <div className="text-sm text-muted mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink mb-4">اعلان‌های اخیر</h2>
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const Icon = alert.type === 'warning' ? AlertCircle : CheckCircle;
            const color = alert.type === 'warning' ? 'text-warn' : alert.type === 'success' ? 'text-success' : 'text-primary';
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-sunken">
                <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <div className="text-sm text-ink">{alert.message}</div>
                  <div className="text-xs text-muted mt-1">{alert.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="text-lg font-bold text-ink mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'مشتریان جدید', href: '/admin/customers' },
            { label: 'فاکتورها', href: '/admin/finance' },
            { label: 'گزارش‌ها', href: '/admin/reports' },
            { label: 'تنظیمات', href: '/admin/settings' },
          ].map((action, i) => (
            <a
              key={i}
              href={action.href}
              className="p-4 rounded-lg bg-sunken hover:bg-primary-soft transition-colors text-center"
            >
              <div className="text-sm font-medium text-ink">{action.label}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
