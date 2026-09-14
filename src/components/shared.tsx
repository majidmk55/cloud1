import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { toFaDigits, formatToman } from '../lib/utils';

// Motion presets
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// Section Heading
export function SectionHeading({ badge, title, subtitle, center = true }: {
  badge?: string; title: string; subtitle?: string; center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? 'text-center' : 'text-right'}`}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-soft text-primary text-sm font-medium mb-4">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-black text-ink mb-3">{title}</h2>
      {subtitle && <p className="text-body text-lg max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  );
}

// Stat Counter
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
      <div className="text-4xl md:text-5xl font-black text-ink mb-2">
        {toFaDigits(count)}{suffix}
      </div>
      <div className="text-muted text-sm">{label}</div>
    </div>
  );
}

// Service Card
export function ServiceCard({ icon, title, description, features }: {
  icon: ReactNode; title: string; description: string; features: string[];
}) {
  return (
    <motion.div variants={fadeUp} className="card p-6 hover:shadow-lg transition-all group">
      <div className="w-12 h-12 rounded-xl bg-primary-soft flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
      <p className="text-body text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-body">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Pricing Card
export function PricingCard({ name, price, period, features, highlighted = false }: {
  name: string; price: number; period: string; features: string[]; highlighted?: boolean;
}) {
  return (
    <div className={`card p-6 ${highlighted ? 'ring-2 ring-primary scale-105' : ''}`}>
      {highlighted && (
        <div className="text-center mb-4">
          <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">پیشنهاد ما</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-ink mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-black text-ink">{toFaDigits(price.toLocaleString('en-US').replace(/,/g, '٬'))}</span>
        <span className="text-muted text-sm mr-1">تومان/{period}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-body">
            <span className="text-success">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold transition-all ${
        highlighted ? 'btn-primary' : 'btn-outline'
      }`}>
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
        <div key={i} className="card overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-right"
            aria-expanded={open === i}
          >
            <span className="text-ink font-medium">{item.q}</span>
            <span className={`text-muted transition-transform ${open === i ? 'rotate-180' : ''}`}>▼</span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-body text-sm leading-relaxed border-t border-border pt-3">
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
    <div className="card overflow-hidden" dir="ltr">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <span className="text-xs text-muted">{language}</span>
        <button onClick={handleCopy} className="text-xs text-muted hover:text-ink transition-colors">
          {copied ? '✓ کپی شد' : 'کپی'}
        </button>
      </div>
      <pre className="p-4 text-sm text-ink overflow-x-auto font-mono">
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
    <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-primary-soft to-accent-soft">
      <h2 className="text-2xl md:text-3xl font-black text-ink mb-3">{title}</h2>
      <p className="text-body mb-6 max-w-xl mx-auto">{subtitle}</p>
      <a href={buttonLink} className="btn-primary inline-block">
        {buttonText}
      </a>
    </div>
  );
}

// Testimonial Card
export function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="card p-6">
      <p className="text-body text-sm leading-relaxed mb-4">«{text}»</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-ink font-medium text-sm">{name}</div>
          <div className="text-muted text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
}

// Scroll to top
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
