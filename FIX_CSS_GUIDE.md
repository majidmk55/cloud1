# 🔧 راهنمای رفع مشکل CSS - ABRAN System

## ❌ مشکل: صفحه شماتیک بدون استایل دیده می‌شود

اگر سایت بالا آمده اما CSS بارگذاری نمی‌شود (صفحه بدون استایل)، یکی از راه‌حل‌های زیر را امتحان کنید:

---

## ✅ راه‌حل ۱: استفاده از اسکریپت خودکار (سریع‌ترین)

```powershell
.\fix-css.ps1
```

این اسکریپت به صورت خودکار:
- سرور را متوقف می‌کند
- Cache Vite را پاک می‌کند
- پوشه dist را پاک می‌کند
- سرور را مجدداً راه‌اندازی می‌کند

---

## ✅ راه‌حل ۲: دستی (مرحله به مرحله)

### مرحله ۱: توقف سرور
در ترمینالی که سرور در حال اجرا است، **Ctrl+C** را فشار دهید.

### مرحله ۲: پاک کردن Cache Vite
```powershell
Remove-Item -Recurse -Force node_modules\.vite
```

### مرحله ۳: پاک کردن پوشه dist
```powershell
Remove-Item -Recurse -Force dist
```

### مرحله ۴: راه‌اندازی مجدد سرور
```powershell
npm run dev
```

### مرحله ۵: پاک کردن Cache مرورگر
در مرورگر:
- **Chrome/Edge**: `Ctrl+Shift+R` (Hard Reload)
- **Firefox**: `Ctrl+F5`
- یا: `F12` → راست‌کلیک روی دکمه Refresh → "Empty Cache and Hard Reload"

---

## ✅ راه‌حل ۳: نصب مجدد وابستگی‌ها

اگر راه‌حل‌های بالا کار نکرد:

```powershell
# توقف سرور
# Ctrl+C

# پاک کردن node_modules
Remove-Item -Recurse -Force node_modules

# پاک کردن package-lock.json
Remove-Item -Force package-lock.json

# نصب مجدد
npm install

# راه‌اندازی سرور
npm run dev
```

---

## ✅ راه‌حل ۴: بررسی فایل‌های کلیدی

### بررسی کنید که فایل‌های زیر درست هستند:

#### 1. `src/main.tsx` باید شامل این خط باشد:
```typescript
import "./index.css";
```

#### 2. `src/index.css` باید با این خط شروع شود:
```css
@import "tailwindcss";
```

#### 3. `vite.config.js` باید شامل این خطوط باشد:
```javascript
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // ...
});
```

---

## 🔍 عیب‌یابی پیشرفته

### بررسی کنید که CSS واقعاً تولید می‌شود:

```powershell
# Build پروژه
npm run build

# بررسی فایل CSS
Get-Content dist\assets\*.css | Select-Object -First 10
```

اگر فایل CSS خالی است یا شامل Tailwind نیست، مشکل از پیکربندی است.

### بررسی Console مرورگر:

1. `F12` را فشار دهید
2. به تب **Console** بروید
3. به دنبال خطاهای قرمز بگردید
4. به تب **Network** بروید
5. فیلتر را روی **CSS** قرار دهید
6. بررسی کنید که فایل CSS بارگذاری می‌شود و خالی نیست

---

## 📋 چک‌لیست عیب‌یابی

- [ ] سرور Vite در حال اجرا است؟
- [ ] فایل `src/index.css` وجود دارد؟
- [ ] فایل `src/index.css` با `@import "tailwindcss";` شروع می‌شود؟
- [ ] فایل `src/main.tsx` شامل `import "./index.css";` است؟
- [ ] فایل `vite.config.js` شامل `tailwindcss()` plugin است؟
- [ ] Cache Vite پاک شده است؟ (`node_modules/.vite`)
- [ ] Cache مرورگر پاک شده است؟ (Ctrl+Shift+R)
- [ ] در Console مرورگر خطای CSS وجود ندارد؟
- [ ] در Network tab فایل CSS بارگذاری شده است؟

---

## 🎯 سریع‌ترین راه‌حل

اگر عجله دارید، این دستورات را به ترتیب اجرا کنید:

```powershell
# 1. توقف سرور (Ctrl+C در ترمینال سرور)

# 2. پاک کردن cache
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# 3. راه‌اندازی مجدد
npm run dev

# 4. در مرورگر: Ctrl+Shift+R
```

---

## 💡 نکات مهم

### چرا CSS بارگذاری نمی‌شود؟

دلایل احتمالی:
1. **Cache Vite** - قدیمی شده و CSS جدید را نمی‌شناسد
2. **Cache مرورگر** - نسخه قدیمی CSS را cache کرده
3. **مشکل در node_modules** - وابستگی‌ها ناقص هستند
4. **مشکل در پیکربندی** - فایل‌های config اشتباه هستند

### چگونه مطمئن شویم CSS کار می‌کند؟

```powershell
# Build پروژه
npm run build

# بررسی اندازه فایل CSS
Get-ChildItem dist\assets\*.css | Select-Object Name, Length
```

اگر فایل CSS اندازه معقولی دارد (مثلاً 70KB+)، یعنی درست تولید شده است.

---

## 🆘 اگر هیچ‌کدام کار نکرد

### گزارش مشکل:

1. خروجی `npm run build` را کپی کنید
2. خروجی Console مرورگر (F12) را کپی کنید
3. لیست فایل‌های `dist/assets/` را ارسال کنید

### اطلاعات مفید:

```powershell
# نسخه Node.js
node --version

# نسخه npm
npm --version

# نسخه Vite
npm list vite

# نسخه Tailwind
npm list tailwindcss
```

---

## 🎉 اگر مشکل حل شد

تبریک! حالا سایت باید با استایل کامل نمایش داده شود.

### دستورات مفید:

```powershell
# توسعه
npm run dev

# Build برای production
npm run build

# پیش‌نمایش production
npm run preview
```

---

**آخرین بروزرسانی**: 2026-01-15
