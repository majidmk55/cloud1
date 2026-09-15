// Convert English digits to Persian
export function toFaDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
}

// Format price in Toman with Persian separator
export function formatToman(price: number): string {
  return toFaDigits(price.toLocaleString('en-US').replace(/,/g, '٬')) + ' تومان';
}

// Format number with Persian separator
export function formatNumber(num: number): string {
  return toFaDigits(num.toLocaleString('en-US').replace(/,/g, '٬'));
}

// Format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت', 'ترابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return toFaDigits(parseFloat((bytes / Math.pow(k, i)).toFixed(2))) + ' ' + sizes[i];
}

// Format percentage
export function formatPercent(value: number): string {
  return toFaDigits(value.toFixed(1)) + '٪';
}

// Format BPS (bits per second)
export function formatBps(bps: number): string {
  if (bps >= 1e9) return toFaDigits((bps / 1e9).toFixed(1)) + ' Gbps';
  if (bps >= 1e6) return toFaDigits((bps / 1e6).toFixed(1)) + ' Mbps';
  if (bps >= 1e3) return toFaDigits((bps / 1e3).toFixed(1)) + ' Kbps';
  return toFaDigits(bps) + ' bps';
}

// Format date in Persian
export function faDate(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Format date short
export function faDateShort(date: Date): string {
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// VAT calculation (10% configurable)
export const VAT_RATE = 0.10;

export function calculateVAT(amount: number): number {
  return Math.round(amount * VAT_RATE);
}

export function addVAT(amount: number): number {
  return Math.round(amount * (1 + VAT_RATE));
}

export function removeVAT(amountWithVAT: number): number {
  return Math.round(amountWithVAT / (1 + VAT_RATE));
}

// CSV export with UTF-8 BOM for Excel Persian support
export function exportToCSV(data: string[][], filename: string): void {
  const BOM = '\uFEFF';
  const csv = BOM + data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// Print helper
export function printElement(elementId: string): void {
  const element = document.getElementById(elementId);
  if (!element) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`
    <html dir="rtl" lang="fa">
      <head>
        <title>چاپ</title>
        <style>
          body { font-family: 'Vazirmatn', sans-serif; padding: 20px; }
          @media print { @page { margin: 1cm; } }
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
