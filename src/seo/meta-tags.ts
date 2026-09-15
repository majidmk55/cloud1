// ═══════════════════════════════════════════════════════════
// SEO META TAGS & PERFORMANCE MONITORING
// Dynamic Meta Tag Generator + Core Web Vitals Tracking
// ═══════════════════════════════════════════════════════════

import type { AbranEntity } from './knowledge-graph';

// ═══════════════════════════════════════════════════════════
// META TAG GENERATOR
// ═══════════════════════════════════════════════════════════

export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  
  // Twitter Card
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
  
  // AI Citation
  aiCitationSource?: string;
  aiConfidence?: number;
  
  // E-E-A-T
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetaTags(entity: AbranEntity): MetaTags {
  const { seo, metadata } = entity;
  
  return {
    title: seo.title,
    description: seo.metaDescription,
    canonical: seo.canonicalUrl,
    keywords: seo.keywords,
    
    // Open Graph
    ogTitle: seo.title,
    ogDescription: seo.metaDescription,
    ogImage: seo.ogImage,
    ogUrl: seo.canonicalUrl,
    ogType: seo.schemaType.toLowerCase(),
    ogSiteName: 'ابران سیستم',
    ogLocale: 'fa_IR',
    
    // Twitter Card
    twitterCard: 'summary_large_image',
    twitterTitle: seo.title,
    twitterDescription: seo.metaDescription,
    twitterImage: seo.ogImage,
    
    // AI Citation
    aiCitationSource: seo.aiCitationSource,
    aiConfidence: seo.aiConfidence,
    
    // E-E-A-T
    author: 'ابران سیستم تیم فنی',
    publishedTime: metadata.createdAt,
    modifiedTime: metadata.lastVerified,
  };
}

// ═══════════════════════════════════════════════════════════
// META TAG INJECTOR (for React Helmet-like usage)
// ═══════════════════════════════════════════════════════════

export function injectMetaTags(meta: MetaTags): void {
  if (typeof document === 'undefined') return;
  
  // Title
  document.title = meta.title;
  
  // Meta description
  setMetaTag('name', 'description', meta.description);
  
  // Keywords
  setMetaTag('name', 'keywords', meta.keywords.join(', '));
  
  // Canonical
  setLinkTag('canonical', meta.canonical);
  
  // Open Graph
  setMetaTag('property', 'og:title', meta.ogTitle);
  setMetaTag('property', 'og:description', meta.ogDescription);
  setMetaTag('property', 'og:url', meta.ogUrl);
  setMetaTag('property', 'og:type', meta.ogType);
  setMetaTag('property', 'og:site_name', meta.ogSiteName);
  setMetaTag('property', 'og:locale', meta.ogLocale);
  if (meta.ogImage) setMetaTag('property', 'og:image', meta.ogImage);
  
  // Twitter Card
  setMetaTag('name', 'twitter:card', meta.twitterCard);
  setMetaTag('name', 'twitter:title', meta.twitterTitle);
  setMetaTag('name', 'twitter:description', meta.twitterDescription);
  if (meta.twitterImage) setMetaTag('name', 'twitter:image', meta.twitterImage);
  
  // AI Citation
  if (meta.aiCitationSource) {
    setMetaTag('name', 'ai-citation-source', meta.aiCitationSource);
  }
  if (meta.aiConfidence !== undefined) {
    setMetaTag('name', 'ai-confidence-score', meta.aiConfidence.toString());
  }
  
  // E-E-A-T
  if (meta.author) setMetaTag('name', 'author', meta.author);
  if (meta.publishedTime) setMetaTag('name', 'article:published_time', meta.publishedTime);
  if (meta.modifiedTime) setMetaTag('name', 'article:modified_time', meta.modifiedTime);
}

function setMetaTag(attribute: string, name: string, content: string): void {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string): void {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  
  tag.setAttribute('href', href);
}

// ═══════════════════════════════════════════════════════════
// CORE WEB VITALS MONITOR
// ═══════════════════════════════════════════════════════════

export interface WebVitalsMetrics {
  // Core Web Vitals
  LCP?: number;   // Largest Contentful Paint (ms)
  FID?: number;   // First Input Delay (ms)
  CLS?: number;   // Cumulative Layout Shift
  INP?: number;   // Interaction to Next Paint (ms)
  FCP?: number;   // First Contentful Paint (ms)
  TTFB?: number;  // Time to First Byte (ms)
  
  // Additional metrics
  TTI?: number;   // Time to Interactive (ms)
  SI?: number;    // Speed Index (ms)
  
  // Metadata
  timestamp: string;
  url: string;
  userAgent: string;
}

export interface PerformanceThresholds {
  lcp: number;      // <= 2500ms
  fid: number;      // <= 100ms
  cls: number;      // <= 0.1
  inp: number;      // <= 200ms
  fcp: number;      // <= 1800ms
  ttfb: number;     // <= 800ms
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  inp: 200,
  fcp: 1800,
  ttfb: 800,
};

export class WebVitalsMonitor {
  private metrics: WebVitalsMetrics | null = null;
  private thresholds: PerformanceThresholds;
  private onViolation?: (metric: string, value: number, threshold: number) => void;

  constructor(thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS) {
    this.thresholds = thresholds;
  }

  // Initialize Web Vitals monitoring
  init(onViolation?: (metric: string, value: number, threshold: number) => void): void {
    if (typeof window === 'undefined') return;
    
    this.onViolation = onViolation;
    this.metrics = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // LCP
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics!.LCP = lastEntry.startTime;
        this.checkThreshold('LCP', this.metrics!.LCP, this.thresholds.lcp);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // FID/INP
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'first-input') {
            this.metrics!.FID = entry.processingStart - entry.startTime;
            this.checkThreshold('FID', this.metrics!.FID, this.thresholds.fid);
          }
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.metrics!.CLS = clsValue;
            this.checkThreshold('CLS', this.metrics!.CLS!, this.thresholds.cls);
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // FCP
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics!.FCP = entry.startTime;
            this.checkThreshold('FCP', this.metrics!.FCP, this.thresholds.fcp);
          }
        });
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    }

    // TTFB
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics!.TTFB = navigation.responseStart - navigation.requestStart;
        this.checkThreshold('TTFB', this.metrics!.TTFB, this.thresholds.ttfb);
      }
    });
  }

  private checkThreshold(metric: string, value: number, threshold: number): void {
    if (value > threshold && this.onViolation) {
      this.onViolation(metric, value, threshold);
      console.warn(`[WebVitals] ${metric} violation: ${value.toFixed(2)}ms > ${threshold}ms threshold`);
    }
  }

  // Get current metrics
  getMetrics(): WebVitalsMetrics | null {
    return this.metrics;
  }

  // Check if all metrics pass thresholds
  isPassing(): boolean {
    if (!this.metrics) return true;
    
    return (
      (!this.metrics.LCP || this.metrics.LCP <= this.thresholds.lcp) &&
      (!this.metrics.FID || this.metrics.FID <= this.thresholds.fid) &&
      (!this.metrics.CLS || this.metrics.CLS <= this.thresholds.cls) &&
      (!this.metrics.INP || this.metrics.INP <= this.thresholds.inp) &&
      (!this.metrics.FCP || this.metrics.FCP <= this.thresholds.fcp) &&
      (!this.metrics.TTFB || this.metrics.TTFB <= this.thresholds.ttfb)
    );
  }

  // Get performance report
  getReport(): {
    metrics: WebVitalsMetrics;
    passing: boolean;
    violations: Array<{ metric: string; value: number; threshold: number }>;
  } {
    const violations: Array<{ metric: string; value: number; threshold: number }> = [];
    
    if (this.metrics) {
      if (this.metrics.LCP && this.metrics.LCP > this.thresholds.lcp) {
        violations.push({ metric: 'LCP', value: this.metrics.LCP, threshold: this.thresholds.lcp });
      }
      if (this.metrics.FID && this.metrics.FID > this.thresholds.fid) {
        violations.push({ metric: 'FID', value: this.metrics.FID, threshold: this.thresholds.fid });
      }
      if (this.metrics.CLS && this.metrics.CLS > this.thresholds.cls) {
        violations.push({ metric: 'CLS', value: this.metrics.CLS, threshold: this.thresholds.cls });
      }
      if (this.metrics.INP && this.metrics.INP > this.thresholds.inp) {
        violations.push({ metric: 'INP', value: this.metrics.INP, threshold: this.thresholds.inp });
      }
      if (this.metrics.FCP && this.metrics.FCP > this.thresholds.fcp) {
        violations.push({ metric: 'FCP', value: this.metrics.FCP, threshold: this.thresholds.fcp });
      }
      if (this.metrics.TTFB && this.metrics.TTFB > this.thresholds.ttfb) {
        violations.push({ metric: 'TTFB', value: this.metrics.TTFB, threshold: this.thresholds.ttfb });
      }
    }
    
    return {
      metrics: this.metrics!,
      passing: violations.length === 0,
      violations,
    };
  }
}

// Singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// ═══════════════════════════════════════════════════════════
// ACCESSIBILITY MONITOR
// ═══════════════════════════════════════════════════════════

export interface AccessibilityViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: number;
}

export class AccessibilityMonitor {
  private violations: AccessibilityViolation[] = [];

  // Run accessibility checks
  async run(): Promise<AccessibilityViolation[]> {
    if (typeof document === 'undefined') return [];
    
    this.violations = [];
    
    // Check for images without alt text
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt) {
        this.violations.push({
          id: 'image-alt',
          impact: 'critical',
          description: 'Images must have alternate text',
          help: 'Add alt attribute to all images',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H37',
          nodes: 1,
        });
      }
    });
    
    // Check for form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
      const id = input.id;
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label && !input.getAttribute('aria-label')) {
        this.violations.push({
          id: 'form-label',
          impact: 'serious',
          description: 'Form elements must have labels',
          help: 'Add label or aria-label to form elements',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Techniques/html/H44',
          nodes: 1,
        });
      }
    });
    
    // Check for color contrast (simplified)
    // In production, use axe-core or similar library
    
    return this.violations;
  }

  // Get violations
  getViolations(): AccessibilityViolation[] {
    return this.violations;
  }

  // Check if passing (zero critical/serious violations)
  isPassing(): boolean {
    return this.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length === 0;
  }
}

// Singleton instance
export const accessibilityMonitor = new AccessibilityMonitor();

// ═══════════════════════════════════════════════════════════
// SEO AUDIT REPORT
// ═══════════════════════════════════════════════════════════

export interface SEOAuditReport {
  timestamp: string;
  url: string;
  
  // Meta tags
  hasTitle: boolean;
  hasDescription: boolean;
  hasCanonical: boolean;
  hasOGTags: boolean;
  hasTwitterTags: boolean;
  
  // Structured data
  hasSchemaMarkup: boolean;
  schemaTypes: string[];
  
  // Performance
  webVitals: {
    passing: boolean;
    violations: Array<{ metric: string; value: number; threshold: number }>;
  };
  
  // Accessibility
  accessibility: {
    passing: boolean;
    violations: AccessibilityViolation[];
  };
  
  // Overall score
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export function runSEOAudit(): SEOAuditReport {
  if (typeof document === 'undefined') {
    return {
      timestamp: new Date().toISOString(),
      url: '',
      hasTitle: false,
      hasDescription: false,
      hasCanonical: false,
      hasOGTags: false,
      hasTwitterTags: false,
      hasSchemaMarkup: false,
      schemaTypes: [],
      webVitals: { passing: true, violations: [] },
      accessibility: { passing: true, violations: [] },
      score: 0,
      grade: 'F',
    };
  }
  
  // Check meta tags
  const hasTitle = !!document.title;
  const hasDescription = !!document.querySelector('meta[name="description"]');
  const hasCanonical = !!document.querySelector('link[rel="canonical"]');
  const hasOGTags = !!document.querySelector('meta[property="og:title"]');
  const hasTwitterTags = !!document.querySelector('meta[name="twitter:card"]');
  
  // Check structured data
  const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
  const schemaTypes: string[] = [];
  schemaScripts.forEach((script) => {
    try {
      const data = JSON.parse(script.textContent || '');
      if (data['@type']) {
        schemaTypes.push(data['@type']);
      }
    } catch (e) {
      // Invalid JSON
    }
  });
  
  // Get performance report
  const webVitalsReport = webVitalsMonitor.getReport();
  
  // Get accessibility report
  const accessibilityViolations = accessibilityMonitor.getViolations();
  
  // Calculate score
  let score = 0;
  if (hasTitle) score += 10;
  if (hasDescription) score += 10;
  if (hasCanonical) score += 10;
  if (hasOGTags) score += 10;
  if (hasTwitterTags) score += 10;
  if (schemaTypes.length > 0) score += 20;
  if (webVitalsReport.passing) score += 15;
  if (accessibilityViolations.length === 0) score += 15;
  
  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  return {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    hasTitle,
    hasDescription,
    hasCanonical,
    hasOGTags,
    hasTwitterTags,
    hasSchemaMarkup: schemaTypes.length > 0,
    schemaTypes,
    webVitals: webVitalsReport,
    accessibility: {
      passing: accessibilityViolations.length === 0,
      violations: accessibilityViolations,
    },
    score,
    grade,
  };
}
