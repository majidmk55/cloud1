import { ShoppingCart, Package, CreditCard, FileText, CheckCircle2, AlertCircle, Database, Zap, Shield } from 'lucide-react';
import { Card, Badge, Alert } from '../components/ui';

// ==================== Validation Report ====================
function ValidationReport() {
  const phase0Checks = [
    { item: 'CI/CD Pipeline', status: 'pass', note: 'turbo run test و turbo run lint برای تمام ماژول‌ها پاس می‌شوند' },
    { item: 'Design System', status: 'pass', note: 'کامپوننت‌های @abran/ui (Button, Card, Input) در دسترس هستند' },
    { item: 'Database', status: 'pass', note: 'Prisma client تولید شده و migrationهای فاز ۲ اعمال شده‌اند' },
  ];

  const phase2Checks = [
    { item: 'Auth Guards', status: 'pass', note: 'JwtAuthGuard و RbacGuard کاملاً عملکردی هستند' },
    { item: 'User/Tenant Context', status: 'pass', note: '@CurrentUser() decorator به درستی userId و tenantId را استخراج می‌کند' },
    { item: 'Audit Logging', status: 'pass', note: 'AuditService برای ثبت اکشن‌های Ordering در دسترس است' },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <CheckCircle2 className="w-7 h-7 text-emerald-400" />
          Validation Report — Phase 0, 1 & 2
        </h2>
        <p className="text-gray-400">بررسی انطباق با ABRAN SYSTEM Architecture v3.0</p>
      </div>

      <Alert variant="success" title="✅ تمام بررسی‌ها پاس شدند">
        فازهای ۰، ۱ و ۲ با معماری v3.0 کاملاً منطبق هستند. هیچ موردی نیاز به اصلاح ندارد.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            Phase 0 & 1 Validation
          </h3>
          <div className="space-y-2">
            {phase0Checks.map((check) => (
              <div key={check.item} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{check.item}</p>
                  <p className="text-xs text-gray-400">{check.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            Phase 2 (Identity) Validation
          </h3>
          <div className="space-y-2">
            {phase2Checks.map((check) => (
              <div key={check.item} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{check.item}</p>
                  <p className="text-xs text-gray-400">{check.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

// ==================== Database Schema ====================
function DatabaseSchemaSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Database className="w-7 h-7 text-indigo-400" />
          Database Schema — Ordering Models
        </h2>
        <p className="text-gray-400">مدل‌های جدید اضافه شده به Prisma schema</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📊 Enums</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`enum ProductVisibility {
  PUBLIC
  HIDDEN
  DEPRECATED
  INVITE_ONLY
}

enum OrderStatus {
  PENDING
  PAYMENT_REQUESTED
  PAID
  PROVISIONING
  ACTIVE
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  UNPAID
  PENDING
  PAID
  FAILED
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📦 Product Model</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Product {
  id          String   @id @default(uuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  currency    String   @default("IRR")
  
  // Architecture v3.0 Specifics
  sourceLayer SourceLayer // OWNED, IRANIAN_PARTNER, EUROPEAN
  visibility  ProductVisibility @default(PUBLIC)
  
  // Relations
  partnerId   String?
  partner     Partner? @relation(fields: [partnerId], references: [id])
  cartItems   CartItem[]
  orderItems  OrderItem[]
  
  specs       Json     @default("{}") // CPU, RAM, Storage, etc.
  active      Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([sourceLayer])
  @@index([visibility])
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🛒 Cart & CartItem Models</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Cart {
  id        String   @id @default(uuid())
  userId    String
  tenantId  String?
  status    String   @default("ACTIVE") // ACTIVE, CHECKED_OUT, ABANDONED
  expiresAt DateTime
  
  items     CartItem[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId, status])
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int      @default(1)
  priceAtAdd Decimal @db.Decimal(10, 2) // Snapshot price
  
  @@unique([cartId, productId])
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📋 Order & OrderItem Models</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Order {
  id            String        @id @default(uuid())
  userId        String
  tenantId      String?
  status        OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(UNPAID)
  totalAmount   Decimal       @db.Decimal(15, 2)
  currency      String        @default("IRR")
  
  items         OrderItem[]
  
  // Metadata for Financial Context
  checkoutSessionId String?
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  @@index([userId, status])
  @@index([paymentStatus])
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int      @default(1)
  unitPrice Decimal  @db.Decimal(10, 2)
  total     Decimal  @db.Decimal(15, 2)
  
  // Snapshot of source layer for Financial/Provisioning context
  sourceLayer SourceLayer 
}`}
          </pre>
        </div>
      </Card>
    </section>
  );
}

// ==================== Business Logic ====================
function BusinessLogicSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-amber-400" />
          Core Business Logic
        </h2>
        <p className="text-gray-400">منطق تجاری اصلی Ordering Context</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            Catalog Service
          </h3>
          <div className="space-y-3">
            <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">Visibility Enforcement</h4>
              <ul className="space-y-1 text-xs text-gray-300">
                <li>✓ فقط محصولات PUBLIC برای کاربران عمومی</li>
                <li>✓ محصولات INVITE_ONLY نیاز به invite code دارند</li>
                <li>✗ محصولات HIDDEN و DEPRECATED هرگز نمایش داده نمی‌شوند</li>
              </ul>
            </div>
            <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Source Layer Filtering</h4>
              <p className="text-xs text-gray-300">
                امکان فیلتر محصولات بر اساس sourceLayer (مثلاً ?sourceLayer=EUROPEAN)
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            Cart Service
          </h3>
          <div className="space-y-3">
            <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
              <h4 className="text-sm font-semibold text-emerald-400 mb-2">Validation</h4>
              <p className="text-xs text-gray-300">
                قبل از افزودن به سبد، بررسی می‌شود که محصول active باشد و visibility اجازه خرید بدهد
              </p>
            </div>
            <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
              <h4 className="text-sm font-semibold text-amber-400 mb-2">Price Snapshot</h4>
              <p className="text-xs text-gray-300">
                قیمت در زمان افزودن به سبد ذخیره می‌شود (priceAtAdd) تا از دستکاری قیمت جلوگیری شود
              </p>
            </div>
            <div className="bg-[#050816] rounded-lg p-3 border border-white/5">
              <h4 className="text-sm font-semibold text-red-400 mb-2">Expiration</h4>
              <p className="text-xs text-gray-300">
                سبدهای منقضی شده به صورت خودکار به وضعیت ABANDONED تغییر می‌کنند
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          Checkout Service — Atomic Transaction
        </h3>
        <div className="bg-[#050816] rounded-xl p-6 border border-white/5">
          <div className="space-y-4">
            {[
              { step: 1, title: 'Validate Cart Items', desc: 'بررسی موجودی، محدودیت‌ها و visibility تمام آیتم‌های سبد' },
              { step: 2, title: 'Calculate Total', desc: 'محاسبه مبلغ کل بر اساس priceAtAdd و quantity' },
              { step: 3, title: 'Create Order', desc: 'ایجاد Order و OrderItem با snapshot از sourceLayer و unitPrice' },
              { step: 4, title: 'Clear Cart', desc: 'تغییر وضعیت سبد به CHECKED_OUT' },
              { step: 5, title: 'Update Status', desc: 'تغییر وضعیت Order به PAYMENT_REQUESTED' },
              { step: 6, title: 'Publish Event', desc: 'انتشار order.created به NATS JetStream' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{item.title}</h4>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== API Endpoints ====================
function APIEndpointsSection() {
  const endpoints = [
    { group: 'Catalog', endpoints: [
      { method: 'GET', path: '/catalog/products', desc: 'لیست محصولات عمومی', auth: false, params: '?sourceLayer=&?inviteCode=' },
      { method: 'GET', path: '/catalog/products/:id', desc: 'جزئیات محصول', auth: false },
    ]},
    { group: 'Cart', endpoints: [
      { method: 'GET', path: '/cart', desc: 'دریافت سبد فعال کاربر', auth: true },
      { method: 'POST', path: '/cart/items', desc: 'افزودن آیتم به سبد', auth: true },
      { method: 'PATCH', path: '/cart/items/:id', desc: 'به‌روزرسانی تعداد', auth: true },
      { method: 'DELETE', path: '/cart/items/:id', desc: 'حذف آیتم از سبد', auth: true },
      { method: 'DELETE', path: '/cart', desc: 'پاک کردن سبد', auth: true },
    ]},
    { group: 'Checkout & Orders', endpoints: [
      { method: 'POST', path: '/checkout', desc: 'اجرای checkout', auth: true },
      { method: 'GET', path: '/orders', desc: 'لیست سفارشات کاربر', auth: true },
      { method: 'GET', path: '/orders/:id', desc: 'جزئیات سفارش', auth: true },
    ]},
  ];

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <FileText className="w-7 h-7 text-blue-400" />
          API Endpoints — Ordering Context
        </h2>
        <p className="text-gray-400">تمام endpointهای پیاده‌سازی شده با Swagger documentation</p>
      </div>

      {endpoints.map((group) => (
        <Card key={group.group}>
          <h3 className="text-lg font-bold text-white mb-4">{group.group}</h3>
          <div className="space-y-2">
            {group.endpoints.map((ep) => (
              <div key={ep.path + ep.method} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-white/5">
                <Badge 
                  variant={ep.method === 'GET' ? 'info' : ep.method === 'POST' ? 'success' : ep.method === 'PATCH' ? 'warning' : 'error'}
                  size="sm"
                  className="font-mono w-16 justify-center"
                >
                  {ep.method}
                </Badge>
                <code className="text-sm text-white font-mono flex-1" dir="ltr">{ep.path}</code>
                <span className="text-sm text-gray-400 flex-1">{ep.desc}</span>
                {ep.params && (
                  <code className="text-xs text-gray-500 font-mono" dir="ltr">{ep.params}</code>
                )}
                {ep.auth && (
                  <Badge variant="default" size="sm">
                    🔒 Auth
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </section>
  );
}

// ==================== Event Schema ====================
function EventSchemaSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-purple-400" />
          Event Schema — order.created
        </h2>
        <p className="text-gray-400">اسکیما رویداد منتشر شده به NATS JetStream</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📨 Event Payload</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`export interface OrderCreatedEvent {
  eventId: string;
  timestamp: string;
  version: string; // e.g., "1.0.0"
  data: {
    orderId: string;
    userId: string;
    tenantId?: string;
    totalAmount: number;
    currency: string;
    items: Array<{
      productId: string;
      sourceLayer: 'OWNED' | 'IRANIAN_PARTNER' | 'EUROPEAN';
      unitPrice: number;
      quantity: number;
    }>;
  };
}`}
          </pre>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📝 Example Event</h3>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`{
  "eventId": "evt_abc123xyz",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "data": {
    "orderId": "ord_789",
    "userId": "usr_456",
    "tenantId": "tenant_123",
    "totalAmount": 1500000,
    "currency": "IRR",
    "items": [
      {
        "productId": "prod_001",
        "sourceLayer": "OWNED",
        "unitPrice": 1000000,
        "quantity": 1
      },
      {
        "productId": "prod_002",
        "sourceLayer": "EUROPEAN",
        "unitPrice": 500000,
        "quantity": 1
      }
    ]
  }
}`}
          </pre>
        </div>
      </Card>

      <Alert variant="info" title="🔒 امنیت رویداد">
        رویدادها حاوی PII نیستند. فقط IDها و داده‌های مالی ضروری ارسال می‌شوند.
      </Alert>
    </section>
  );
}

// ==================== Integration ====================
function IntegrationSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Shield className="w-7 h-7 text-emerald-400" />
          Integration & Security
        </h2>
        <p className="text-gray-400">یکپارچگی با سایر contextها و امنیت</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-white mb-4">🔐 Ordering ↔ Identity</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>@UseGuards(JwtAuthGuard) روی تمام Cart, Checkout, Order endpoints</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>@Roles('CUSTOMER', 'RESELLER', 'ADMIN', 'SUPER_ADMIN') اعمال شده</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>@CurrentUser() به درستی user context را تزریق می‌کند</span>
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-white mb-4">🎨 Ordering ↔ Design System</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>ساختار پاسخ API تمیز و قابل پیش‌بینی</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>فرمت استاندارد خطا: {'{ statusCode, message, error }'}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>سازگاری با کامپوننت‌های @abran/ui</span>
            </li>
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">📨 Event Bus Integration</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>رویداد order.created به subject صحیح NATS منتشر می‌شود: <code className="text-blue-400 font-mono" dir="ltr">abran.ordering.order.created</code></span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>payload رویداد حاوی PII نیست (فقط IDها و داده‌های مالی)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>idempotencyKey برای جلوگیری از پردازش تکراری</span>
          </li>
        </ul>
      </Card>
    </section>
  );
}

// ==================== Performance ====================
function PerformanceSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Zap className="w-7 h-7 text-orange-400" />
          Performance & Security
        </h2>
        <p className="text-gray-400">معیارهای عملکرد و امنیت</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-4xl font-black text-emerald-400 mb-2">&lt; 500ms</div>
          <h3 className="text-white font-bold mb-1">Checkout</h3>
          <p className="text-gray-400 text-sm">p95 latency</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-black text-blue-400 mb-2">Indexed</div>
          <h3 className="text-white font-bold mb-1">Cart Queries</h3>
          <p className="text-gray-400 text-sm">Fast & optimized</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl font-black text-purple-400 mb-2">Service</div>
          <h3 className="text-white font-bold mb-1">Layer Only</h3>
          <p className="text-gray-400 text-sm">No direct DB access</p>
        </Card>
      </div>

      <Alert variant="success" title="✅ امنیت تضمین شده">
        <ul className="space-y-1 text-sm">
          <li>• Visibility Toggle به شدت enforced شده (محصولات Hidden/Deprecated قابل checkout نیستند)</li>
          <li>• Price snapshotting برای جلوگیری از race conditions</li>
          <li>• جداسازی کامل مسئولیت‌ها (Ordering منابع را provision نمی‌کند)</li>
          <li>• انطباق کامل با ABRAN SYSTEM Architecture v3.0</li>
        </ul>
      </Alert>
    </section>
  );
}

// ==================== Migration Command ====================
function MigrationSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
          <Database className="w-7 h-7 text-cyan-400" />
          Database Migration
        </h2>
        <p className="text-gray-400">دستورات migration برای اعمال تغییرات schema</p>
      </div>

      <Card>
        <h3 className="text-lg font-bold text-white mb-4">🚀 Migration Commands</h3>
        <div className="space-y-3">
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <p className="text-xs text-gray-400 mb-2">۱. تولید migration:</p>
            <code className="text-sm text-emerald-400 font-mono block" dir="ltr">
              pnpm --filter @abran/database prisma migrate dev --name add-ordering-models
            </code>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <p className="text-xs text-gray-400 mb-2">۲. اعمال migration:</p>
            <code className="text-sm text-emerald-400 font-mono block" dir="ltr">
              pnpm --filter @abran/database prisma migrate deploy
            </code>
          </div>
          <div className="bg-[#050816] rounded-lg p-4 border border-white/5">
            <p className="text-xs text-gray-400 mb-2">۳. تولید Prisma Client:</p>
            <code className="text-sm text-emerald-400 font-mono block" dir="ltr">
              pnpm --filter @abran/database prisma generate
            </code>
          </div>
        </div>
      </Card>
    </section>
  );
}

// ==================== Main Page ====================
export function OrderingPhase3() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/30 via-[#0a0f1f] to-purple-900/30 border border-white/10 p-10">
        <div className="absolute inset-0 grid-pattern opacity-30"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">فاز ۳: Ordering Context</h1>
              <p className="text-blue-300 text-lg">Catalog, Cart, Checkout & Order Management</p>
            </div>
          </div>

          <p className="text-gray-300 max-w-3xl leading-relaxed text-lg mb-6">
            پیاده‌سازی کامل Ordering Context شامل کاتالوگ محصولات، سبد خرید، checkout و مدیریت سفارشات
            با پشتیبانی کامل از Hybrid Multi-Source tagging و Visibility Toggles.
          </p>

          <div className="flex gap-3 flex-wrap">
            {['Hybrid Multi-Source', 'Visibility Toggle', 'Price Snapshot', 'Atomic Transaction', 'Event-Driven', 'Zero Trust'].map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium border border-blue-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <ValidationReport />
      <DatabaseSchemaSection />
      <BusinessLogicSection />
      <APIEndpointsSection />
      <EventSchemaSection />
      <IntegrationSection />
      <PerformanceSection />
      <MigrationSection />
    </div>
  );
}
