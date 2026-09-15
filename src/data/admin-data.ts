import type { Provider, Resource, Migration, Customer, AdminUser, DashboardMetrics, BalancingRule, AuditLog } from '../types/admin';

// ═══════════════════════════════════════════════════════════
// PROVIDERS (Tri-Partite Infrastructure)
// ═══════════════════════════════════════════════════════════
export const providers: Provider[] = [
  // Internal Infrastructure (On-Premise)
  {
    id: 'prov-001',
    name: 'Internal Rack A - Tehran DC1',
    type: 'INTERNAL',
    currency: 'IRR',
    isActive: true,
    location: 'تهران، دیتاسنتر ۱',
    contractStart: '2023-01-01',
    monthlyBudget: 500000000,
    resourceCount: 24,
    healthScore: 96,
  },
  {
    id: 'prov-002',
    name: 'Internal Rack B - Tehran DC2',
    type: 'INTERNAL',
    currency: 'IRR',
    isActive: true,
    location: 'تهران، دیتاسنتر ۲',
    contractStart: '2023-06-01',
    monthlyBudget: 750000000,
    resourceCount: 32,
    healthScore: 94,
  },
  
  // Local External Datacenters (Domestic)
  {
    id: 'prov-003',
    name: 'Pars Online - Tehran',
    type: 'LOCAL_EXTERNAL',
    currency: 'IRR',
    isActive: true,
    location: 'تهران، پارس آنلاین',
    contractStart: '2024-01-01',
    contractEnd: '2025-12-31',
    monthlyBudget: 300000000,
    resourceCount: 18,
    healthScore: 92,
  },
  {
    id: 'prov-004',
    name: 'AsiaTech - Isfahan',
    type: 'LOCAL_EXTERNAL',
    currency: 'IRR',
    isActive: true,
    location: 'اصفهان، آسیاتک',
    contractStart: '2024-03-01',
    contractEnd: '2025-02-28',
    monthlyBudget: 200000000,
    resourceCount: 12,
    healthScore: 89,
  },
  
  // International External Datacenters (Europe/Asia)
  {
    id: 'prov-005',
    name: 'Hetzner - Frankfurt',
    type: 'INTL_EXTERNAL',
    currency: 'EUR',
    isActive: true,
    location: 'Frankfurt, Germany',
    contractStart: '2024-01-01',
    monthlyBudget: 5000,
    resourceCount: 15,
    healthScore: 98,
  },
  {
    id: 'prov-006',
    name: 'DigitalOcean - Amsterdam',
    type: 'INTL_EXTERNAL',
    currency: 'USD',
    isActive: true,
    location: 'Amsterdam, Netherlands',
    contractStart: '2024-02-01',
    monthlyBudget: 3000,
    resourceCount: 10,
    healthScore: 97,
  },
  {
    id: 'prov-007',
    name: 'AWS - Singapore',
    type: 'INTL_EXTERNAL',
    currency: 'USD',
    isActive: true,
    location: 'Singapore, Asia',
    contractStart: '2024-01-15',
    monthlyBudget: 8000,
    resourceCount: 8,
    healthScore: 99,
  },
];

// ═══════════════════════════════════════════════════════════
// RESOURCES (Across all providers)
// ═══════════════════════════════════════════════════════════
export const resources: Resource[] = [
  // Internal Resources
  {
    id: 'res-001',
    providerId: 'prov-001',
    provider: providers[0],
    externalId: 'SRV-INT-001',
    name: 'Production Web Server 01',
    type: 'VPS',
    status: 'RUNNING',
    specs: { cpu: 8, ram: 16384, disk: 500, network: 10 },
    costPerHour: 0,
    retailPrice: 2500000,
    customerId: 'cust-001',
    marginPercent: 25,
    ipAddress: '192.168.1.101',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'res-002',
    providerId: 'prov-001',
    provider: providers[0],
    externalId: 'SRV-INT-002',
    name: 'Database Primary',
    type: 'DB',
    status: 'RUNNING',
    specs: { cpu: 16, ram: 65536, disk: 2000 },
    costPerHour: 0,
    retailPrice: 5000000,
    customerId: 'cust-001',
    marginPercent: 30,
    ipAddress: '192.168.1.102',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'res-003',
    providerId: 'prov-002',
    provider: providers[1],
    externalId: 'GPU-INT-001',
    name: 'AI Training Node 01',
    type: 'GPU',
    status: 'RUNNING',
    specs: { cpu: 32, ram: 131072, disk: 4000, gpu: 'NVIDIA A100', vram: 80, network: 25 },
    costPerHour: 0,
    retailPrice: 15000000,
    customerId: 'cust-002',
    marginPercent: 35,
    ipAddress: '192.168.2.201',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
  },
  
  // Local External Resources
  {
    id: 'res-004',
    providerId: 'prov-003',
    provider: providers[2],
    externalId: 'PO-VPS-1234',
    name: 'Staging Environment',
    type: 'VPS',
    status: 'RUNNING',
    specs: { cpu: 4, ram: 8192, disk: 200, network: 1 },
    costPerHour: 45000,
    retailPrice: 1200000,
    customerId: 'cust-003',
    marginPercent: 20,
    ipAddress: '10.0.1.50',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'res-005',
    providerId: 'prov-004',
    provider: providers[3],
    externalId: 'AT-STOR-567',
    name: 'Backup Storage 01',
    type: 'STORAGE',
    status: 'RUNNING',
    specs: { disk: 10000, network: 10 },
    costPerHour: 25000,
    retailPrice: 800000,
    customerId: 'cust-001',
    marginPercent: 15,
    ipAddress: '10.0.2.100',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  
  // International External Resources
  {
    id: 'res-006',
    providerId: 'prov-005',
    provider: providers[4],
    externalId: 'hetzner-cx31-891',
    name: 'EU Web Cluster Node 01',
    type: 'VPS',
    status: 'RUNNING',
    specs: { cpu: 4, ram: 8192, disk: 160, network: 20 },
    costPerHour: 0.045,
    retailPrice: 1800000,
    customerId: 'cust-004',
    marginPercent: 40,
    ipAddress: '88.99.123.45',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'res-007',
    providerId: 'prov-006',
    provider: providers[5],
    externalId: 'do-1892374',
    name: 'CDN Edge Node AMS',
    type: 'VPS',
    status: 'RUNNING',
    specs: { cpu: 2, ram: 4096, disk: 80, network: 1 },
    costPerHour: 0.024,
    retailPrice: 950000,
    customerId: 'cust-001',
    marginPercent: 45,
    ipAddress: '188.166.45.67',
    createdAt: '2024-02-10T10:00:00Z',
    updatedAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 'res-008',
    providerId: 'prov-007',
    provider: providers[6],
    externalId: 'i-0abc123def456',
    name: 'AI Inference Server SG',
    type: 'GPU',
    status: 'RUNNING',
    specs: { cpu: 16, ram: 65536, disk: 1000, gpu: 'NVIDIA A10G', vram: 24, network: 25 },
    costPerHour: 1.05,
    retailPrice: 25000000,
    customerId: 'cust-005',
    marginPercent: 50,
    ipAddress: '13.250.123.45',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
  },
  {
    id: 'res-009',
    providerId: 'prov-002',
    provider: providers[1],
    externalId: 'SRV-INT-015',
    name: 'Development Server',
    type: 'VPS',
    status: 'STOPPED',
    specs: { cpu: 4, ram: 8192, disk: 200 },
    costPerHour: 0,
    retailPrice: 1500000,
    customerId: 'cust-002',
    marginPercent: 25,
    ipAddress: '192.168.2.215',
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'res-010',
    providerId: 'prov-005',
    provider: providers[4],
    externalId: 'hetzner-cx51-445',
    name: 'EU Database Replica',
    type: 'DB',
    status: 'MIGRATING',
    specs: { cpu: 8, ram: 32768, disk: 1000, network: 20 },
    costPerHour: 0.089,
    retailPrice: 3500000,
    customerId: 'cust-004',
    marginPercent: 40,
    ipAddress: '88.99.234.56',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// MIGRATIONS
// ═══════════════════════════════════════════════════════════
export const migrations: Migration[] = [
  {
    id: 'mig-001',
    resourceId: 'res-010',
    resource: resources[9],
    fromProviderId: 'prov-001',
    fromProvider: providers[0],
    toProviderId: 'prov-005',
    toProvider: providers[4],
    status: 'IN_PROGRESS',
    initiatedBy: 'admin-001',
    startedAt: '2024-03-10T14:30:00Z',
    estimatedDowntime: 15,
    costEstimate: 45.50,
    logs: [
      '2024-03-10 14:30:00 - Migration initiated',
      '2024-03-10 14:30:05 - Pre-flight checks passed',
      '2024-03-10 14:30:10 - Block-level replication started',
      '2024-03-10 14:45:00 - Replication 45% complete',
    ],
  },
  {
    id: 'mig-002',
    resourceId: 'res-004',
    resource: resources[3],
    fromProviderId: 'prov-003',
    fromProvider: providers[2],
    toProviderId: 'prov-001',
    toProvider: providers[0],
    status: 'COMPLETED',
    initiatedBy: 'admin-001',
    startedAt: '2024-03-08T10:00:00Z',
    completedAt: '2024-03-08T10:25:00Z',
    estimatedDowntime: 10,
    actualDowntime: 8,
    costEstimate: 0,
    logs: [
      '2024-03-08 10:00:00 - Migration initiated',
      '2024-03-08 10:00:05 - Pre-flight checks passed',
      '2024-03-08 10:00:10 - Block-level replication started',
      '2024-03-08 10:20:00 - Replication complete',
      '2024-03-08 10:25:00 - DNS cut-over complete',
      '2024-03-08 10:25:00 - Migration completed successfully',
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════
export const customers: Customer[] = [
  {
    id: 'cust-001',
    name: 'شرکت دیجی‌کالا',
    email: 'tech@digikala.ir',
    phone: '021-4567-8900',
    company: 'Digikala',
    tier: 'enterprise',
    balance: 125000000,
    resourceCount: 8,
    createdAt: '2023-06-15T10:00:00Z',
  },
  {
    id: 'cust-002',
    name: 'استارتاپ هوشمند',
    email: 'info@hooshmand startup.ir',
    phone: '0912-345-6789',
    company: 'Hooshmand Startup',
    tier: 'gold',
    balance: 45000000,
    resourceCount: 3,
    createdAt: '2023-09-20T10:00:00Z',
  },
  {
    id: 'cust-003',
    name: 'فین‌تک پرداخت',
    email: 'support@fintech pay.ir',
    phone: '021-8765-4321',
    company: 'Fintech Pardakht',
    tier: 'silver',
    balance: 18000000,
    resourceCount: 2,
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'cust-004',
    name: 'EU Tech Solutions GmbH',
    email: 'admin@eutech.de',
    phone: '+49-30-1234-5678',
    company: 'EU Tech Solutions',
    tier: 'gold',
    balance: 2500,
    resourceCount: 4,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'cust-005',
    name: 'Asia AI Labs Pte Ltd',
    email: 'ops@asiaai.sg',
    phone: '+65-6789-0123',
    company: 'Asia AI Labs',
    tier: 'enterprise',
    balance: 8500,
    resourceCount: 2,
    createdAt: '2024-01-25T10:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// ADMIN USERS
// ═══════════════════════════════════════════════════════════
export const adminUsers: AdminUser[] = [
  {
    id: 'admin-001',
    email: 'admin@abran.system',
    level: 'L1_SUPER_ADMIN',
    mfaEnabled: true,
    allowedIps: ['192.168.1.0/24', '10.0.0.0/8'],
    isActive: true,
    lastLogin: '2024-03-10T14:00:00Z',
  },
  {
    id: 'admin-002',
    email: 'ops@abran.system',
    level: 'L2_OPS_ADMIN',
    mfaEnabled: true,
    allowedIps: ['192.168.1.0/24'],
    isActive: true,
    lastLogin: '2024-03-10T13:45:00Z',
  },
  {
    id: 'admin-003',
    email: 'viewer@abran.system',
    level: 'L3_VIEWER',
    mfaEnabled: false,
    allowedIps: ['192.168.1.0/24'],
    isActive: true,
    lastLogin: '2024-03-10T12:30:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// DASHBOARD METRICS
// ═══════════════════════════════════════════════════════════
export const dashboardMetrics: DashboardMetrics = {
  totalResources: 119,
  runningResources: 98,
  totalCustomers: 87,
  monthlyRevenue: 4500000000,
  monthlyCost: 2800000000,
  profit: 1700000000,
  activeMigrations: 1,
  providerHealth: {
    internal: 95,
    local: 90,
    international: 98,
  },
};

// ═══════════════════════════════════════════════════════════
// AUTO-BALANCING RULES
// ═══════════════════════════════════════════════════════════
export const balancingRules: BalancingRule[] = [
  {
    id: 'rule-001',
    name: 'High CPU Load Balancing',
    condition: {
      metric: 'cpu_avg',
      operator: '>',
      threshold: 85,
      duration: '10min',
    },
    action: {
      type: 'route_orders',
      target: 'LOCAL_EXTERNAL',
    },
    isActive: true,
    priority: 1,
  },
  {
    id: 'rule-002',
    name: 'EUR/USD Rate Optimization',
    condition: {
      metric: 'eur_usd_rate',
      operator: '>',
      threshold: 1.10,
      duration: '1h',
    },
    action: {
      type: 'migrate_workloads',
      target: 'INTERNAL',
    },
    isActive: true,
    priority: 2,
  },
  {
    id: 'rule-003',
    name: 'Local DC Latency Failover',
    condition: {
      metric: 'local_dc_latency',
      operator: '>',
      threshold: 50,
      duration: '5min',
    },
    action: {
      type: 'failover',
      target: 'INTL_EXTERNAL',
    },
    isActive: true,
    priority: 0,
  },
];

// ═══════════════════════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════════════════════
export const auditLogs: AuditLog[] = [
  {
    id: 'log-001',
    userId: 'admin-001',
    userName: 'مدیر سیستم',
    userLevel: 'L1_SUPER_ADMIN',
    action: 'MIGRATE_RESOURCE',
    target: 'res-010',
    details: { from: 'prov-001', to: 'prov-005' },
    ipAddress: '192.168.1.100',
    timestamp: '2024-03-10T14:30:00Z',
  },
  {
    id: 'log-002',
    userId: 'admin-001',
    userName: 'مدیر سیستم',
    userLevel: 'L1_SUPER_ADMIN',
    action: 'CHANGE_RBAC',
    target: 'admin-002',
    details: { permission: 'ops:write' },
    ipAddress: '192.168.1.100',
    timestamp: '2024-03-10T13:00:00Z',
  },
  {
    id: 'log-003',
    userId: 'admin-002',
    userName: 'مدیر عملیات',
    userLevel: 'L2_OPS_ADMIN',
    action: 'START_RESOURCE',
    target: 'res-009',
    ipAddress: '192.168.1.101',
    timestamp: '2024-03-10T12:45:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════
export function getProviderByType(type: Provider['type']): Provider[] {
  return providers.filter(p => p.type === type);
}

export function getResourcesByProvider(providerId: string): Resource[] {
  return resources.filter(r => r.providerId === providerId);
}

export function getResourcesByStatus(status: Resource['status']): Resource[] {
  return resources.filter(r => r.status === status);
}

export function getActiveMigrations(): Migration[] {
  return migrations.filter(m => m.status === 'IN_PROGRESS' || m.status === 'PENDING');
}
