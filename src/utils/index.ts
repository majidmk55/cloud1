export function cn(...classes: (string | undefined | null | false | 0 | '')[]): string {
  return classes.filter(Boolean).join(' ');
}

export function isRTL(locale: string): boolean {
  return ['fa', 'ar', 'he', 'ur'].includes(locale);
}

export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}
