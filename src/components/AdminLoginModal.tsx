import { useState } from 'react';
import { X, Shield, Lock, KeyRound, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (email === 'admin@abran.system' && password === 'Admin@1404' && mfaCode === '123456') {
        navigate('/admin');
      } else {
        setError('اطلاعات ورود نامعتبر است. لطفاً دوباره تلاش کنید.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-[#0a1628] border-2 border-red-500/50 rounded-xl max-w-md w-full shadow-2xl shadow-red-500/20">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">دسترسی مدیریت</h2>
              <p className="text-xs text-gray-400">Admin / OPS Plane</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Security Warning */}
        <div className="mx-6 mt-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-400 font-medium">هشدار امنیتی</p>
              <p className="text-xs text-gray-400 mt-1">
                دسترسی به شبکه ایزوله - فقط پرسنل مجاز
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Email/Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              ایمیل / نام کاربری
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="admin@abran.system"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              رمز عبور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* MFA Code */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              کد تأیید دو مرحله‌ای (MFA)
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors font-mono tracking-wider"
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              کد 6 رقمی از اپلیکیشن TOTP خود را وارد کنید
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                در حال احراز هویت...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                ورود به پنل مدیریت
              </>
            )}
          </button>

          {/* Demo Credentials */}
          <div className="pt-4 border-t border-white/5">
            <p className="text-xs text-gray-500 text-center mb-2">
              اطلاعات ورود نمایشی:
            </p>
            <div className="space-y-1 text-xs text-gray-400 font-mono" dir="ltr">
              <p>Email: admin@abran.system</p>
              <p>Password: Admin@1404</p>
              <p>MFA Code: 123456</p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>محافظت شده با mTLS و Zero Trust</span>
          </div>
        </div>
      </div>
    </div>
  );
}
