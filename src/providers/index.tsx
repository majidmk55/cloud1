import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'system';
type Language = 'fa' | 'en';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fa: {
    'app.title': 'سیستم ابرانی آبران',
    'theme.light': 'روشن',
    'theme.dark': 'تاریک',
    'theme.system': 'سیستم',
    'language.fa': 'فارسی',
    'language.en': 'English',
    'button.primary': 'اصلی',
    'button.secondary': 'ثانویه',
    'button.outline': 'خطی',
    'button.ghost': 'شفاف',
    'button.destructive': 'مخرب',
    'button.loading': 'در حال بارگذاری...',
    'power.start': 'روشن',
    'power.stop': 'خاموش',
    'power.reboot': 'راه‌اندازی مجدد',
    'source.owned': 'مالکیتی',
    'source.partner': 'شریک ایرانی',
    'source.european': 'اروپایی',
    'visibility.public': 'عمومی',
    'visibility.hidden': 'مخفی',
    'visibility.deprecated': 'منسوخ',
    'visibility.inviteOnly': 'فقط دعوت',
  },
  en: {
    'app.title': 'ABRAN Cloud System',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'language.fa': 'فارسی',
    'language.en': 'English',
    'button.primary': 'Primary',
    'button.secondary': 'Secondary',
    'button.outline': 'Outline',
    'button.ghost': 'Ghost',
    'button.destructive': 'Destructive',
    'button.loading': 'Loading...',
    'power.start': 'Start',
    'power.stop': 'Stop',
    'power.reboot': 'Reboot',
    'source.owned': 'Owned',
    'source.partner': 'Iranian Partner',
    'source.european': 'European',
    'visibility.public': 'Public',
    'visibility.hidden': 'Hidden',
    'visibility.deprecated': 'Deprecated',
    'visibility.inviteOnly': 'Invite Only',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const resolveTheme = () => {
      if (theme === 'system') {
        const resolved = mediaQuery.matches ? 'dark' : 'light';
        setResolvedTheme(resolved);
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
      } else {
        setResolvedTheme(theme);
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      }
    };

    resolveTheme();
    mediaQuery.addEventListener('change', resolveTheme);
    return () => mediaQuery.removeEventListener('change', resolveTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fa');

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isRTL = language === 'fa';

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
