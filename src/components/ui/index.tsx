import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

// ==================== Button ====================
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-lg shadow-blue-500/20',
      secondary: 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-700',
      outline: 'bg-transparent text-gray-300 hover:bg-white/5 border border-white/10',
      ghost: 'bg-transparent text-gray-300 hover:bg-white/5 border border-transparent',
      destructive: 'bg-red-600 text-white hover:bg-red-700 border border-red-600 shadow-lg shadow-red-500/20',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-10 px-4 text-sm rounded-lg gap-2',
      lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon && iconPosition === 'left' ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        <span>{children}</span>
        {icon && iconPosition === 'right' && !loading && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ==================== Card ====================
export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  hover?: boolean;
}

export function Card({ children, className, variant = 'default', hover = false }: CardProps) {
  const variants = {
    default: 'bg-gradient-to-br from-white/5 to-transparent border border-white/10',
    elevated: 'bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-xl shadow-black/20',
    outlined: 'bg-transparent border border-white/10',
    filled: 'bg-white/5 border border-white/10',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all duration-200',
        variants[variant],
        hover && 'hover:scale-[1.01] hover:border-white/20 hover:shadow-xl hover:shadow-black/20',
        className
      )}
    >
      {children}
    </div>
  );
}

// ==================== Input ====================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-10 px-3 bg-[#050816] border rounded-lg text-sm text-white placeholder:text-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',
              icon && 'pr-10',
              error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-white/10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ==================== Badge ====================
export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'owned' | 'partner' | 'european';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 text-gray-300 border-white/10',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    owned: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    partner: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    european: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// ==================== Alert ====================
export interface AlertProps {
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  icon?: ReactNode;
  className?: string;
}

export function Alert({ children, variant = 'info', title, icon, className }: AlertProps) {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
  };

  return (
    <div className={cn('rounded-xl border p-4', variants[variant], className)} role="alert">
      <div className="flex items-start gap-3">
        {icon && <div className="flex-shrink-0 mt-0.5">{icon}</div>}
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ==================== Skeleton ====================
export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'bg-white/5 animate-pulse',
        variants[variant],
        className
      )}
    />
  );
}

// ==================== LoadingSpinner ====================
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-blue-400', sizes[size])} />
    </div>
  );
}

// ==================== EmptyState ====================
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="text-5xl mb-4 opacity-50">{icon}</div>}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-md mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ==================== SourceLayerBadge ====================
export interface SourceLayerBadgeProps {
  layer: 'owned' | 'partner' | 'european';
  size?: 'sm' | 'md' | 'lg';
}

export function SourceLayerBadge({ layer, size = 'md' }: SourceLayerBadgeProps) {
  const config = {
    owned: { label: 'مالکیتی', labelEn: 'Owned', icon: '🏢', variant: 'owned' as const },
    partner: { label: 'شریک ایرانی', labelEn: 'Partner', icon: '🤝', variant: 'partner' as const },
    european: { label: 'اروپایی', labelEn: 'European', icon: '🌍', variant: 'european' as const },
  };

  const { label, icon, variant } = config[layer];

  return (
    <Badge variant={variant} size={size} className="gap-1.5">
      <span>{icon}</span>
      <span>{label}</span>
    </Badge>
  );
}

// ==================== VisibilityToggle ====================
type VisibilityValue = 'public' | 'hidden' | 'deprecated' | 'inviteOnly';

export interface VisibilityToggleProps {
  value: VisibilityValue;
  onChange: (value: VisibilityValue) => void;
}

export function VisibilityToggle({ value, onChange }: VisibilityToggleProps) {
  const options: { value: VisibilityValue; label: string; icon: string; variant: 'success' | 'warning' | 'error' | 'info' }[] = [
    { value: 'public', label: 'عمومی', icon: '🌐', variant: 'success' },
    { value: 'hidden', label: 'مخفی', icon: '👁️', variant: 'warning' },
    { value: 'deprecated', label: 'منسوخ', icon: '⚠️', variant: 'error' },
    { value: 'inviteOnly', label: 'دعوت', icon: '✉️', variant: 'info' },
  ];

  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
            value === option.value
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          )}
        >
          <span className="ml-1">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ==================== PowerControl ====================
export interface PowerControlProps {
  status: 'running' | 'stopped' | 'starting' | 'stopping';
  onStart?: () => void;
  onStop?: () => void;
  onReboot?: () => void;
}

export function PowerControl({ status, onStart, onStop, onReboot }: PowerControlProps) {
  const isTransitioning = status === 'starting' || status === 'stopping';

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={onStart}
        disabled={status === 'running' || isTransitioning}
        loading={status === 'starting'}
        className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
      >
        ▶ روشن
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onStop}
        disabled={status === 'stopped' || isTransitioning}
        loading={status === 'stopping'}
      >
        ■ خاموش
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReboot}
        disabled={isTransitioning}
      >
        ↻ راه‌اندازی
      </Button>
    </div>
  );
}

// ==================== ThemeToggle ====================
import { useTheme, useLanguage } from '../../providers';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 gap-1">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
          theme === 'light' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
        )}
      >
        ☀️ روشن
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
          theme === 'dark' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
        )}
      >
        🌙 تاریک
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
          theme === 'system' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
        )}
      >
        💻 سیستم
      </button>
    </div>
  );
}

// ==================== LanguageToggle ====================
export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 gap-1">
      <button
        onClick={() => setLanguage('fa')}
        className={cn(
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
          language === 'fa' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
        )}
      >
        فارسی
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={cn(
          'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
          language === 'en' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
        )}
      >
        English
      </button>
    </div>
  );
}
