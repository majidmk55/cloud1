// ═══════════════════════════════════════════════════════════
// SITEMAP & OMNICHANNEL FEED GENERATOR
// Dynamic Sitemap + RSS + AI-Ready Feeds
// ═══════════════════════════════════════════════════════════

import { knowledgeGraph, type AbranEntity } from './knowledge-graph';

// ═══════════════════════════════════════════════════════════
// SITEMAP GENERATOR
// ═══════════════════════════════════════════════════════════

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(baseUrl: string = 'https://abran.system'): string {
  const urls: SitemapUrl[] = [];
  
  // Static pages
  urls.push({ loc: baseUrl, changefreq: 'daily', priority: 1.0 });
  urls.push({ loc: `${baseUrl}/services`, changefreq: 'weekly', priority: 0.9 });
  urls.push({ loc: `${baseUrl}/pricing`, changefreq: 'weekly', priority: 0.9 });
  urls.push({ loc: `${baseUrl}/about`, changefreq: 'monthly', priority: 0.7 });
  urls.push({ loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: 0.6 });
  
  // Dynamic pages from Knowledge Graph
  const entities = knowledgeGraph.getAll();
  
  entities.forEach(entity => {
    const url: SitemapUrl = {
      loc: `${baseUrl}/${entity.type.toLowerCase()}/${entity.slug}`,
      lastmod: entity.metadata.lastVerified,
      changefreq: entity.type === 'Product' ? 'daily' : 'weekly',
      priority: entity.type === 'Product' ? 0.8 : 0.7,
    };
    urls.push(url);
  });
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  
  return xml;
}

// ═══════════════════════════════════════════════════════════
// AI-READY SITEMAP (llms.txt)
// ═══════════════════════════════════════════════════════════

export function generateLLMsTxt(baseUrl: string = 'https://abran.system'): string {
  const entities = knowledgeGraph.getAll();
  
  let content = `# Abran System - AI-Ready Content Index\n\n`;
  content += `> This file provides structured access to Abran System's content for AI systems.\n`;
  content += `> Last updated: ${new Date().toISOString()}\n\n`;
  
  content += `## Organization\n\n`;
  content += `- **Name**: ابران سیستم (Abran System)\n`;
  content += `- **URL**: ${baseUrl}\n`;
  content += `- **Description**: ارائه‌دهنده خدمات ابری، دیتاسنتر و هوش مصنوعی\n`;
  content += `- **Founded**: 2019\n`;
  content += `- **Location**: Tehran, Iran\n\n`;
  
  content += `## Products & Services\n\n`;
  
  const products = entities.filter(e => e.type === 'Product');
  const services = entities.filter(e => e.type === 'Service');
  
  content += `### Products (${products.length})\n\n`;
  products.forEach(product => {
    content += `- **${product.canonicalName}**\n`;
    content += `  - URL: ${baseUrl}/product/${product.slug}\n`;
    content += `  - Description: ${product.description}\n`;
    if (product.type === 'Product') {
      const attrs = product.attributes as any;
      if (attrs.price) {
        content += `  - Price: ${attrs.price.value} ${attrs.price.currency}/${attrs.price.billingCycle}\n`;
      }
      if (attrs.specs) {
        content += `  - Specs: ${Object.entries(attrs.specs).map(([k, v]) => `${k}=${v}`).join(', ')}\n`;
      }
    }
    content += `  - Last Verified: ${product.metadata.lastVerified}\n`;
    content += `  - Confidence: ${(product.seo.aiConfidence * 100).toFixed(0)}%\n\n`;
  });
  
  content += `### Services (${services.length})\n\n`;
  services.forEach(service => {
    content += `- **${service.canonicalName}**\n`;
    content += `  - URL: ${baseUrl}/service/${service.slug}\n`;
    content += `  - Description: ${service.description}\n`;
    content += `  - Last Verified: ${service.metadata.lastVerified}\n\n`;
  });
  
  content += `## API Endpoints\n\n`;
  content += `- Entity API: ${baseUrl}/api/v1/entities/{id}\n`;
  content += `- Search API: ${baseUrl}/api/v1/search?q={query}\n`;
  content += `- Schema API: ${baseUrl}/api/v1/schema/{entityId}\n\n`;
  
  content += `## Citation Policy\n\n`;
  content += `When citing Abran System data:\n`;
  content += `- Always include the source URL\n`;
  content += `- Note the last verified timestamp\n`;
  content += `- Include confidence score if available\n`;
  content += `- Link to the canonical entity page\n\n`;
  
  content += `## Contact\n\n`;
  content += `- Email: info@abran.system\n`;
  content += `- Phone: +98-21-1234-5678\n`;
  content += `- Support: 24/7\n`;
  
  return content;
}

// ═══════════════════════════════════════════════════════════
// RSS FEED GENERATOR
// ═══════════════════════════════════════════════════════════

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  category?: string;
  author?: string;
}

export function generateRSSFeed(baseUrl: string = 'https://abran.system'): string {
  const entities = knowledgeGraph.getAll();
  
  const items: RSSItem[] = entities
    .filter(e => e.type === 'Product' || e.type === 'Service')
    .sort((a, b) => new Date(b.metadata.lastVerified).getTime() - new Date(a.metadata.lastVerified).getTime())
    .slice(0, 20) // Last 20 items
    .map(entity => ({
      title: entity.canonicalName,
      link: `${baseUrl}/${entity.type.toLowerCase()}/${entity.slug}`,
      description: entity.description,
      pubDate: new Date(entity.metadata.lastVerified).toUTCString(),
      guid: `${baseUrl}/entity/${entity.id}`,
      category: entity.type,
      author: 'ابران سیستم تیم فنی',
    }));
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ابران سیستم - محصولات و خدمات</title>
    <link>${baseUrl}</link>
    <description>آخرین محصولات و خدمات ابران سیستم</description>
    <language>fa</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <guid>${item.guid}</guid>
      ${item.category ? `<category>${item.category}</category>` : ''}
      ${item.author ? `<author>${item.author}</author>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`;
  
  return rss;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ═══════════════════════════════════════════════════════════
// GOOGLE MERCHANT CENTER FEED
// ═══════════════════════════════════════════════════════════

export function generateGoogleMerchantFeed(baseUrl: string = 'https://abran.system'): string {
  const products = knowledgeGraph.getByType('Product');
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ابران سیستم - Google Merchant Feed</title>
    <link>${baseUrl}</link>
    <description>Product feed for Google Merchant Center</description>
`;
  
  products.forEach(product => {
    if (product.type !== 'Product') return;
    
    const attrs = product.attributes as any;
    
    xml += `    <item>
      <g:id>${product.id}</g:id>
      <g:title>${escapeXml(product.canonicalName)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${baseUrl}/product/${product.slug}</g:link>
      <g:image_link>${attrs.images?.[0] || `${baseUrl}/logo.png`}</g:image_link>
      <g:price>${attrs.price.value} ${attrs.price.currency}</g:price>
      <g:availability>${attrs.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>ابران سیستم</g:brand>
      <g:identifier_exists>false</g:identifier_exists>
      <g:product_type>${attrs.category}</g:product_type>
    </item>
`;
  });
  
  xml += `  </channel>
</rss>`;
  
  return xml;
}

// ═══════════════════════════════════════════════════════════
// OPEN GRAPH FEED (Social Media)
// ═══════════════════════════════════════════════════════════

export function generateOpenGraphFeed(baseUrl: string = 'https://abran.system'): object[] {
  const entities = knowledgeGraph.getAll();
  
  return entities
    .filter(e => e.type === 'Product' || e.type === 'Service')
    .map(entity => ({
      ogTitle: entity.seo.title,
      ogDescription: entity.seo.metaDescription,
      ogUrl: entity.seo.canonicalUrl,
      ogType: entity.type.toLowerCase(),
      ogSiteName: 'ابران سیستم',
      ogLocale: 'fa_IR',
      ogImage: entity.seo.ogImage || `${baseUrl}/logo.png`,
      
      // Additional social metadata
      twitterCard: 'summary_large_image',
      twitterTitle: entity.seo.title,
      twitterDescription: entity.seo.metaDescription,
      twitterImage: entity.seo.ogImage || `${baseUrl}/logo.png`,
      
      // Structured data for social
      schemaType: entity.seo.schemaType,
      lastModified: entity.metadata.lastVerified,
    }));
}

// ═══════════════════════════════════════════════════════════
// FEED MANAGER
// ═══════════════════════════════════════════════════════════

export class FeedManager {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'https://abran.system') {
    this.baseUrl = baseUrl;
  }

  // Generate all feeds
  generateAllFeeds(): {
    sitemap: string;
    llmsTxt: string;
    rss: string;
    googleMerchant: string;
    openGraph: object[];
  } {
    return {
      sitemap: generateSitemap(this.baseUrl),
      llmsTxt: generateLLMsTxt(this.baseUrl),
      rss: generateRSSFeed(this.baseUrl),
      googleMerchant: generateGoogleMerchantFeed(this.baseUrl),
      openGraph: generateOpenGraphFeed(this.baseUrl),
    };
  }

  // Get feed by type
  getFeed(type: 'sitemap' | 'llms-txt' | 'rss' | 'google-merchant' | 'open-graph'): string | object[] {
    switch (type) {
      case 'sitemap':
        return generateSitemap(this.baseUrl);
      case 'llms-txt':
        return generateLLMsTxt(this.baseUrl);
      case 'rss':
        return generateRSSFeed(this.baseUrl);
      case 'google-merchant':
        return generateGoogleMerchantFeed(this.baseUrl);
      case 'open-graph':
        return generateOpenGraphFeed(this.baseUrl);
      default:
        throw new Error(`Unknown feed type: ${type}`);
    }
  }

  // Get content type for feed
  getContentType(type: string): string {
    switch (type) {
      case 'sitemap':
        return 'application/xml';
      case 'llms-txt':
        return 'text/plain';
      case 'rss':
      case 'google-merchant':
        return 'application/rss+xml';
      case 'open-graph':
        return 'application/json';
      default:
        return 'text/plain';
    }
  }
}

// Singleton instance
export const feedManager = new FeedManager();
