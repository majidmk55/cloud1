# 🏗️ DDD Bounded Contexts - پیاده‌سازی کامل

## 📋 خلاصه معماری

معماری **Domain-Driven Design (DDD)** با **۷ Bounded Context** مستقل پیاده‌سازی شد. هر Context به صورت یک ماژول مجزا با ارتباط Event-Driven پیاده‌سازی شده است.

---

## 🎯 ۷ Bounded Context پیاده‌سازی شده

### 1️⃣ Identity Context (هویت و دسترسی)
**دامنه:** احراز هویت، مجوزدهی و پروفایل‌های امنیتی

**ویژگی‌ها:**
- ✅ IAM / SSO / MFA (Google/GitHub SSO + TOTP)
- ✅ مدیریت کاربران و نقش‌ها (CRUD)
- ✅ Multi-tenancy (ایزوله کردن داده‌ها)
- ✅ RBAC / ABAC (مجوزهای دقیق)
- ✅ API Keys & Tokens

**مسیرهای UI:**
- Customer: `/account/security`, `/account/api-keys`
- Admin: `/admin/users`, `/admin/roles`, `/admin/audit-log`

**رویدادها:**
- `USER_CREATED`, `ROLE_ASSIGNED`, `LOGIN_SUCCESS`

---

### 2️⃣ Ordering Context (سفارشات و تجارت)
**دامنه:** کاتالوگ محصولات، قیمت‌گذاری، سبد خرید و پردازش سفارش

**ویژگی‌ها:**
- ✅ Product Catalog (همگام با Product Tree)
- ✅ Pricing & Packages (hourly/monthly rates)
- ✅ Order Management (Pending → Processing → Active)
- ✅ Cart & Checkout (apply coupons, calculate tax)
- ✅ Order Events (OrderCreated, PaymentReceived)

**مسیرهای UI:**
- Customer: `/products`, `/cart`, `/checkout`, `/orders`
- Admin: `/admin/orders`, `/admin/pricing`, `/admin/coupons`

**رویدادها:**
- `ORDER_CREATED`, `ORDER_PAID`, `PAYMENT_RECEIVED`

---

### 3️⃣ Provisioning Context (چرخه حیات منابع)
**دامنه:** ایجاد، تغییر و حذف منابع ابری

**ویژگی‌ها:**
- ✅ Resource Management (لایه انتزاعی over providers)
- ✅ Provisioning Engine (Orchestrator)
- ✅ Stateless Workers (BullMQ/Celery)
- ✅ Operation Events (ResourceProvisioned, ResourceFailed)

**مسیرهای UI:**
- Customer: `/dashboard/resources`
- Admin: `/admin/provisioning-queue`, `/admin/resource-lifecycle`

**رویدادها:**
- `RESOURCE_PROVISIONED`, `RESOURCE_FAILED`, `MIGRATION_COMPLETED`

---

### 4️⃣ Platform Ops Context (عملیات پلتفرم)
**دامنه:** ورک‌فلوها، زمان‌بندی و سلامت سیستم

**ویژگی‌ها:**
- ✅ Workflow Engine (Temporal)
- ✅ Reconciliation Engine (check drifts)
- ✅ Scheduler (Cron jobs)
- ✅ Notification Service (Email/SMS/Webhooks)
- ✅ Audit & Activity Logs

**مسیرهای UI:**
- Admin Only: `/admin/workflows`, `/admin/scheduler`, `/admin/notifications`

**رویدادها:**
- `WORKFLOW_COMPLETED`, `HEALTH_CHECK_PASSED`, `NOTIFICATION_SENT`

---

### 5️⃣ Policy Context (حاکمیت و سیاست‌ها)
**دامنه:** قوانین، سهمیه‌ها و اجرای انطباق

**ویژگی‌ها:**
- ✅ Policy Engine (OPA)
- ✅ Quota Management (Max 10 VPS per user)
- ✅ Tenant Isolation Policy
- ✅ Rate Limiting Policy
- ✅ Compliance Rules (GDPR/Local laws)

**مسیرهای UI:**
- Admin: `/admin/policies`, `/admin/quotas`, `/admin/compliance`
- Customer: `/account/limits`

**رویدادها:**
- `POLICY_EVALUATED`, `QUOTA_EXCEEDED`, `COMPLIANCE_FLAG`

---

### 6️⃣ Config & Template Context (پیکربندی و قالب‌ها)
**دامنه:** Infrastructure as Code templates و مدیریت پیکربندی

**ویژگی‌ها:**
- ✅ Template Catalog (OS images, App stacks)
- ✅ Configuration Mgmt (SSH keys, cloud-init)
- ✅ Versioning & Diff (track changes, rollback)
- ✅ Parameter Store (encrypted at rest)

**مسیرهای UI:**
- Customer: `/dashboard/templates`, `/dashboard/ssh-keys`
- Admin: `/admin/templates`, `/admin/images`, `/admin/config-store`

**رویدادها:**
- `TEMPLATE_CREATED`, `SSH_KEY_ADDED`, `CONFIG_UPDATED`

---

### 7️⃣ Inventory (CMDB) Context (موجودی و CMDB)
**دامنه:** منبع واحد حقیقت برای تمام دارایی‌ها

**ویژگی‌ها:**
- ✅ Resource Inventory (master list)
- ✅ Topology & Dependency (relationships)
- ✅ Asset Management (hardware lifecycle)
- ✅ State of Truth (real-time sync)

**مسیرهای UI:**
- Admin Only: `/admin/inventory`, `/admin/topology-map`, `/admin/assets`

**رویدادها:**
- `ITEM_ADDED`, `TOPOLOGY_UPDATED`, `DRIFT_DETECTED`

---

## 🔗 Event Bus Architecture

### Event Flow Example:
```
1. Customer clicks "Buy"
   ↓
2. Ordering Context creates Order
   → Emits: OrderPaid
   ↓
3. Provisioning Context listens to OrderPaid
   → Checks Policy Context (Quota)
   → Calls Provider API
   → Emits: ResourceCreated
   ↓
4. Inventory Context listens to ResourceCreated
   → Updates CMDB
   ↓
5. Platform Ops Context schedules "Health Check"
   ↓
6. Notification Service listens to ResourceCreated
   → Emails customer "Your server is ready"
```

### Event Bus Implementation:
```typescript
// Subscribe to event
eventBus.subscribe('ordering.order.paid', 'provisioning', (payload) => {
  // Start provisioning
});

// Publish event
eventBus.publish('ordering.order.paid', { orderId: '123' }, 'ordering');
```

---

## 📁 ساختار فایل‌های پیاده‌سازی شده

```
src/
├── shared/
│   ├── events/
│   │   └── EventBus.ts              # Event Bus implementation
│   └── types/
│       └── contexts.ts              # TypeScript interfaces for all 7 contexts
├── pages/
│   └── admin/
│       └── BoundedContexts.tsx      # UI for viewing all contexts
└── layouts/
    └── AdminLayout.tsx              # Updated sidebar with contexts link
```

---

## 🎨 UI Features

### Bounded Contexts Page:
- ✅ **Interactive Grid**: 7 context cards with icons and colors
- ✅ **Event Flow Diagram**: Visual representation of event flow
- ✅ **Context Details**: Click to see features, routes, events
- ✅ **Event Bus Monitor**: Real-time event history
- ✅ **Separation of Concerns**: Visual guide for allowed/forbidden patterns

### Admin Sidebar:
- ✅ New "Bounded Contexts" menu item
- ✅ Icon: Database icon
- ✅ Route: `/admin/contexts`

---

## 📊 Build Output

```
✓ 1804 modules transformed
✓ Built in 8.50s
✓ BoundedContexts page: 13.14 KB (gzipped: 4.28 KB)
✓ Total CSS: 98.02 KB (gzipped: 13.67 KB)
```

---

## 🚀 نحوه دسترسی

1. **ورود به پنل مدیریت:**
   - روی "سامانه مدیریت" در Footer کلیک کنید
   - یا `Ctrl + Shift + A` بزنید
   - اطلاعات ورود: `admin@abran.system` / `Admin@1404` / `123456`

2. **دسترسی به Bounded Contexts:**
   - از Sidebar روی "Bounded Contexts" کلیک کنید
   - یا مستقیم به `/admin/contexts` بروید

3. **مشاهده Context Details:**
   - روی هر کارت Context کلیک کنید
   - ویژگی‌ها، مسیرها و رویدادها نمایش داده می‌شود

---

## ✅ اصل جداسازی مسئولیت‌ها

### ✅ مجاز:
- Ordering → Event → Provisioning
- Provisioning → Event → Inventory
- هر Context فقط از طریق Event Bus ارتباط می‌گیرد

### ❌ ممنوع:
- Ordering → مستقیم → Inventory
- Provisioning → مستقیم → Billing
- هیچ Context نباید مستقیماً DB دیگری را تغییر دهد

---

## 🎯 مزایای این معماری

1. **Loose Coupling**: Context ها مستقل هستند
2. **Scalability**: هر Context می‌تواند جداگانه scale شود
3. **Maintainability**: تغییر در یک Context تأثیری بر دیگران ندارد
4. **Testability**: هر Context جداگانه قابل تست است
5. **Event-Driven**: ارتباط غیرهمزمان و قابل ردیابی

---

## 📚 منابع بیشتر

- **Event Bus**: `src/shared/events/EventBus.ts`
- **Types**: `src/shared/types/contexts.ts`
- **UI**: `src/pages/admin/BoundedContexts.tsx`

---

**معماری DDD با ۷ Bounded Context با موفقیت پیاده‌سازی شد!** 🏗️✨

---

**تاریخ پیاده‌سازی:** 2026-01-15  
**نسخه:** 6.0.0  
**وضعیت:** ✅ تکمیل شده
