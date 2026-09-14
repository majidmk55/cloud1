import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

export function AdminBI() {
  const kpis = [
    { label: 'MRR', value: '۱۲۴,۵۰۰,۰۰۰', change: '+۱۲.۵٪', icon: DollarSign },
    { label: 'ARR', value: '۱,۴۹۴,۰۰۰,۰۰۰', change: '+۱۵.۲٪', icon: TrendingUp },
    { label: 'ARPU', value: '۹۹,۸۰۰', change: '+۳.۸٪', icon: Users },
    { label: 'Churn Rate', value: '۲.۱٪', change: '-۰.۵٪', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">هوش تجاری</h1>
        <p className="text-body text-sm mt-1">تحلیل عملکرد کسب‌وکار</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change.startsWith('+');
          return (
            <div key={i} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <Icon className="w-5 h-5 text-muted" />
                <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-danger'}`}>
                  {kpi.change}
                </span>
              </div>
              <div className="text-xs text-muted mb-1">{kpi.label}</div>
              <div className="text-xl font-bold text-ink">{kpi.value}</div>
              <div className="text-xs text-muted mt-1">تومان</div>
            </div>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h3 className="text-lg font-bold text-ink mb-4">درآمد ماهانه</h3>
          <div className="h-64 bg-sunken rounded-lg flex items-center justify-center">
            <p className="text-muted text-sm">نمودار درآمد (به زودی)</p>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="text-lg font-bold text-ink mb-4">توزیع سرویس‌ها</h3>
          <div className="h-64 bg-sunken rounded-lg flex items-center justify-center">
            <p className="text-muted text-sm">نمودار دایره‌ای (به زودی)</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-5">
        <h3 className="text-lg font-bold text-ink mb-4">فعالیت‌های اخیر</h3>
        <div className="space-y-3">
          {[
            { action: 'مشتری جدید', detail: 'شرکت فناوری نوین', time: '۱۰ دقیقه پیش' },
            { action: 'فاکتور پرداخت شد', detail: '۱۲,۵۰۰,۰۰۰ تومان', time: '۱ ساعت پیش' },
            { action: 'سرویس جدید', detail: 'سرور ابری ۸ هسته‌ای', time: '۳ ساعت پیش' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-sunken">
              <div>
                <div className="text-sm font-medium text-ink">{item.action}</div>
                <div className="text-xs text-muted">{item.detail}</div>
              </div>
              <div className="text-xs text-muted">{item.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
