// ═══════════════════════════════════════════════════════════
// DYNAMIC STRUCTURED DATA GENERATION ENGINE
// Schema.org JSON-LD Generator Pipeline
// ═══════════════════════════════════════════════════════════

import type { AbranEntity, ProductEntity, ServiceEntity } from './knowledge-graph';

// ═══════════════════════════════════════════════════════════
// SCHEMA.ORG TYPES
// ═══════════════════════════════════════════════════════════

export type SchemaType = 
  | 'Product'
  | 'Service'
  | 'Organization'
  | 'FAQPage'
  | 'BreadcrumbList'
  | 'WebSite'
  | 'WebPage'
  | 'Article'
  | 'Person'
  | 'Review'
  | 'Offer'
  | 'AggregateRating';

// ═══════════════════════════════════════════════════════════
// BASE SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════

export interface SchemaContext {
  baseUrl: string;
  organizationName: string;
  organizationUrl: string;
  logoUrl: string;
  defaultCurrency: string;
}

const DEFAULT_CONTEXT: SchemaContext = {
  baseUrl: 'https://abran.system',
  organizationName: 'ابران سیستم',
  organizationUrl: 'https://abran.system',
  logoUrl: 'https://abran.system/logo.png',
  defaultCurrency: 'IRR',
};

// ═══════════════════════════════════════════════════════════
// PRODUCT SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════

export function generateProductSchema(entity: ProductEntity, context: SchemaContext = DEFAULT_CONTEXT): object {
  const { attributes, seo, metadata } = entity;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${context.baseUrl}/entity/${entity.id}`,
    name: entity.canonicalName,
    description: entity.description,
    sku: attributes.sku,
    image: attributes.images.length > 0 ? attributes.images : [context.logoUrl],
    
    brand: {
      '@type': 'Brand',
      name: context.organizationName,
    },
    
    offers: {
      '@type': 'Offer',
      url: seo.canonicalUrl,
      priceCurrency: attributes.price.currency,
      price: attributes.price.value,
      priceValidUntil: metadata.lastVerified,
      availability: attributes.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: context.organizationName,
      },
    },
    
    // E-E-A-T: Citation metadata
    citation: {
      '@type': 'CreativeWork',
      datePublished: metadata.createdAt,
      dateModified: metadata.lastVerified,
      author: {
        '@type': 'Organization',
        name: `${context.organizationName} Technical Team`,
      },
    },
    
    // Additional properties
    category: attributes.category,
    additionalProperty: Object.entries(attributes.specs).map(([name, value]) => ({
      '@type': 'PropertyValue',
      name,
      value: String(value),
    })),
    
    // AI Citation Tags
    'ai-citation-source': seo.aiCitationSource,
    'ai-confidence-score': seo.aiConfidence,
  };
}

// ═══════════════════════════════════════════════════════════
// SERVICE SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════

export function generateServiceSchema(entity: ServiceEntity, context: SchemaContext = DEFAULT_CONTEXT): object {
  const { attributes, seo, metadata } = entity;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${context.baseUrl}/entity/${entity.id}`,
    name: entity.canonicalName,
    description: entity.description,
    provider: {
      '@type': 'Organization',
      name: context.organizationName,
      url: context.organizationUrl,
    },
    serviceType: attributes.serviceType,
    areaServed: {
      '@type': 'Country',
      name: 'Iran',
    },
    
    offers: attributes.pricing.map(tier => ({
      '@type': 'Offer',
      name: tier.name,
      price: tier.price,
      priceCurrency: tier.currency,
      priceValidUntil: metadata.lastVerified,
      availability: 'https://schema.org/InStock',
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitText: tier.billingCycle,
      },
    })),
    
    // SLA information
    serviceOutput: {
      '@type': 'ServiceChannel',
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: '+98-21-1234-5678',
        contactType: 'customer support',
        availableLanguage: ['Persian', 'English'],
      },
    },
    
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${entity.canonicalName} Pricing Plans`,
      itemListElement: attributes.pricing.map((tier, index) => ({
        '@type': 'Offer',
        position: index + 1,
        name: tier.name,
        price: tier.price,
        priceCurrency: tier.currency,
      })),
    },
    
    // E-E-A-T
    citation: {
      '@type': 'CreativeWork',
      datePublished: metadata.createdAt,
      dateModified: metadata.lastVerified,
      author: {
        '@type': 'Organization',
        name: `${context.organizationName} Technical Team`,
      },
    },
  };
}

// ═══════════════════════════════════════════════════════════
// ORGANIZATION SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════

export function generateOrganizationSchema(context: SchemaContext = DEFAULT_CONTEXT): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': context.organizationUrl,
    name: context.organizationName,
    url: context.organizationUrl,
    logo: context.logoUrl,
    description: 'ارائه‌دهنده خدمات ابری، دیتاسنتر و هوش مصنوعی',
    
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-21-1234-5678',
      contactType: 'customer service',
      email: 'info@abran.system',
      availableLanguage: ['Persian', 'English'],
    },
    
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressLocality: 'Tehran',
    },
    
    sameAs: [
      'https://twitter.com/abransystem',
      'https://linkedin.com/company/abransystem',
      'https://github.com/abransystem',
    ],
    
    // E-E-A-T: Trust signals
    foundingDate: '2019',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 50,
      unitText: 'employees',
    },
  };
}

// ═══════════════════════════════════════════════════════════
// BREADCRUMB SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>, context: SchemaContext = DEFAULT_CONTEXT): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${context.baseUrl}${item.url}`,
    })),
  };
}

// ═══════════════════════════════════════════════════════════
// FAQ SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ═══════════════════════════════════════════════════════════
// WEBSITE SCHEMA GENERATOR
// ═══════════════════════════════════════════════════════════

export function generateWebSiteSchema(context: SchemaContext = DEFAULT_CONTEXT): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${context.baseUrl}/#website`,
    url: context.baseUrl,
    name: context.organizationName,
    description: 'ارائه‌دهنده خدمات ابری، دیتاسنتر و هوش مصنوعی',
    publisher: {
      '@id': `${context.baseUrl}/#organization`,
    },
    inLanguage: 'fa-IR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${context.baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ═══════════════════════════════════════════════════════════
// SCHEMA VALIDATOR
// ═══════════════════════════════════════════════════════════

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateSchema(schema: object): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const schemaObj = schema as any;

  // Required fields
  if (!schemaObj['@context']) {
    errors.push('Missing @context');
  }
  if (!schemaObj['@type']) {
    errors.push('Missing @type');
  }

  // Type-specific validation
  if (schemaObj['@type'] === 'Product') {
    if (!schemaObj.name) errors.push('Product missing name');
    if (!schemaObj.offers) errors.push('Product missing offers');
    if (!schemaObj.description) warnings.push('Product missing description');
  }

  if (schemaObj['@type'] === 'Organization') {
    if (!schemaObj.name) errors.push('Organization missing name');
    if (!schemaObj.url) errors.push('Organization missing url');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ═══════════════════════════════════════════════════════════
// SCHEMA INJECTOR (for React components)
// ═══════════════════════════════════════════════════════════

export function injectSchema(schema: object): string {
  const validation = validateSchema(schema);
  
  if (!validation.valid) {
    console.error('[Schema] Invalid schema:', validation.errors);
    return '';
  }

  if (validation.warnings.length > 0) {
    console.warn('[Schema] Schema warnings:', validation.warnings);
  }

  return JSON.stringify(schema, null, 2);
}
