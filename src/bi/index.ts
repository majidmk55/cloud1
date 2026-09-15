// ═══════════════════════════════════════════════════════════
// BI & DATA ENGINEERING MODULE - Main Entry Point
// Implements 30 BI methods across 6 layers
// ═══════════════════════════════════════════════════════════

// Re-export all BI modules
export * from './ingestion';
export * from './compute';
export * from './serving';
export * from './api';

// ═══════════════════════════════════════════════════════════
// BI CONFIGURATION
// ═══════════════════════════════════════════════════════════

export const BI_CONFIG = {
  // Chart color palette (12 colors)
  palette: {
    cyan: '#00D4FF',
    azure: '#4FC3F7',
    deepBlue: '#1A3A6C',
    emerald: '#00E5A0',
    lime: '#A8E063',
    amber: '#FFB020',
    coral: '#FF8A3D',
    red: '#FF4D6D',
    purple: '#9D6BFF',
    pink: '#FF6BC1',
    teal: '#00C9A7',
    slate: '#8899AA',
  },

  // Cache TTLs (seconds)
  cacheTTL: {
    kpi: 60,
    financial: 120,
    marketing: 300,
    customer: 180,
    predictive: 600,
  },

  // Dashboard refresh intervals (ms)
  refreshIntervals: {
    commandCenter: 30000, // 30s
    realTime: 5000, // 5s
    standard: 60000, // 1m
  },

  // Anomaly detection thresholds
  anomaly: {
    zScoreThreshold: 3,
    rollingWindowDays: 30,
  },

  // Forecasting
  forecast: {
    horizonMonths: 6,
    confidenceLevel: 0.95,
  },
};

// ═══════════════════════════════════════════════════════════
// METRIC DEFINITIONS (Semantic Layer - Spec #1)
// ═══════════════════════════════════════════════════════════

export interface MetricDefinition {
  name: string;
  formula: string;
  owner: string;
  layer: 'staging' | 'marts' | 'semantic';
  sqlTemplate: string;
  cacheTtlSec: number;
}

export const METRIC_REGISTRY: Record<string, MetricDefinition> = {
  // Financial Metrics
  MRR: {
    name: 'Monthly Recurring Revenue',
    formula: 'MRR_t = MRR_{t-1} + New + Expansion − Churn',
    owner: 'finance',
    layer: 'semantic',
    sqlTemplate: `
      SELECT 
        SUM(CASE WHEN status = 'Active' THEN mrr ELSE 0 END) as mrr,
        SUM(CASE WHEN status_prev <> 'Active' AND status = 'Active' THEN mrr ELSE 0 END) as new_mrr,
        SUM(CASE WHEN status_prev = 'Active' AND status = 'Active' AND mrr > mrr_prev THEN mrr - mrr_prev ELSE 0 END) as expansion_mrr,
        SUM(CASE WHEN status_prev = 'Active' AND status = 'Canceled' THEN mrr_prev ELSE 0 END) as churn_mrr
      FROM fct_mrr_snapshot
      WHERE snapshot_date = today()
    `,
    cacheTtlSec: 120,
  },

  NET_REVENUE: {
    name: 'Net Revenue',
    formula: 'Net Revenue = ΣInvoices − ΣRefunds − ΣDiscounts',
    owner: 'finance',
    layer: 'semantic',
    sqlTemplate: `
      SELECT 
        SUM(invoice_amount) - SUM(refund_amount) - SUM(discount_amount) as net_revenue
      FROM fct_invoices
      WHERE invoice_date BETWEEN {start_date} AND {end_date}
    `,
    cacheTtlSec: 120,
  },

  GROSS_MARGIN: {
    name: 'Gross Margin %',
    formula: 'Gross Margin% = (MRR − (DC+IP+Gateway+Support))/MRR*100',
    owner: 'finance',
    layer: 'semantic',
    sqlTemplate: `
      SELECT 
        (mrr - (datacenter_cost + ip_cost + gateway_cost + support_cost)) / mrr * 100 as gross_margin_pct
      FROM fct_margin_matrix
      WHERE period = {period}
    `,
    cacheTtlSec: 300,
  },

  // Marketing Metrics
  CAC: {
    name: 'Customer Acquisition Cost',
    formula: 'CAC = (AdSpend + MktSalaries)/NewPayingCustomers',
    owner: 'marketing',
    layer: 'semantic',
    sqlTemplate: `
      SELECT 
        (SUM(ad_spend) + SUM(mkt_salaries)) / COUNT(DISTINCT new_customer_id) as cac
      FROM fct_campaign_metrics
      WHERE period = {period}
    `,
    cacheTtlSec: 300,
  },

  LTV: {
    name: 'Lifetime Value',
    formula: 'LTV = (ARPU * GrossMargin%)/MonthlyChurn',
    owner: 'marketing',
    layer: 'semantic',
    sqlTemplate: `
      SELECT 
        (arpu * gross_margin_pct / 100) / monthly_churn_rate as ltv
      FROM dim_customer_metrics
      WHERE cohort_month = {cohort_month}
    `,
    cacheTtlSec: 600,
  },

  // Customer Metrics
  HEALTH_SCORE: {
    name: 'Customer Health Score',
    formula: '0.4*Usage + 0.3*Payment + 0.2*CSAT + 0.1*Adoption',
    owner: 'customer-success',
    layer: 'semantic',
    sqlTemplate: `
      SELECT 
        0.4 * usage_index + 0.3 * payment_index + 0.2 * csat_index + 0.1 * adoption_index as health_score
      FROM fct_health_score
      WHERE tenant_id = {tenant_id}
    `,
    cacheTtlSec: 180,
  },

  CHURN_PROBABILITY: {
    name: 'Churn Probability',
    formula: 'P(Churn) via XGBoost model',
    owner: 'data-science',
    layer: 'semantic',
    sqlTemplate: `
      SELECT score, top_features
      FROM customer_churn_scores
      WHERE tenant_id = {tenant_id}
      ORDER BY computed_at DESC LIMIT 1
    `,
    cacheTtlSec: 3600,
  },
};

// ═══════════════════════════════════════════════════════════
// BI DASHBOARD PAGES
// ═══════════════════════════════════════════════════════════

export const BI_DASHBOARD_PAGES = [
  { path: '/admin/bi/command-center', name: 'فرماندهی KPI', spec: '#6' },
  { path: '/admin/bi/financial', name: 'مالی', spec: '#3-5' },
  { path: '/admin/bi/marketing', name: 'بازاریابی', spec: '#7-14' },
  { path: '/admin/bi/customers', name: 'مشتریان', spec: '#15-19' },
  { path: '/admin/bi/predictive', name: 'پیش‌بینی', spec: '#20-24' },
  { path: '/admin/bi/ai-native', name: 'هوش مصنوعی', spec: '#25-28' },
  { path: '/admin/bi/products', name: 'محصولات', spec: '#29-30' },
  { path: '/admin/bi/data-ops', name: 'عملیات داده', spec: '#1-2' },
];
