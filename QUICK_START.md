# 🚀 راهنمای سریع راه‌اندازی ABRAN System

## ✅ پیش‌نیازها آماده هستند!

حالا فقط **۳ مرحله ساده** تا راه‌اندازی سایت:

---

## 📋 مراحل راه‌اندازی

### مرحله ۱: کلون ریپازیتوری
```bash
git clone https://github.com/majidmk55/cloud1 abran-system
cd abran-system
```

### مرحله ۲: نصب وابستگی‌ها
```bash
npm install
```
⏱️ حدود ۱-۳ دقیقه طول می‌کشد

### مرحله ۳: اجرای سرور
```bash
npm run dev
```

✅ **سایت در آدرس http://localhost:3000 در دسترس است!**

---

## 🤖 یا با اسکریپت خودکار (یک دستور)

### Windows (PowerShell):
```powershell
.\setup.ps1
```

### Windows (CMD):
```cmd
setup.bat
```

### Linux / macOS:
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🌐 آدرس‌های دسترسی

| محیط | آدرس |
|------|------|
| **Development** | http://localhost:3000 |
| **Production Build** | `npm run build` → فایل‌ها در `dist/` |

---

## 📦 دستورات مفید

```bash
npm run dev          # اجرای سرور توسعه
npm run build        # Build برای production
npm run preview      # پیش‌نمایش build production
npm run typecheck    # بررسی خطاهای TypeScript
```

---

## 🎉 تمام!

سایت آماده استفاده است. مرورگر را باز کنید و به آدرس **http://localhost:3000** بروید.
