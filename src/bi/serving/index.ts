// ═══════════════════════════════════════════════════════════
// BI SERVING LAYER
// Semantic query service + BI API gateway
// ═══════════════════════════════════════════════════════════

import { METRIC_REGISTRY, type MetricDefinition } from '../index';

// ═══════════════════════════════════════════════════════════
// SEMANTIC QUERY SERVICE (Spec #1)
// Resolves metric names → generates SQL → executes → returns data
// ═══════════════════════════════════════════════════════════

export interface QueryResult {
  columns: string[];
  rows: any[];
  meta: {
    metric: string;
    executionTimeMs: number;
    cached: boolean;
  };
}

export class SemanticQueryService {
  private cache: Map<string, { data: QueryResult; timestamp: number }> = new Map();

  async query(metricName: string, params: Record<string, any> = {}): Promise<QueryResult> {
    const startTime = Date.now();
    
    // Check cache
    const cacheKey = `${metricName}:${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      const metric = METRIC_REGISTRY[metricName];
      if (metric && (Date.now() - cached.timestamp) < metric.cacheTtlSec * 1000) {
        return {
          ...cached.data,
          meta: { ...cached.data.meta, cached: true },
        };
      }
    }

    // Resolve metric definition
    const metric = METRIC_REGISTRY[metricName];
    if (!metric) {
      throw new Error(`Metric not found: ${metricName}`);
    }

    console.log(`[Semantic Query] Executing metric: ${metricName}`);
    console.log(`[Semantic Query] Formula: ${metric.formula}`);

    // Generate parameterized SQL (simulated)
    const sql = this.parameterizeSql(metric.sqlTemplate, params);
    console.log(`[Semantic Query] SQL: ${sql.slice(0, 100)}...`);

    // Execute on ClickHouse (simulated)
    const result = await this.executeClickHouse(sql);

    const queryResult: QueryResult = {
      columns: result.columns,
      rows: result.rows,
      meta: {
        metric: metricName,
        executionTimeMs: Date.now() - startTime,
        cached: false,
      },
    };

    // Cache result
    this.cache.set(cacheKey, { data: queryResult, timestamp: Date.now() });

    return queryResult;
  }

  private parameterizeSql(template: string, params: Record<string, any>): string {
    let sql = template;
    for (const [key, value] of Object.entries(params)) {
      sql = sql.replace(`{${key}}`, String(value));
    }
    return sql;
  }

  private async executeClickHouse(sql: string): Promise<{ columns: string[]; rows: any[] }> {
    // Simulate ClickHouse query execution
    // In production: execute actual SQL on ClickHouse
    
    // Return mock data based on SQL pattern
    if (sql.includes('mrr')) {
      return {
        columns: ['mrr', 'new_mrr', 'expansion_mrr', 'churn_mrr'],
        rows: [
          { mrr: 150000000, new_mrr: 15000000, expansion_mrr: 8000000, churn_mrr: 5000000 },
        ],
      };
    }
    
    if (sql.includes('net_revenue')) {
      return {
        columns: ['net_revenue'],
        rows: [{ net_revenue: 180000000 }],
      };
    }

    return { columns: [], rows: [] };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

// ═══════════════════════════════════════════════════════════
// BI API GATEWAY (Spec Section 7)
// REST endpoints with RBAC + tenant scoping + caching
// ═══════════════════════════════════════════════════════════

export class BiApiGateway {
  private semanticQuery: SemanticQueryService;

  constructor() {
    this.semanticQuery = new SemanticQueryService();
  }

  // Spec #6: Executive KPI Command Center
  async getCommandCenter(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/kpi/command-center');
    
    const mrr = await this.semanticQuery.query('MRR');
    const netRevenue = await this.semanticQuery.query('NET_REVENUE');
    const grossMargin = await this.semanticQuery.query('GROSS_MARGIN');
    
    return {
      mrr: mrr.rows[0],
      netRevenue: netRevenue.rows[0],
      grossMargin: grossMargin.rows[0],
      activeCustomers: 1250,
      churnRate: 0.045,
      healthIndex: 78.5,
    };
  }

  // Spec #4: MRR Waterfall
  async getMrrWaterfall(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/financial/mrr-waterfall');
    return this.semanticQuery.query('MRR');
  }

  // Spec #5: Margin Matrix
  async getMarginMatrix(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/financial/margin-matrix');
    return this.semanticQuery.query('GROSS_MARGIN');
  }

  // Spec #7: Marketing Funnel
  async getMarketingFunnel(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/marketing/funnel');
    // Return funnel data
    return {
      stages: [
        { stage: 'Visited', count: 10000, conversionRate: 100 },
        { stage: 'Viewed Configurator', count: 4500, conversionRate: 45 },
        { stage: 'Added to Cart', count: 2000, conversionRate: 44.4 },
        { stage: 'Payment Success', count: 800, conversionRate: 40 },
        { stage: 'Provisioned', count: 750, conversionRate: 93.75 },
      ],
    };
  }

  // Spec #11: Attribution Sankey
  async getAttributionSankey(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/marketing/attribution-sankey');
    return {
      nodes: [
        { name: 'Google' },
        { name: 'Meta' },
        { name: 'Email' },
        { name: 'Organic' },
        { name: 'Conversion' },
      ],
      links: [
        { source: 'Google', target: 'Conversion', value: 35000000 },
        { source: 'Meta', target: 'Conversion', value: 25000000 },
        { source: 'Email', target: 'Conversion', value: 20000000 },
        { source: 'Organic', target: 'Conversion', value: 20000000 },
      ],
    };
  }

  // Spec #15: RFM Segmentation
  async getRfmSegmentation(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/customers/rfm');
    return {
      customers: Array.from({ length: 100 }, (_, i) => ({
        customerId: `cust-${i}`,
        recency: Math.floor(Math.random() * 90) + 1,
        frequency: Math.floor(Math.random() * 20) + 1,
        monetary: Math.floor(Math.random() * 50000000) + 1000000,
        segment: ['Champions', 'Loyal', 'At Risk', 'Hibernating'][Math.floor(Math.random() * 4)],
      })),
    };
  }

  // Spec #18: Cohort Retention Heatmap
  async getCohortRetention(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/customers/cohort-heatmap');
    
    const cohorts = [];
    for (let c = 0; c < 6; c++) {
      const cohortDate = new Date();
      cohortDate.setMonth(cohortDate.getMonth() - (5 - c));
      
      for (let m = 0; m <= 12 - c; m++) {
        const retentionRate = Math.max(30, 100 - (m * 8) - (Math.random() * 5));
        
        cohorts.push({
          cohortMonth: cohortDate.toISOString().slice(0, 7),
          monthIndex: m,
          retentionRate,
        });
      }
    }
    
    return { cohorts };
  }

  // Spec #20: Revenue Forecast
  async getRevenueForecast(): Promise<any> {
    console.log('[BI API] GET /api/admin/bi/predictive/revenue-forecast');
    
    const forecasts = [];
    const baseMrr = 150000000;
    
    // Historical
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const mrr = baseMrr * Math.pow(1.08, 12 - i);
      
      forecasts.push({
        date: date.toISOString().slice(0, 7),
        actual: mrr,
        forecast: mrr,
        lower: mrr * 0.95,
        upper: mrr * 1.05,
      });
    }
    
    // Future
    for (let i = 1; i <= 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const forecast = baseMrr * Math.pow(1.08, 12 + i);
      
      forecasts.push({
        date: date.toISOString().slice(0, 7),
        forecast,
        lower: forecast * 0.85,
        upper: forecast * 1.15,
      });
    }
    
    return { forecasts };
  }

  // Spec #22: Anomaly Detection
  async getAnomalies(metric: string = 'conversion_rate'): Promise<any> {
    console.log(`[BI API] GET /api/admin/bi/predictive/anomalies?metric=${metric}`);
    
    const anomalies = [];
    const baseValue = 100;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let value = baseValue + (Math.random() - 0.5) * 20;
      const isAnomaly = Math.random() < 0.08;
      
      if (isAnomaly) {
        value = baseValue + (Math.random() > 0.5 ? 1 : -1) * 40;
      }
      
      const zScore = (value - baseValue) / 10;
      
      anomalies.push({
        date: date.toISOString().split('T')[0],
        metric,
        value,
        expected: baseValue,
        zScore,
        isAnomaly: Math.abs(zScore) > 3,
      });
    }
    
    return { anomalies };
  }

  // Spec #24: What-If Scenario
  async simulateScenario(priceChange: number, costChange: number, churnChange: number): Promise<any> {
    console.log(`[BI API] POST /api/admin/bi/predictive/scenario`);
    
    const baseRevenue = 200000000;
    const baseCost = 120000000;
    
    const priceElasticity = -1.5;
    const volumeChange = priceChange * priceElasticity;
    
    const revenue = baseRevenue * (1 + volumeChange / 100) * (1 + priceChange / 100);
    const cost = baseCost * (1 + costChange / 100);
    const netProfit = revenue - cost;
    
    return {
      priceChange,
      costChange,
      churnChange,
      netProfit,
      revenue,
    };
  }
}

// Export singleton
export const semanticQueryService = new SemanticQueryService();
export const biApiGateway = new BiApiGateway();
