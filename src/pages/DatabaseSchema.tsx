import { Database } from 'lucide-react';

export function DatabaseSchema() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-3">
          <Database className="w-10 h-10 text-indigo-400" />
          اسکیما پایگاه داده
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl">
          اسکیما کامل Prisma با تمام مدل‌ها شامل Partner, RevenueSplitContract, FinancialLedger, PartnerSettlement.
        </p>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">🏷️ Enums</h2>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
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

      <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6">
        <h2 className="text-lg font-bold text-white mb-4">📊 Models</h2>
        <div className="bg-[#050816] rounded-xl p-4 border border-white/5 overflow-x-auto">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed" dir="ltr">
{`model Partner {
  id                      String   @id @default(uuid())
  name                    String
  sourceLayer             SourceLayer
  revenueSharePercentage  Decimal
  settlementCycle         SettlementCycle
  apiConfig               Json
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
  serviceType             String
  abranSharePercentage    Decimal
  partnerSharePercentage  Decimal
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
  approvedBy    String?
  paidAt        DateTime?
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
