export function DatabaseSchema() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <span>🗄️</span> اسکیما پایگاه داده
        </h1>
        <p className="text-gray-400 mt-2 max-w-3xl">
          اسکیما کامل Prisma با تمام مدل‌ها شامل Partner, RevenueSplitContract, FinancialLedger, PartnerSettlement, Product با sourceLayer و visibility.
        </p>
      </div>

      {/* Enums */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🏷️ Enums</h2>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`enum SourceLayer {
  OWNED              // لایه ۱ - مالکیتی
  IRANIAN_PARTNER    // لایه ۲ - شرکای ایرانی
  EUROPEAN           // لایه ۳ - اروپایی
}

enum ProductVisibility {
  PUBLIC             // قابل مشاهده و خرید
  HIDDEN             // فقط با لینک مستقیم
  DEPRECATED         // بدون خرید جدید
  INVITE_ONLY        // فقط مشتریان دعوت‌شده
}

enum AdminRole {
  SUPER_ADMIN        // دسترسی کامل
  ADMIN              // عملیات روزانه
  OPERATOR           // فقط خواندن + تیکت
}

enum SettlementCycle {
  MONTHLY
  WEEKLY
  CUSTOM
}

enum PartnerStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum TransactionType {
  REVENUE
  COST
  SETTLEMENT
  COMMISSION
}

enum SettlementStatus {
  PENDING
  APPROVED
  PAID
}`}
          </pre>
        </div>
      </div>

      {/* Models */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">📊 Models</h2>
        <div className="bg-gray-950 rounded-lg p-4 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Partner {
  id                      String   @id @default(uuid())
  name                    String
  sourceLayer             SourceLayer
  revenueSharePercentage  Decimal  // e.g., 30.00
  settlementCycle         SettlementCycle
  apiConfig               Json     // API keys, endpoints
  status                  PartnerStatus
  contracts               RevenueSplitContract[]
  settlements             PartnerSettlement[]
  ledgerEntries           FinancialLedger[]
  products                Product[]
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}

model RevenueSplitContract {
  id                      String    @id @default(uuid())
  partnerId               String
  partner                 Partner     @relation(fields: [partnerId], references: [id])
  serviceType             String      // e.g., "vps", "dedicated"
  abranSharePercentage    Decimal     // e.g., 70.00
  partnerSharePercentage  Decimal     // e.g., 30.00
  effectiveFrom           DateTime
  effectiveTo             DateTime?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}

model Product {
  id            String            @id @default(uuid())
  name          String
  description   String?
  price         Decimal
  sourceLayer   SourceLayer
  visibility    ProductVisibility @default(PUBLIC)
  partnerId     String?
  partner       Partner?          @relation(fields: [partnerId], references: [id])
  orders        Order[]
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  @@index([sourceLayer])
  @@index([visibility])
}

model FinancialLedger {
  id                  String          @id @default(uuid())
  transactionType     TransactionType
  sourceLayer         SourceLayer
  partnerId           String?
  partner             Partner?        @relation(fields: [partnerId], references: [id])
  totalAmount         Decimal
  abranShare          Decimal
  partnerShare        Decimal
  resellerCommission  Decimal?
  orderId             String?
  createdAt           DateTime        @default(now())
  
  @@index([sourceLayer, createdAt])
  @@index([partnerId, createdAt])
}

model PartnerSettlement {
  id            String           @id @default(uuid())
  partnerId     String
  partner       Partner          @relation(fields: [partnerId], references: [id])
  periodStart   DateTime
  periodEnd     DateTime
  totalRevenue  Decimal
  partnerShare  Decimal
  status        SettlementStatus
  approvedBy    String?          // Super Admin ID
  paidAt        DateTime?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  
  @@index([partnerId, periodStart])
  @@index([status])
}

model Order {
  id            String   @id @default(uuid())
  userId        String
  productId     String
  product       Product  @relation(fields: [productId], references: [id])
  status        String
  totalAmount   Decimal
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  role      AdminRole @default(OPERATOR)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}`}
          </pre>
        </div>
      </div>

      {/* ER Diagram */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">🔗 نمودار ارتباطات</h2>
        <div className="bg-gray-950 rounded-lg p-6 border border-gray-700 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`
┌──────────────┐         ┌──────────────────────┐
│   Partner    │         │ RevenueSplitContract │
├──────────────┤         ├──────────────────────┤
│ id           │◄────────│ partnerId            │
│ name         │    1:N  │ serviceType          │
│ sourceLayer  │         │ abranSharePercentage │
│ revenueShare%│         │ partnerSharePercentage│
│ settlementCyc│         │ effectiveFrom/To     │
│ status       │         └──────────────────────┘
└──────┬───────┘
       │
       │ 1:N
       ▼
┌──────────────┐         ┌──────────────────┐
│  Product     │         │      Order       │
├──────────────┤         ├──────────────────┤
│ id           │◄────────│ productId        │
│ name         │    1:N  │ userId           │
│ price        │         │ status           │
│ sourceLayer  │         │ totalAmount      │
│ visibility   │         └──────────────────┘
│ partnerId    │
└──────────────┘
       │
       │ referenced by
       ▼
┌──────────────────┐     ┌──────────────────┐
│ FinancialLedger  │     │PartnerSettlement │
├──────────────────┤     ├──────────────────┤
│ transactionType  │     │ partnerId        │
│ sourceLayer      │     │ periodStart/End  │
│ partnerId        │     │ totalRevenue     │
│ totalAmount      │     │ partnerShare     │
│ abranShare       │     │ status           │
│ partnerShare     │     │ approvedBy       │
│ resellerCommission│    │ paidAt           │
└──────────────────┘     └──────────────────┘
`}
          </pre>
        </div>
      </div>
    </div>
  );
}
