# 🚀 ابران سیستم - Landing Page

## 📋 نمای کلی

یک landing page مدرن، مینیمال و حرفه‌ای برای شرکت **ابران سیستم** - ارائه‌دهنده خدمات ابری و هوش مصنوعی.

## 🎨 ویژگی‌های طراحی

### پالت رنگی
- **پس‌زمینه اصلی:** گرادیانت آبی تیره (`#0a1628` → `#1a3a6c` → `#0d2137`)
- **رنگ تأکیدی:** فیروزه‌ای درخشان (`#00d4ff`)
- **رنگ دوم:** آبی روشن (`#4fc3f7`)
- **متن:** سفید (`#ffffff`) و خاکستری روشن (`#e0e0e0`)

### المان‌های بصری Hero Section

#### 1. ابر دیجیتال (Network Mesh Cloud)
- شبکه‌ای از نقاط متصل با خطوط نازک
- تشکیل شکل ابر از طریق الگوریتم پراکندگی
- انیمیشن حرکت ملایم نقاط
- اتصالات پویا بین نقاط نزدیک

#### 2. ذرات معلق (Particle Burst)
- ذرات دایره‌ای و مربعی شکل
- حرکت از پایین به بالا (مثل فواره داده)
- محو شدن تدریجی با افزایش ارتفاع
- سرعت‌ها و اندازه‌های متنوع

#### 3. Orb هوش مصنوعی (AI Orb)
- کره درخشان در مرکز ابر
- متن "AI" در مرکز orb
- حلقه‌های موج‌دار اطراف orb
- انیمیشن ضربان ملایم

### تکنولوژی‌های استفاده شده
- **React 18** + **TypeScript**
- **HTML5 Canvas** برای انیمیشن‌های پیچیده
- **Framer Motion** برای انیمیشن‌های UI
- **Tailwind CSS** برای استایل‌دهی
- **Lucide React** برای آیکون‌ها

## 📁 ساختار فایل‌ها

```
src/
├── components/
│   └── HeroBackground.tsx    # انیمیشن Canvas ابر دیجیتال
├── pages/
│   └── Landing.tsx            # صفحه Landing کامل
└── App.tsx                    # Routing به‌روزرسانی شده
```

## 🎯 بخش‌های صفحه

### 1. Navigation Bar
- لوگو و نام شرکت
- منوی ناوبری (خانه، خدمات، درباره ما، تماس با ما)
- دکمه CTA "شروع کنید"
- Sticky با backdrop blur

### 2. Hero Section (Full Viewport)
- عنوان اصلی: "ابران سیستم"
- زیرعنوان: "راهکارهای هوشمند ابری و هوش مصنوعی"
- توضیحات کوتاه
- دو دکمه CTA: "مشاوره رایگان" و "اطلاعات بیشتر"
- بک‌گراند انیمیشنی ابر دیجیتال

### 3. Services Section
- 4 کارت خدمات:
  - زیرساخت ابری
  - راهکارهای هوش مصنوعی
  - تحلیل داده
  - امنیت سایبری
- آیکون، عنوان و توضیحات
- افکت hover با درخشش فیروزه‌ای

### 4. Stats Section
- 4 شمارنده انیمیشنی:
  - 150+ پروژه موفق
  - 80+ مشتری راضی
  - 99.9% آپتایم سرویس
  - 25+ متخصص حرفه‌ای
- انیمیشن شمارش هنگام scroll

### 5. Contact Section
- فرم تماس (نام، ایمیل، پیام)
- اطلاعات تماس (تلفن، ایمیل، آدرس)
- ساعات کاری
- طراحی دو ستونه

### 6. Footer
- لوگو و توضیحات
- لینک‌های خدمات
- لینک‌های شرکت
- آیکون‌های شبکه‌های اجتماعی
- کپی‌رایت

## 🚀 نحوه اجرا

```bash
# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev

# دسترسی در مرورگر
http://localhost:3000
```

## 🎨 سفارشی‌سازی

### تغییر رنگ‌ها
در فایل `src/pages/Landing.tsx` و `src/components/HeroBackground.tsx`:
- رنگ اصلی: `#00d4ff` → رنگ دلخواه
- پس‌زمینه: `#0a1628` → رنگ دلخواه

### تغییر محتوای خدمات
در فایل `src/pages/Landing.tsx`، آرایه `services` را ویرایش کنید.

### تغییر آمار
در فایل `src/pages/Landing.tsx`، مقادیر `targets` را در `useEffect` تغییر دهید.

## 📱 Responsive Design

- **Mobile:** تک ستونه، منوی همبرگری
- **Tablet:** دو ستونه برای بخش‌ها
- **Desktop:** چهار ستونه برای خدمات، دو ستونه برای تماس

## ✨ انیمیشن‌ها

### Hero Background (Canvas)
- حرکت ملایم نقاط شبکه
- ایجاد و محو شدن ذرات
- ضربان orb مرکزی
- چرخش حلقه‌های موج‌دار

### UI Animations (Framer Motion)
- Fade-in هنگام scroll
- شمارش انیمیشنی آمار
- Hover effects روی کارت‌ها
- Smooth scroll بین بخش‌ها

## 🔧 بهینه‌سازی‌ها

- استفاده از `requestAnimationFrame` برای انیمیشن‌های Canvas
- Lazy loading برای کامپوننت‌ها
- بهینه‌سازی تعداد ذرات (max 100)
- استفاده از `will-change` برای انیمیشن‌های CSS
- کد splitting خودکار توسط Vite

## 📊 Performance

- **Build size:** ~19.75 KB (Landing page)
- **CSS:** ~89.30 KB (کل پروژه)
- **First paint:** < 1s
- **Animation FPS:** 60fps

## 🎓 نکات فنی

### Canvas Animation
```typescript
// ایجاد شبکه نقاط
const nodes: Node[] = [];
for (let i = 0; i < nodeCount; i++) {
  nodes.push({
    x: cloudCenterX + Math.cos(angle) * radius,
    y: cloudCenterY + Math.sin(angle) * radius * 0.6,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
  });
}
```

### Particle System
```typescript
// ایجاد ذرات جدید
const createParticle = () => {
  particles.push({
    x: startX,
    y: startY,
    vx: (Math.random() - 0.5) * 1,
    vy: -Math.random() * 2 - 1,
    life: 0,
    maxLife: Math.random() * 100 + 100,
  });
};
```

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 مجوز

این پروژه برای ابران سیستم ساخته شده است.

## 👥 تیم

طراحی و توسعه: Senior Product Design & AI Solutions Architecture Team

---

**ساخته شده با ❤️ برای ابران سیستم**
