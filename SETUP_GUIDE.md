# 🚀 راهنمای نصب و راه‌اندازی ABRAN System

## شروع سریع (۳ مرحله)

```bash
# 1. کلون ریپازیتوری
git clone https://github.com/majidmk55/cloud1 abran-system
cd abran-system

# 2. نصب وابستگی‌ها
npm install

# 3. اجرای سرور
npm run dev
```

✅ سایت در آدرس **http://localhost:3000** در دسترس خواهد بود

---

## 📋 پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر نصب هستند:

| ابزار | نسخه حداقل | دستور بررسی |
|-------|-----------|-------------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | 2+ | `git --version` |

### نصب پیش‌نیازها

#### Windows (با winget)
```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

#### macOS (با Homebrew)
```bash
brew install node git
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

---

## 🔧 مراحل کامل نصب

### مرحله ۱: کلون ریپازیتوری
```bash
git clone https://github.com/majidmk55/cloud1 abran-system
cd abran-system
```

### مرحله ۲: نصب وابستگی‌ها
```bash
npm install
```
⏱️ این مرحله ممکن است ۱-۳ دقیقه طول بکشد

### مرحله ۳: اجرای سرور توسعه
```bash
npm run dev
```
✅ سرور در **http://localhost:3000** اجرا می‌شود

### مرحله ۴: Build برای Production (اختیاری)
```bash
npm run build
npm run preview
```
فایل‌های بهینه‌شده در پوشه `dist/` قرار می‌گیرند

---

## 📦 دستورات موجود

| دستور | توضیحات |
|-------|---------|
| `npm run dev` | 🚀 اجرای سرور توسعه |
| `npm run build` | 📦 Build برای production |
| `npm run typecheck` | 🔍 بررسی خطاهای TypeScript |
| `npm run preview` | 👁️ پیش‌نمایش build production |

---

## 🌐 آدرس‌های دسترسی

| محیط | آدرس | دستور |
|------|------|-------|
| **Development** | http://localhost:3000 | `npm run dev` |
| **Production Preview** | http://localhost:4173 | `npm run preview` |

---

## 🏗️ ساختار پروژه

```
abran-system/
├── src/
│   ├── components/      # کامپوننت‌های مشترک
│   ├── pages/           # صفحات اصلی سایت
│   ├── providers/       # Context providers
│   ├── utils/           # توابع کمکی
│   ├── App.tsx          # کامپوننت اصلی
│   ├── main.tsx         # نقطه ورود
│   └── index.css        # استایل‌های سراسری
├── index.html           # HTML اصلی
├── package.json         # وابستگی‌ها و اسکریپت‌ها
├── vite.config.js       # تنظیمات Vite
├── tsconfig.json        # تنظیمات TypeScript
└── README.md            # مستندات
```

---

## ⚠️ نکات مهم

✅ این پروژه از **Tailwind CSS v4** استفاده می‌کند  
✅ مدیر بسته **npm** است (نه pnpm یا yarn)  
✅ پورت پیش‌فرض **3000** است (در vite.config.js تنظیم شده)  
✅ فونت‌های **Vazirmatn** و **JetBrains Mono** از Google Fonts بارگذاری می‌شوند  
⚠️ اگر پورت 3000 اشغال است، Vite به صورت خودکار پورت بعدی را استفاده می‌کند

---

## 🐛 عیب‌یابی

### خطای `npm: command not found`
Node.js نصب نیست. از دستورهای بالا استفاده کنید.

### خطای `Port 3000 is already in use`
```bash
# پیدا کردن پروسس اشغال‌کننده
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# بستن پروسس
taskkill /PID [PID] /F        # Windows
kill -9 [PID]                 # macOS/Linux
```

### خطای `Cannot find module`
```bash
# پاک کردن node_modules و نصب مجدد
rm -rf node_modules package-lock.json
npm install
```

### CSS بارگذاری نمی‌شود
```bash
# پاک کردن cache Vite
rm -rf node_modules/.vite
npm run dev
```

---

## 📚 تکنولوژی‌های استفاده شده

- **React 18** - کتابخانه UI
- **TypeScript 5.7** - زبان برنامه‌نویسی
- **Vite 6.3** - Build tool
- **Tailwind CSS 4.1** - فریمورک CSS
- **React Router 6** - مسیریابی
- **Framer Motion** - انیمیشن‌ها
- **Lucide React** - آیکون‌ها
- **Recharts** - نمودارها
- **Supabase** - Backend as a Service

---

## 🔗 لینک‌های مفید

- **ریپازیتوری GitHub**: https://github.com/majidmk55/cloud1
- **مستندات React**: https://react.dev
- **مستندات Vite**: https://vitejs.dev
- **مستندات Tailwind CSS**: https://tailwindcss.com

---

## 📝 پشتیبانی

در صورت بروز مشکل:
1. ابتدا بخش عیب‌یابی را بررسی کنید
2. مطمئن شوید تمام پیش‌نیازها نصب هستند
3. `node_modules` را حذف و دوباره نصب کنید
4. Cache مرورگر را پاک کنید (Ctrl+Shift+R)

---

**ساخته شده با ❤️ برای ABRAN System**
