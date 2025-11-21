import { Helmet } from 'react-helmet-async';
import { APP_ENV } from '../api/config';

const SEO = ({
  title,
  description,
  keywords,
  image = '/logo.svg',
  url,
  type = 'website',
  author = 'VistaForge Agency',
  published,
  modified,
  section,
  tags,
  structuredData
}) => {
  const siteName = 'VistaForge';
  const defaultDescription = 'VistaForge is a creative agency helping startups and businesses build powerful brands through logo design, websites, and digital strategies.';
  const defaultKeywords = 'VistaForge, branding agency, logo design, web design, digital strategy, creative agency, Ghana startups, business growth';

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | Branding, Web Design & Digital Strategy Agency`;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image.startsWith('http') ? image : `https://vistaforge.com${image}`;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://vistaforge.com');

  // Enhanced organization schema for AI search
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://vistaforge.com/#organization",
    "name": "VistaForge",
    "alternateName": "VistaForge Creative Agency",
    "url": "https://vistaforge.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vistaforge.com/logo.svg",
      "width": 200,
      "height": 60
    },
    "description": defaultDescription,
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Ama Boateng",
        "jobTitle": "Co-Founder & Lead Strategist"
      },
      {
        "@type": "Person",
        "name": "Kofi Mensah",
        "jobTitle": "Co-Founder & Creative Director"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GH",
      "addressRegion": "Greater Accra",
      "addressLocality": "Accra",
      "postalCode": "00233"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+233-59-255-8160",
        "contactType": "customer service",
        "email": "hello@vistaforge.com",
        "availableLanguage": ["English"]
      },
      {
        "@type": "ContactPoint",
        "url": "https://vistaforge.com/contact",
        "contactType": "sales",
        "email": "hello@vistaforge.com"
      }
    ],
    "sameAs": [
      "https://linkedin.com/company/vistaforge",
      "https://instagram.com/vistaforge",
      "https://twitter.com/vistaforge",
      "https://facebook.com/vistaforge"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "VistaForge Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Brand Strategy & Positioning",
            "description": "Strategic brand positioning and messaging development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Logo Design",
            "description": "Custom logo design and visual identity"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Development",
            "description": "Responsive website design and development"
          }
        }
      ]
    },
    "knowsAbout": [
      "Brand Design",
      "Logo Design",
      "Web Development",
      "Digital Marketing",
      "UI/UX Design",
      "Brand Strategy",
      "Creative Design",
      "Ghana Business",
      "African Startups"
    ],
    "areaServed": [
      {
        "@type": "Country",
        "name": "Ghana"
      },
      {
        "@type": "Place",
        "name": "West Africa"
      }
    ],
    "priceRange": "₵₵₵",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "Mobile Money"],
    "currenciesAccepted": "GHS"
  };

  // Breadcrumb structured data
  const breadcrumbSchema = section ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://vistaforge.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": section,
        "item": canonicalUrl
      }
    ]
  } : null;

  // Enhanced WebPage schema for AI search
  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    "url": canonicalUrl,
    "name": fullTitle,
    "description": metaDescription,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://vistaforge.com/#website",
      "url": "https://vistaforge.com",
      "name": siteName,
      "publisher": {
        "@id": "https://vistaforge.com/#organization"
      }
    },
    "about": {
      "@id": "https://vistaforge.com/#organization"
    },
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": metaImage
    },
    "datePublished": published || "2024-01-01",
    "dateModified": modified || published || new Date().toISOString().split('T')[0],
    "author": {
      "@type": "Organization",
      "name": siteName,
      "@id": "https://vistaforge.com/#organization"
    },
    "publisher": {
      "@id": "https://vistaforge.com/#organization"
    },
    "potentialAction": [
      {
        "@type": "ReadAction",
        "target": [canonicalUrl]
      },
      {
        "@type": "CommunicateAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://vistaforge.com/contact",
          "inLanguage": "en-US",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        }
      }
    ],
    "mainEntity": section ? {
      "@type": "SiteNavigationElement",
      "name": section,
      "url": canonicalUrl
    } : undefined,
    "breadcrumb": breadcrumbSchema ? {
      "@id": `${canonicalUrl}#breadcrumb`
    } : undefined
  };

  // Article structured data for blog/news pages
  const articleSchema = type === 'article' && published ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": metaDescription,
    "image": metaImage,
    "datePublished": published,
    "dateModified": modified || published,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": "https://vistaforge.com/logo.svg"
      }
    }
  } : null;

  // Combine all structured data
  const allSchemas = [
    organizationSchema,
    webpageSchema,
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ...(articleSchema ? [articleSchema] : []),
    ...(structuredData ? [structuredData] : [])
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={APP_ENV === 'production' ? 'index, follow' : 'noindex, nofollow'} />
      <meta name="language" content="English" />
      <meta name="geo.region" content="GH-AA" />
      <meta name="geo.country" content="Ghana" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />

      {/* Article specific meta tags */}
      {published && <meta property="article:published_time" content={published} />}
      {modified && <meta property="article:modified_time" content={modified} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags && tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* AI Search Optimization Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* AI Content Understanding */}
      <meta name="article:author" content={author} />
      <meta name="article:publisher" content="https://vistaforge.com" />
      <meta name="article:section" content={section || "Business"} />
      <meta name="article:tag" content={tags ? tags.join(", ") : keywords} />

      {/* Knowledge Graph & Entity Relationships */}
      <meta name="organization" content="VistaForge Creative Agency" />
      <meta name="location" content="Accra, Ghana" />
      <meta name="industry" content="Creative Design, Branding, Web Development" />
      <meta name="target-audience" content="Startups, SMEs, Entrepreneurs, Businesses in Ghana and Africa" />

      {/* Conversational AI Keywords */}
      <meta name="conversational-keywords" content="how to build a brand, brand design services, logo design company, web development Ghana, creative agency Accra, brand strategy help" />

      {/* AI Search Intent */}
      <meta name="search-intent" content="commercial, transactional, informational" />
      <meta name="content-type" content={type === 'article' ? 'article' : 'business-page'} />
      <meta name="business-type" content="B2B, B2C, Creative Services" />

      {/* Enhanced Social & Technical */}
      <meta name="theme-color" content="#0015AA" />
      <meta name="msapplication-TileColor" content="#0015AA" />
      <meta name="application-name" content="VistaForge" />

      {/* AI-Friendly Content Hints */}
      <meta name="content-language" content="en-US" />
      <meta name="content-rating" content="general" />
      <meta name="content-type" content="text/html; charset=UTF-8" />
      <meta name="generator" content="VistaForge CMS" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(allSchemas)}
      </script>
    </Helmet>
  );
};

export default SEO;