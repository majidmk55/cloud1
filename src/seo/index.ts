// ═══════════════════════════════════════════════════════════
// SEO MODULE - MAIN ENTRY POINT
// Universal Discoverability Architecture for Abran System
// ═══════════════════════════════════════════════════════════

// Re-export all SEO modules
export * from './knowledge-graph';
export * from './schema-generator';
export { generateMetaTags, injectMetaTags, WebVitalsMonitor, webVitalsMonitor, AccessibilityMonitor, accessibilityMonitor, runSEOAudit } from './meta-tags';
export type { MetaTags, WebVitalsMetrics, PerformanceThresholds, AccessibilityViolation, SEOAuditReport } from './meta-tags';
export { generateSitemap, generateLLMsTxt, generateRSSFeed, generateGoogleMerchantFeed, generateOpenGraphFeed, FeedManager, feedManager } from './sitemap-generator';
export type { SitemapUrl, RSSItem } from './sitemap-generator';
export { SelfHealingEngine, selfHealingEngine, GovernanceCouncil, governanceCouncil, AUTO_REMEDIATION_MATRIX } from './self-healing';
export type { IssueType, RiskLevel, SEOIssue, GovernanceDecision } from './self-healing';

// ═══════════════════════════════════════════════════════════
// SEO CONFIGURATION
// ═══════════════════════════════════════════════════════════

export interface SEOConfig {
  baseUrl: string;
  organizationName: string;
  defaultLocale: string;
  supportedLocales: string[];
  
  // Performance thresholds
  performanceThresholds: {
    lcp: number;
    fid: number;
    cls: number;
    inp: number;
    fcp: number;
    ttfb: number;
  };
  
  // Self-healing configuration
  selfHealing: {
    enabled: boolean;
    autoFixLowRisk: boolean;
    confidenceThreshold: number;
  };
}

export const DEFAULT_SEO_CONFIG: SEOConfig = {
  baseUrl: 'https://abran.system',
  organizationName: 'ابران سیستم',
  defaultLocale: 'fa-IR',
  supportedLocales: ['fa-IR', 'en-US'],
  
  performanceThresholds: {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    inp: 200,
    fcp: 1800,
    ttfb: 800,
  },
  
  selfHealing: {
    enabled: true,
    autoFixLowRisk: true,
    confidenceThreshold: 0.85,
  },
};

// ═══════════════════════════════════════════════════════════
// SEO INITIALIZER
// ═══════════════════════════════════════════════════════════

import { webVitalsMonitor, accessibilityMonitor, runSEOAudit } from './meta-tags';
import { selfHealingEngine as _selfHealingEngine } from './self-healing';

export function initializeSEO(config: SEOConfig = DEFAULT_SEO_CONFIG): void {
  if (typeof window === 'undefined') return;
  
  console.log('[SEO] Initializing Universal Discoverability Architecture...');
  
  // Initialize Web Vitals monitoring
  webVitalsMonitor.init((metric, value, threshold) => {
    console.warn(`[SEO] Performance violation: ${metric} = ${value}ms (threshold: ${threshold}ms)`);
    
    // Detect performance issue
    _selfHealingEngine.detectIssues([{
      type: 'performance-violation',
      riskLevel: 'medium',
      url: window.location.href,
      description: `${metric} exceeded threshold: ${value}ms > ${threshold}ms`,
      confidence: 0.95,
    }]);
  });
  
  // Initialize accessibility monitoring
  setTimeout(async () => {
    const violations = await accessibilityMonitor.run();
    
    if (violations.length > 0) {
      console.warn(`[SEO] Accessibility violations detected: ${violations.length}`);
      
      // Detect accessibility issues
      _selfHealingEngine.detectIssues(violations.map(v => ({
        type: 'accessibility-violation' as const,
        riskLevel: v.impact === 'critical' ? 'high' : v.impact === 'serious' ? 'medium' : 'low',
        url: window.location.href,
        description: v.description,
        confidence: 0.9,
      })));
    }
  }, 3000); // Wait for page to fully load
  
  // Auto-fix low-risk issues
  if (config.selfHealing.enabled && config.selfHealing.autoFixLowRisk) {
    setTimeout(async () => {
      const results = await _selfHealingEngine.autoFixIssues();
      if (results.length > 0) {
        console.log(`[SEO] Auto-fixed ${results.filter(r => r.success).length} issues`);
      }
    }, 5000);
  }
  
  // Run SEO audit
  setTimeout(() => {
    const report = runSEOAudit();
    console.log(`[SEO] Audit complete: Score ${report.score}/100 (Grade ${report.grade})`);
    
    if (!report.webVitals.passing) {
      console.warn('[SEO] Web Vitals violations:', report.webVitals.violations);
    }
    
    if (!report.accessibility.passing) {
      console.warn('[SEO] Accessibility violations:', report.accessibility.violations.length);
    }
  }, 10000);
  
  console.log('[SEO] Initialization complete');
}

// ═══════════════════════════════════════════════════════════
// SEO HOOKS (for React components)
// ═══════════════════════════════════════════════════════════

import { useEffect } from 'react';
import type { AbranEntity } from './knowledge-graph';
import { generateMetaTags, injectMetaTags } from './meta-tags';
import { injectSchema } from './schema-generator';

// Hook to set meta tags for an entity
export function useEntitySEO(entity: AbranEntity): void {
  useEffect(() => {
    const meta = generateMetaTags(entity);
    injectMetaTags(meta);
  }, [entity]);
}

// Hook to inject schema markup
export function useSchemaMarkup(schema: object): string {
  return injectSchema(schema);
}

// ═══════════════════════════════════════════════════════════
// SEO DASHBOARD DATA
// ═══════════════════════════════════════════════════════════

import { knowledgeGraph } from './knowledge-graph';
import { selfHealingEngine as _selfHealingEngine2, governanceCouncil } from './self-healing';

export function getSEODashboardData(): {
  entities: {
    total: number;
    byType: Record<string, number>;
  };
  issues: {
    total: number;
    autoFixed: number;
    pendingReview: number;
  };
  performance: {
    passing: boolean;
    violations: Array<{ metric: string; value: number; threshold: number }>;
  };
  accessibility: {
    passing: boolean;
    violations: number;
  };
  audit: {
    score: number;
    grade: string;
  };
} {
  const entities = knowledgeGraph.getAll();
  const issues = _selfHealingEngine2.getAllIssues();
  const stats = _selfHealingEngine2.getStatistics();
  const performance = webVitalsMonitor.getReport();
  const accessibility = accessibilityMonitor.getViolations();
  const audit = typeof window !== 'undefined' ? runSEOAudit() : null;
  
  return {
    entities: {
      total: entities.length,
      byType: knowledgeGraph.getCountByType(),
    },
    issues: {
      total: stats.totalIssues,
      autoFixed: stats.autoFixed,
      pendingReview: stats.pendingHumanReview,
    },
    performance: {
      passing: performance.passing,
      violations: performance.violations,
    },
    accessibility: {
      passing: accessibility.length === 0,
      violations: accessibility.length,
    },
    audit: audit ? {
      score: audit.score,
      grade: audit.grade,
    } : { score: 0, grade: 'N/A' },
  };
}
