import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ABRAN ERROR BOUNDARY]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050816',
            color: '#e5e7eb',
            padding: '40px',
            fontFamily: "'Vazirmatn', sans-serif",
            direction: 'rtl',
            overflow: 'auto',
            zIndex: 999999,
          }}
        >
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              background: '#1f2937',
              borderRadius: '16px',
              padding: '32px',
              border: '2px solid #ef4444',
            }}
          >
            <h1 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '16px' }}>
              ❌ خطای اجرای برنامه
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
              یک خطا در اجرای برنامه رخ داده است. لطفاً اطلاعات زیر را ارسال کنید:
            </p>
            <div
              style={{
                background: '#050816',
                borderRadius: '8px',
                padding: '16px',
                direction: 'ltr',
                textAlign: 'left',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#f87171',
                whiteSpace: 'pre-wrap',
                overflow: 'auto',
                maxHeight: '400px',
              }}
            >
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.error?.stack}
            </div>
            <div style={{ marginTop: '24px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                🔄 تلاش مجدد
              </button>
            </div>
            <div style={{ marginTop: '16px', color: '#6b7280', fontSize: '12px' }}>
              <p>راه‌حل‌های احتمالی:</p>
              <ol style={{ paddingRight: '20px', lineHeight: '2' }}>
                <li>مرورگر را Hard Refresh کنید (Ctrl+Shift+R)</li>
                <li>Console مرورگر (F12) را بررسی کنید</li>
                <li>سرور را ری‌استارت کنید: Ctrl+C سپس npm run dev</li>
                <li>پوشه node_modules/.vite را حذف کنید</li>
              </ol>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
