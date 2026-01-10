/**
 * Generate structured data (JSON-LD) schemas for pages
 */

export interface Breadcrumb {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Build breadcrumb schema
 */
export function buildBreadcrumbSchema(breadcrumbs: Breadcrumb[]): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Build FAQ schema
 */
export function buildFAQSchema(faqItems: FAQItem[]): object {
  return {
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Build page schema with breadcrumbs
 */
export function buildPageSchema(
  pageUrl: string,
  title: string,
  description: string,
  lang: string,
  breadcrumbs?: Breadcrumb[],
  faq?: FAQItem[]
): object {
  const graph: any[] = [
    {
      '@type': 'Organization',
      '@id': 'https://flickai.net/#organization',
      name: 'FlickAI',
      url: 'https://flickai.net/',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://flickai.net/#website',
      url: 'https://flickai.net/',
      name: 'FlickAI',
      publisher: { '@id': 'https://flickai.net/#organization' },
    },
    {
      '@type': 'WebPage',
      '@id': pageUrl,
      url: pageUrl,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { '@id': 'https://flickai.net/#website' },
      publisher: { '@id': 'https://flickai.net/#organization' },
    },
  ];

  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push(buildBreadcrumbSchema(breadcrumbs));
  }

  if (faq && faq.length > 0) {
    graph.push(buildFAQSchema(faq));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

/**
 * Build software application schema
 */
export function buildSoftwareApplicationSchema(
  name: string,
  description: string
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description,
    url: 'https://flickai.net/',
  };
}

/**
 * Extract FAQ items from translation object
 */
export function extractFAQItems(faq: any): FAQItem[] {
  if (!faq || typeof faq !== 'object') return [];
  
  const items: FAQItem[] = [];
  const qKeys = Object.keys(faq).filter(k => /^q\d+$/.test(k)).sort((a, b) => {
    const ai = Number(a.slice(1));
    const bi = Number(b.slice(1));
    return ai - bi;
  });

  for (const qKey of qKeys) {
    const index = qKey.slice(1);
    const aKey = `a${index}`;
    const question = faq[qKey];
    const answer = faq[aKey];
    if (typeof question === 'string' && question.trim() && typeof answer === 'string' && answer.trim()) {
      items.push({ question: question.trim(), answer: answer.trim() });
    }
  }
  
  return items;
}
