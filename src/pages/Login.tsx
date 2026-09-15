import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Navigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

export function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (!success) {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-ink">پنل مدیریت</h1>
          <p className="text-body text-sm mt-2">ابران سیستم</p>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-danger-soft text-danger text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-ink mb-2">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@abran.system"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-bg text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3"
            >
              ورود
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 card p-4">
          <h3 className="text-sm font-bold text-ink mb-3">حساب‌های نمایشی:</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-sunken">
              <div>
                <div className="font-medium text-ink">مدیر کل (L1)</div>
                <div className="text-muted">admin@abran.system</div>
              </div>
              <code className="text-primary">Admin@1404</code>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-sunken">
              <div>
                <div className="font-medium text-ink">مدیر عملیات (L2)</div>
                <div className="text-muted">manager@abran.system</div>
              </div>
              <code className="text-primary">Manager@1404</code>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-sunken">
              <div>
                <div className="font-medium text-ink">مشاهده‌گر (L3)</div>
                <div className="text-muted">viewer@abran.system</div>
              </div>
              <code className="text-primary">Viewer@1404</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
