// Convert English digits to Persian
export function toFaDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

// Format price with Persian thousands separator
export function formatPrice(price: number): string {
  return toFaDigits(price.toLocaleString('en-US').replace(/,/g, '٬'));
}

// Format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return toFaDigits(parseFloat((bytes / Math.pow(k, i)).toFixed(2))) + ' ' + sizes[i];
}

// Format number with Persian separator
export function formatNumber(num: number): string {
  return toFaDigits(num.toLocaleString('en-US').replace(/,/g, '٬'));
}
