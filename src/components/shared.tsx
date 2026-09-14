import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { toFaDigits } from '../lib/utils';

// Motion presets
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Section Heading
export function SectionHeading({ badge, title, subtitle, center = true }: {
  badge?: string; title: string; subtitle?: string; center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : 'text-right'}`}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-black text-white mb-3">{title}</h2>
      {subtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

// Stat Counter with animation
export function StatCounter({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        {toFaDigits(count)}{suffix}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

// Service Card
export function ServiceCard({ icon, title, description, features }: {
  icon: ReactNode; title: string; description: string; features: string[];
}) {
  return (
    <motion.div variants={fadeUp} className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6 hover:border-blue-500/30 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Pricing Card
export function PricingCard({ name, price, period, features, highlighted = false, isYearly = false }: {
  name: string; price: number; period: string; features: string[]; highlighted?: boolean; isYearly?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-6 ${highlighted ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30 scale-105' : 'bg-[#0a0f1f] border-white/10'}`}>
      {highlighted && <div className="text-center mb-4"><span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">پیشنهاد ویژه</span></div>}
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-black text-white">{toFaDigits(price.toLocaleString('en-US').replace(/,/g, '٬'))}</span>
        <span className="text-gray-400 text-sm mr-1">تومان/{period}</span>
      </div>
      {isYearly && <div className="text-emerald-400 text-xs mb-4">۲ ماه رایگان</div>}
      <ul className="space-y-3 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-emerald-400">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold transition-all ${highlighted ? 'bg-gradient-to-l from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/20' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
        انتخاب پلن
      </button>
    </div>
  );
}

// FAQ Accordion
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-[#0a0f1f] rounded-xl border border-white/10 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-right"
            aria-expanded={open === i}
          >
            <span className="text-white font-medium">{item.q}</span>
            <span className={`text-gray-400 transition-transform ${open === i ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-3">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Code Block
export function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-[#050816] rounded-xl border border-white/10 overflow-hidden" dir="ltr">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
        <span className="text-xs text-gray-500">{language}</span>
        <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-white transition-colors">
          {copied ? '✓ کپی شد' : 'کپی'}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// CTA Banner
export function CtaBanner({ title, subtitle, buttonText, buttonLink }: {
  title: string; subtitle: string; buttonText: string; buttonLink: string;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl border border-white/10 p-8 md:p-12 text-center">
      <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-xl mx-auto">{subtitle}</p>
      <a href={buttonLink} className="inline-block px-8 py-3 rounded-xl bg-gradient-to-l from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/20 transition-all">
        {buttonText}
      </a>
    </div>
  );
}

// Testimonial Card
export function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="bg-[#0a0f1f] rounded-2xl border border-white/10 p-6">
      <p className="text-gray-300 text-sm leading-relaxed mb-4">«{text}»</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-white font-medium text-sm">{name}</div>
          <div className="text-gray-500 text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
}

// Scroll to top on route change
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
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
        <div className="min-h-screen bg-[#050816] flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-4xl font-black text-white mb-4">خطای غیرمنتظره</h1>
            <p className="text-gray-400 mb-6">متأسفانه خطایی رخ داده است.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold">
              تلاش مجدد
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
