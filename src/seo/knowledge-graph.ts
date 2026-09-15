// ═══════════════════════════════════════════════════════════
// ENTITY-CENTRIC KNOWLEDGE GRAPH
// The Semantic Core of Abran System Discoverability
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// CORE ENTITY TYPES
// ═══════════════════════════════════════════════════════════

export type EntityType = 
  | 'Product' 
  | 'Service' 
  | 'Guide' 
  | 'Brand' 
  | 'TechSpec'
  | 'Organization'
  | 'Person'
  | 'FAQ'
  | 'Review';

export type RelationType = 
  | 'USES' 
  | 'COMPATIBLE_WITH' 
  | 'UPGRADE_OF' 
  | 'LOCATED_IN' 
  | 'AUTHORED_BY'
  | 'BRAND'
  | 'CATEGORY'
  | 'ALTERNATIVE_TO'
  | 'PART_OF'
  | 'INCLUDES';

export type SourceSystem = 'PIM' | 'CMS' | 'BILLING' | 'CRM' | 'MONITORING';

// ═══════════════════════════════════════════════════════════
// CORE ENTITY INTERFACE
// All discoverable assets inherit this
// ═══════════════════════════════════════════════════════════

export interface AbranEntity {
  id: string;                          // UUID v4 or semantic slug
  type: EntityType;
  canonicalName: string;
  alternateNames: string[];            // For NLP matching & synonym handling
  slug: string;                        // URL-friendly identifier
  description: string;
  
  relationships: EntityRelationship[];
  attributes: Record<string, any>;     // Dynamic specs (RAM, Region, Price)
  
  metadata: EntityMetadata;
  
  // SEO-specific fields
  seo: EntitySEO;
}

export interface EntityRelationship {
  targetId: string;
  targetType: EntityType;
  relationType: RelationType;
  weight: number;                      // Strength of relationship (0-1)
  bidirectional?: boolean;
}

export interface EntityMetadata {
  lastVerified: string;                // ISO8601 - E-E-A-T freshness signal
  createdAt: string;
  sourceSystem: SourceSystem;
  confidenceScore: number;             // AI validation score (0-1)
  version: string;
  changeLog: ChangeLogEntry[];
}

export interface ChangeLogEntry {
  timestamp: string;
  field: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  reason: string;
}

export interface EntitySEO {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage?: string;
  keywords: string[];
  breadcrumbs: BreadcrumbItem[];
  
  // Structured Data
  schemaType: string;                  // Schema.org type
  schemaData?: Record<string, any>;    // Additional schema properties
  
  // AI Citation
  aiCitationSource: string;
  aiConfidence: number;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

// ═══════════════════════════════════════════════════════════
// PRODUCT ENTITY (extends AbranEntity)
// ═══════════════════════════════════════════════════════════

export interface ProductEntity extends AbranEntity {
  type: 'Product';
  attributes: ProductAttributes;
}

export interface ProductAttributes {
  sku: string;
  category: string;
  subcategory?: string;
  price: {
    value: number;
    currency: string;
    billingCycle: 'monthly' | 'yearly' | 'hourly';
  };
  stock: number;
  region: string;
  specs: Record<string, string | number>;
  features: string[];
  compatibility: string[];
  images: string[];
  
  // Performance metrics
  uptime?: number;
  latency?: number;
  
  // E-E-A-T signals
  certifications: string[];
  complianceStandards: string[];
}

// ═══════════════════════════════════════════════════════════
// SERVICE ENTITY
// ═══════════════════════════════════════════════════════════

export interface ServiceEntity extends AbranEntity {
  type: 'Service';
  attributes: ServiceAttributes;
}

export interface ServiceAttributes {
  serviceType: 'cloud' | 'hosting' | 'ai' | 'security' | 'support';
  sla: {
    uptime: number;
    responseTime: string;
    supportHours: string;
  };
  pricing: PricingTier[];
  features: ServiceFeature[];
  integrations: string[];
}

export interface PricingTier {
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceFeature {
  name: string;
  description: string;
  included: boolean;
  tier?: string;
}

// ═══════════════════════════════════════════════════════════
// KNOWLEDGE GRAPH STORE
// ═══════════════════════════════════════════════════════════

export class KnowledgeGraph {
  private entities: Map<string, AbranEntity> = new Map();
  private relationships: Map<string, EntityRelationship[]> = new Map();

  // Add entity to graph
  addEntity(entity: AbranEntity): void {
    this.entities.set(entity.id, entity);
    
    // Index relationships
    for (const rel of entity.relationships) {
      const existing = this.relationships.get(entity.id) || [];
      existing.push(rel);
      this.relationships.set(entity.id, existing);
      
      // Bidirectional
      if (rel.bidirectional) {
        const reverse: EntityRelationship = {
          targetId: entity.id,
          targetType: entity.type,
          relationType: rel.relationType,
          weight: rel.weight,
        };
        const reverseExisting = this.relationships.get(rel.targetId) || [];
        reverseExisting.push(reverse);
        this.relationships.set(rel.targetId, reverseExisting);
      }
    }
  }

  // Get entity by ID
  getEntity(id: string): AbranEntity | undefined {
    return this.entities.get(id);
  }

  // Get entity by slug
  getBySlug(slug: string): AbranEntity | undefined {
    for (const entity of this.entities.values()) {
      if (entity.slug === slug) return entity;
    }
    return undefined;
  }

  // Get entities by type
  getByType(type: EntityType): AbranEntity[] {
    return Array.from(this.entities.values()).filter(e => e.type === type);
  }

  // Get related entities
  getRelated(entityId: string, relationType?: RelationType): AbranEntity[] {
    const rels = this.relationships.get(entityId) || [];
    const filtered = relationType 
      ? rels.filter(r => r.relationType === relationType)
      : rels;
    
    return filtered
      .map(r => this.entities.get(r.targetId))
      .filter((e): e is AbranEntity => e !== undefined)
      .sort((a, b) => {
        const relA = rels.find(r => r.targetId === a.id);
        const relB = rels.find(r => r.targetId === b.id);
        return (relB?.weight || 0) - (relA?.weight || 0);
      });
  }

  // Search entities by name/keywords
  search(query: string): AbranEntity[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.entities.values()).filter(entity => {
      return (
        entity.canonicalName.toLowerCase().includes(lowerQuery) ||
        entity.alternateNames.some(n => n.toLowerCase().includes(lowerQuery)) ||
        entity.description.toLowerCase().includes(lowerQuery) ||
        entity.seo.keywords.some(k => k.toLowerCase().includes(lowerQuery))
      );
    });
  }

  // Get all entities
  getAll(): AbranEntity[] {
    return Array.from(this.entities.values());
  }

  // Get entity count by type
  getCountByType(): Record<EntityType, number> {
    const counts: Record<string, number> = {};
    for (const entity of this.entities.values()) {
      counts[entity.type] = (counts[entity.type] || 0) + 1;
    }
    return counts as Record<EntityType, number>;
  }

  // Validate entity completeness
  validateEntity(entity: AbranEntity): ValidationResult {
    const issues: ValidationIssue[] = [];

    if (!entity.canonicalName) {
      issues.push({ field: 'canonicalName', severity: 'critical', message: 'Missing canonical name' });
    }
    if (!entity.slug) {
      issues.push({ field: 'slug', severity: 'critical', message: 'Missing slug' });
    }
    if (!entity.seo.title) {
      issues.push({ field: 'seo.title', severity: 'high', message: 'Missing SEO title' });
    }
    if (!entity.seo.metaDescription) {
      issues.push({ field: 'seo.metaDescription', severity: 'high', message: 'Missing meta description' });
    }
    if (entity.seo.metaDescription && entity.seo.metaDescription.length > 160) {
      issues.push({ field: 'seo.metaDescription', severity: 'medium', message: 'Meta description too long (>160 chars)' });
    }
    if (entity.seo.keywords.length === 0) {
      issues.push({ field: 'seo.keywords', severity: 'medium', message: 'No keywords defined' });
    }
    if (entity.metadata.confidenceScore < 0.7) {
      issues.push({ field: 'metadata.confidenceScore', severity: 'low', message: 'Low confidence score' });
    }

    return {
      valid: issues.filter(i => i.severity === 'critical').length === 0,
      issues,
    };
  }
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  field: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
}

// ═══════════════════════════════════════════════════════════
// SEED DATA - Sample Entities
// ═══════════════════════════════════════════════════════════

export function createSampleKnowledgeGraph(): KnowledgeGraph {
  const kg = new KnowledgeGraph();

  // Brand Entity
  kg.addEntity({
    id: 'brand-abran',
    type: 'Organization',
    canonicalName: 'ابران سیستم',
    alternateNames: ['Abran System', 'Abran', 'ابران'],
    slug: 'abran-system',
    description: 'ارائه‌دهنده خدمات ابری، دیتاسنتر و هوش مصنوعی',
    relationships: [],
    attributes: {
      founded: '2019',
      headquarters: 'Tehran, Iran',
      employees: '50+',
      website: 'https://abran.system',
    },
    metadata: {
      lastVerified: new Date().toISOString(),
      createdAt: '2019-01-01T00:00:00Z',
      sourceSystem: 'CMS',
      confidenceScore: 0.98,
      version: '1.0',
      changeLog: [],
    },
    seo: {
      title: 'ابران سیستم | خدمات ابری و هوش مصنوعی',
      metaDescription: 'ابران سیستم ارائه‌دهنده خدمات ابری، سرور اختصاصی، کولوکیشن و API‌های هوش مصنوعی',
      canonicalUrl: 'https://abran.system',
      keywords: ['ابران سیستم', 'خدمات ابری', 'هوش مصنوعی', 'سرور ابری'],
      breadcrumbs: [],
      schemaType: 'Organization',
      aiCitationSource: 'abran-system-cms-v2',
      aiConfidence: 0.98,
    },
  });

  // Product Entities
  const products: ProductEntity[] = [
    {
      id: 'product-vps-iran',
      type: 'Product',
      canonicalName: 'سرور مجازی ایران',
      alternateNames: ['VPS ایران', 'سرور مجازی ایرانی', 'Iran VPS'],
      slug: 'vps-iran',
      description: 'سرور مجازی پرسرعت در دیتاسنترهای ایران با پینگ پایین',
      relationships: [
        { targetId: 'brand-abran', targetType: 'Organization', relationType: 'BRAND', weight: 1.0 },
        { targetId: 'service-cloud', targetType: 'Service', relationType: 'PART_OF', weight: 0.9 },
      ],
      attributes: {
        sku: 'VPS-IR-001',
        category: 'سرور مجازی',
        price: { value: 490000, currency: 'IRR', billingCycle: 'monthly' },
        stock: 100,
        region: 'iran',
        specs: { CPU: '4 Core', RAM: '8 GB', Storage: '100 GB SSD', Bandwidth: '1 TB' },
        features: ['SSD NVMe', 'پنل مدیریت', 'پشتیبانی ۲۴/۷', 'بکاپ خودکار'],
        compatibility: ['Linux', 'Windows'],
        images: [],
        uptime: 99.9,
        latency: 5,
        certifications: ['ISO 27001'],
        complianceStandards: ['افتا'],
      },
      metadata: {
        lastVerified: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        sourceSystem: 'PIM',
        confidenceScore: 0.95,
        version: '1.0',
        changeLog: [],
      },
      seo: {
        title: 'سرور مجازی ایران | VPS پرسرعت - ابران سیستم',
        metaDescription: 'سرور مجازی ایران با پینگ پایین، SSD NVMe و پشتیبانی ۲۴/۷. از ۴۹۰,۰۰۰ تومان/ماه',
        canonicalUrl: 'https://abran.system/products/vps-iran',
        keywords: ['سرور مجازی ایران', 'VPS ایران', 'سرور مجازی پرسرعت', 'خرید VPS'],
        breadcrumbs: [
          { name: 'خانه', url: '/', position: 1 },
          { name: 'محصولات', url: '/products', position: 2 },
          { name: 'سرور مجازی ایران', url: '/products/vps-iran', position: 3 },
        ],
        schemaType: 'Product',
        aiCitationSource: 'abran-system-pim-v2',
        aiConfidence: 0.95,
      },
    },
    {
      id: 'product-gpu-a100',
      type: 'Product',
      canonicalName: 'سرور GPU A100',
      alternateNames: ['GPU Server', 'سرور هوش مصنوعی', 'A100 Server'],
      slug: 'gpu-a100',
      description: 'سرور GPU با کارت NVIDIA A100 برای آموزش و استنتاج مدل‌های هوش مصنوعی',
      relationships: [
        { targetId: 'brand-abran', targetType: 'Organization', relationType: 'BRAND', weight: 1.0 },
        { targetId: 'service-ai', targetType: 'Service', relationType: 'PART_OF', weight: 0.9 },
      ],
      attributes: {
        sku: 'GPU-A100-001',
        category: 'سرور GPU',
        price: { value: 50000000, currency: 'IRR', billingCycle: 'monthly' },
        stock: 10,
        region: 'europe',
        specs: { GPU: 'NVIDIA A100 80GB', CPU: '32 Core', RAM: '256 GB', Storage: '2 TB NVMe' },
        features: ['CUDA 12', 'NVLink', 'RDMA Network', 'Docker Ready'],
        compatibility: ['PyTorch', 'TensorFlow', 'JAX'],
        images: [],
        uptime: 99.5,
        certifications: ['NVIDIA Certified'],
        complianceStandards: [],
      },
      metadata: {
        lastVerified: new Date().toISOString(),
        createdAt: '2024-06-01T00:00:00Z',
        sourceSystem: 'PIM',
        confidenceScore: 0.92,
        version: '1.0',
        changeLog: [],
      },
      seo: {
        title: 'سرور GPU A100 | NVIDIA GPU Server - ابران سیستم',
        metaDescription: 'سرور GPU با NVIDIA A100 80GB برای هوش مصنوعی. مناسب آموزش مدل‌های LLM و Deep Learning',
        canonicalUrl: 'https://abran.system/products/gpu-a100',
        keywords: ['سرور GPU', 'NVIDIA A100', 'سرور هوش مصنوعی', 'GPU Server'],
        breadcrumbs: [
          { name: 'خانه', url: '/', position: 1 },
          { name: 'محصولات', url: '/products', position: 2 },
          { name: 'سرور GPU A100', url: '/products/gpu-a100', position: 3 },
        ],
        schemaType: 'Product',
        aiCitationSource: 'abran-system-pim-v2',
        aiConfidence: 0.92,
      },
    },
  ];

  products.forEach(p => kg.addEntity(p));

  // Service Entities
  const services: ServiceEntity[] = [
    {
      id: 'service-cloud',
      type: 'Service',
      canonicalName: 'خدمات ابری',
      alternateNames: ['Cloud Services', 'خدمات Cloud'],
      slug: 'cloud-services',
      description: 'مجموعه کامل خدمات ابری شامل VPS، سرور اختصاصی و ذخیره‌سازی',
      relationships: [
        { targetId: 'brand-abran', targetType: 'Organization', relationType: 'BRAND', weight: 1.0 },
        { targetId: 'product-vps-iran', targetType: 'Product', relationType: 'INCLUDES', weight: 0.9 },
      ],
      attributes: {
        serviceType: 'cloud',
        sla: { uptime: 99.99, responseTime: '< 15 دقیقه', supportHours: '24/7' },
        pricing: [
          { name: 'پایه', price: 490000, currency: 'IRR', billingCycle: 'ماه', features: ['۲ هسته CPU', '۴ گیگ RAM'] },
          { name: 'حرفه‌ای', price: 1490000, currency: 'IRR', billingCycle: 'ماه', features: ['۴ هسته CPU', '۸ گیگ RAM'], popular: true },
          { name: 'سازمانی', price: 3990000, currency: 'IRR', billingCycle: 'ماه', features: ['۸ هسته CPU', '۱۶ گیگ RAM'] },
        ],
        features: [
          { name: 'مقیاس‌پذیری آنی', description: 'تغییر منابع در لحظه', included: true },
          { name: 'پشتیبان‌گیری خودکار', description: 'بکاپ روزانه خودکار', included: true },
          { name: 'مانیتورینگ ۲۴/۷', description: 'پایش لحظه‌ای عملکرد', included: true },
        ],
        integrations: ['API RESTful', 'Terraform', 'Ansible'],
      },
      metadata: {
        lastVerified: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        sourceSystem: 'CMS',
        confidenceScore: 0.96,
        version: '1.0',
        changeLog: [],
      },
      seo: {
        title: 'خدمات ابری | Cloud Services - ابران سیستم',
        metaDescription: 'خدمات ابری کامل شامل سرور مجازی، اختصاصی و ذخیره‌سازی با SLA ۹۹.۹۹٪',
        canonicalUrl: 'https://abran.system/services/cloud',
        keywords: ['خدمات ابری', 'Cloud Services', 'سرور ابری', 'زیرساخت ابری'],
        breadcrumbs: [
          { name: 'خانه', url: '/', position: 1 },
          { name: 'خدمات', url: '/services', position: 2 },
          { name: 'خدمات ابری', url: '/services/cloud', position: 3 },
        ],
        schemaType: 'Service',
        aiCitationSource: 'abran-system-cms-v2',
        aiConfidence: 0.96,
      },
    },
    {
      id: 'service-ai',
      type: 'Service',
      canonicalName: 'خدمات هوش مصنوعی',
      alternateNames: ['AI Services', 'API هوش مصنوعی'],
      slug: 'ai-services',
      description: 'API‌های هوش مصنوعی شامل LLM، بینایی ماشین و پردازش زبان طبیعی',
      relationships: [
        { targetId: 'brand-abran', targetType: 'Organization', relationType: 'BRAND', weight: 1.0 },
        { targetId: 'product-gpu-a100', targetType: 'Product', relationType: 'USES', weight: 0.8 },
      ],
      attributes: {
        serviceType: 'ai',
        sla: { uptime: 99.9, responseTime: '< 1 ساعت', supportHours: '24/7' },
        pricing: [
          { name: 'شروع', price: 190000, currency: 'IRR', billingCycle: 'ماه', features: ['۱M توکن LLM'] },
          { name: 'توسعه‌دهنده', price: 690000, currency: 'IRR', billingCycle: 'ماه', features: ['۱۰M توکن LLM'], popular: true },
          { name: 'سازمانی', price: 2490000, currency: 'IRR', billingCycle: 'ماه', features: ['۱۰۰M توکن LLM'] },
        ],
        features: [
          { name: 'LLM فارسی', description: 'مدل زبانی بومی فارسی', included: true },
          { name: 'بینایی ماشین', description: 'OCR و تشخیص تصویر', included: true },
          { name: 'پردازش گفتار', description: 'تبدیل صدا به متن', included: true },
        ],
        integrations: ['REST API', 'Python SDK', 'JavaScript SDK'],
      },
      metadata: {
        lastVerified: new Date().toISOString(),
        createdAt: '2024-06-01T00:00:00Z',
        sourceSystem: 'CMS',
        confidenceScore: 0.94,
        version: '1.0',
        changeLog: [],
      },
      seo: {
        title: 'خدمات هوش مصنوعی | AI API Services - ابران سیستم',
        metaDescription: 'API‌های هوش مصنوعی شامل LLM فارسی، بینایی ماشین و پردازش گفتار',
        canonicalUrl: 'https://abran.system/services/ai',
        keywords: ['هوش مصنوعی', 'AI API', 'LLM فارسی', 'خدمات AI'],
        breadcrumbs: [
          { name: 'خانه', url: '/', position: 1 },
          { name: 'خدمات', url: '/services', position: 2 },
          { name: 'خدمات هوش مصنوعی', url: '/services/ai', position: 3 },
        ],
        schemaType: 'Service',
        aiCitationSource: 'abran-system-cms-v2',
        aiConfidence: 0.94,
      },
    },
  ];

  services.forEach(s => kg.addEntity(s));

  return kg;
}

// Singleton instance
export const knowledgeGraph = createSampleKnowledgeGraph();
