import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useState } from 'react';

// Card
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card p-6 ${className}`}>{children}</div>;
}

// Badge
export function Badge({ children, variant = 'default', size = 'md', className = '' }: {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warn' | 'danger' | 'info' | 'warning' | 'error' | 'owned' | 'partner' | 'european';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const colors: Record<string, string> = {
    default: 'bg-surface text-body border-border',
    success: 'bg-success-soft text-success',
    warn: 'bg-warn-soft text-warn',
    warning: 'bg-warn-soft text-warn',
    danger: 'bg-danger-soft text-danger',
    error: 'bg-danger-soft text-danger',
    info: 'bg-primary-soft text-primary',
    owned: 'bg-success-soft text-success',
    partner: 'bg-warn-soft text-warn',
    european: 'bg-primary-soft text-primary',
  };
  const sizes: Record<string, string> = { sm: 'text-[10px] px-2 py-0.5', md: 'text-xs px-3 py-1', lg: 'text-sm px-4 py-1.5' };
  return <span className={`inline-block rounded-full font-medium ${colors[variant] || colors.default} ${sizes[size] || sizes.md} ${className}`}>{children}</span>;
}

// Alert
export function Alert({ children, variant = 'info', title }: {
  children: ReactNode; variant?: 'success' | 'warn' | 'danger' | 'info'; title?: string;
}) {
  const colors = {
    success: 'bg-success-soft border-success/30 text-success',
    warn: 'bg-warn-soft border-warn/30 text-warn',
    danger: 'bg-danger-soft border-danger/30 text-danger',
    info: 'bg-primary-soft border-primary/30 text-primary',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[variant]}`}>
      {title && <div className="font-bold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}

// Button
export function Button({ children, variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
}) {
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'bg-transparent text-primary hover:bg-primary-soft',
    danger: 'bg-danger text-white hover:bg-danger/90',
  };
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Input
export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-ink placeholder:text-faint focus:outline-none focus:border-primary transition-colors ${className}`}
      {...props}
    />
  );
}

// Skeleton
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-surface rounded-lg ${className}`} />;
}

// LoadingSpinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`} />
  );
}

// EmptyState
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">📭</div>
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      {description && <p className="text-body text-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

// SourceLayerBadge
export function SourceLayerBadge({ layer }: { layer: 'owned' | 'partner' | 'european' }) {
  const colors = {
    owned: 'bg-success-soft text-success',
    partner: 'bg-warn-soft text-warn',
    european: 'bg-primary-soft text-primary',
  };
  const labels = { owned: 'اختصاصی', partner: 'شریک', european: 'اروپایی' };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[layer]}`}>{labels[layer]}</span>;
}

// VisibilityToggle
export function VisibilityToggle({ visible, onChange }: { visible: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!visible)}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        visible ? 'bg-success-soft text-success' : 'bg-surface text-muted'
      }`}
    >
      {visible ? 'نمایان' : 'مخفی'}
    </button>
  );
}

// PowerControl
export function PowerControl({ status, onToggle }: { status: 'on' | 'off'; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
        status === 'on' ? 'bg-success text-white' : 'bg-danger text-white'
      }`}
    >
      {status === 'on' ? '⏻ روشن' : '⏻ خاموش'}
    </button>
  );
}

// ThemeToggle
export function ThemeToggle() {
  return (
    <button className="p-2 rounded-lg hover:bg-surface transition-colors" aria-label="تغییر تم">
      🌙
    </button>
  );
}

// LanguageToggle
export function LanguageToggle() {
  return (
    <button className="p-2 rounded-lg hover:bg-surface transition-colors text-sm" aria-label="تغییر زبان">
      FA
    </button>
  );
}

// Error Boundary
import React from 'react';
export class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-8">
          <div className="card p-8 text-center max-w-md">
            <h1 className="text-2xl font-bold text-danger mb-4">خطای غیرمنتظره</h1>
            <p className="text-body mb-6">متأسفانه خطایی رخ داده است.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              تلاش مجدد
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
