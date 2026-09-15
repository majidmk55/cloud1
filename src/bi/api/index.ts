// ═══════════════════════════════════════════════════════════
// BI API LAYER
// REST endpoints for BI dashboards
// ═══════════════════════════════════════════════════════════

// Re-export from serving layer
export { biApiGateway, semanticQueryService } from '../serving';

// ═══════════════════════════════════════════════════════════
// API ENDPOINT DEFINITIONS (Spec Section 7)
// ═══════════════════════════════════════════════════════════

export const BI_API_ENDPOINTS = {
  // Command Center (Spec #6)
  COMMAND_CENTER: '/api/admin/bi/kpi/command-center',
  
  // Financial (Spec #3-5)
  MRR_WATERFALL: '/api/admin/bi/financial/mrr-waterfall',
  MARGIN_MATRIX: '/api/admin/bi/financial/margin-matrix',
  
  // Marketing (Spec #7-14)
  MARKETING_FUNNEL: '/api/admin/bi/marketing/funnel',
  ATTRIBUTION_SANKEY: '/api/admin/bi/marketing/attribution-sankey',
  CAC_LTV: '/api/admin/bi/marketing/cac-ltv',
  CHANNEL_SCORES: '/api/admin/bi/marketing/channel-scores',
  CAMPAIGNS: '/api/admin/bi/marketing/campaigns',
  
  // Customers (Spec #15-19)
  RFM: '/api/admin/bi/customers/rfm',
  HEALTH_DISTRIBUTION: '/api/admin/bi/customers/health-distribution',
  CHURN_RISK: '/api/admin/bi/customers/churn-risk',
  COHORT_HEATMAP: '/api/admin/bi/customers/cohort-heatmap',
  CLUSTERS: '/api/admin/bi/customers/clusters',
  
  // Predictive (Spec #20-24)
  REVENUE_FORECAST: '/api/admin/bi/predictive/revenue-forecast',
  DEMAND_FORECAST: '/api/admin/bi/predictive/demand-forecast',
  ANOMALIES: '/api/admin/bi/predictive/anomalies',
  ROOT_CAUSE: '/api/admin/bi/predictive/root-cause',
  SCENARIO: '/api/admin/bi/predictive/scenario',
  
  // AI-Native (Spec #25-28)
  NLQ: '/api/admin/bi/ai/nlq',
  SUMMARIES: '/api/admin/bi/ai/summaries',
  RECOMMENDATIONS: '/api/admin/bi/ai/recommendations',
  EMBEDDED_TOKEN: '/api/admin/bi/embedded/token',
  
  // Products (Spec #29-30)
  PRODUCT_MATRIX: '/api/admin/bi/products/matrix',
  VELOCITY: '/api/admin/bi/products/velocity',
  
  // Data Ops (Spec #1-2)
  METRICS_CATALOG: '/api/admin/bi/data-ops/metrics-catalog',
  DQ_SCORE: '/api/admin/bi/data-ops/dq-score',
  QUARANTINE: '/api/admin/bi/data-ops/quarantine',
  PIPELINE_RUNS: '/api/admin/bi/data-ops/pipeline-runs',
};

// ═══════════════════════════════════════════════════════════
// RBAC PERMISSIONS
// ═══════════════════════════════════════════════════════════

export const BI_PERMISSIONS = {
  READ: 'bi:read',
  ADMIN: 'bi:admin',
  EXPORT: 'bi:export',
};

// ═══════════════════════════════════════════════════════════
// CACHE CONFIGURATION
// ═══════════════════════════════════════════════════════════

export const BI_CACHE_CONFIG = {
  [BI_API_ENDPOINTS.COMMAND_CENTER]: 60, // 1 min
  [BI_API_ENDPOINTS.MRR_WATERFALL]: 120, // 2 min
  [BI_API_ENDPOINTS.MARGIN_MATRIX]: 300, // 5 min
  [BI_API_ENDPOINTS.MARKETING_FUNNEL]: 300,
  [BI_API_ENDPOINTS.RFM]: 180, // 3 min
  [BI_API_ENDPOINTS.COHORT_HEATMAP]: 600, // 10 min
  [BI_API_ENDPOINTS.REVENUE_FORECAST]: 3600, // 1 hour
  [BI_API_ENDPOINTS.ANOMALIES]: 60,
};
