import React from 'react';
import { useSpring, animated } from 'react-spring';
import { BsPen, BsStack, BsLaptop, BsBarChart, BsPhone, BsTools, BsCashStack,BsBriefcase,BsRocket } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import aboutImage from '../assets/hero3.jpeg';
import '../styles/ServicesPage.css';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const ServicesPage = () => {
  const serviceSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 300,
    config: { tension: 120, friction: 14 }
  });

  // AI-optimized structured data for Services page
  const servicesStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // Comprehensive HowTo schema for the brand building process
      {
        "@type": "HowTo",
        "@id": "https://vistaforge.com/services#howto-brand-building",
        "name": "Complete Guide: How to Build a Professional Brand Identity",
        "description": "Step-by-step guide to creating a brand identity that drives business growth and customer loyalty",
        "image": "https://vistaforge.com/services-process.jpg",
        "totalTime": "P8W",
        "estimatedCost": {
          "@type": "MonetaryAmount",
          "currency": "GHS",
          "value": "2000"
        },
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Brand Strategy & Research",
            "text": "Conduct market research, define your target audience, analyze competitors, and develop your brand positioning and messaging strategy.",
            "image": "https://vistaforge.com/strategy-step.jpg",
            "url": "https://vistaforge.com/services#strategy"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Logo & Visual Identity Design",
            "text": "Create a memorable logo and develop your complete visual identity including colors, typography, and brand elements.",
            "image": "https://vistaforge.com/logo-step.jpg",
            "url": "https://vistaforge.com/services#logo"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Website & Digital Presence",
            "text": "Build a professional website and create digital assets that bring your brand to life online.",
            "image": "https://vistaforge.com/website-step.jpg",
            "url": "https://vistaforge.com/services#website"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Brand Implementation & Launch",
            "text": "Implement your brand across all touchpoints and launch with a comprehensive marketing strategy.",
            "image": "https://vistaforge.com/launch-step.jpg",
            "url": "https://vistaforge.com/services#launch"
          }
        ],
        "supply": [
          {
            "@type": "HowToSupply",
            "name": "Brand Strategy Document"
          },
          {
            "@type": "HowToSupply",
            "name": "Logo Design Files (AI, EPS, PNG, JPG, SVG)"
          },
          {
            "@type": "HowToSupply",
            "name": "Brand Guidelines Manual"
          },
          {
            "@type": "HowToSupply",
            "name": "Website Files and Assets"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Adobe Illustrator"
          },
          {
            "@type": "HowToTool",
            "name": "Adobe Photoshop"
          },
          {
            "@type": "HowToTool",
            "name": "Figma"
          },
          {
            "@type": "HowToTool",
            "name": "WordPress"
          }
        ]
      },

      // Enhanced Service schemas with detailed AI-friendly information
      {
        "@type": "Service",
        "@id": "https://vistaforge.com/services#brand-strategy",
        "name": "Brand Strategy & Positioning Services",
        "description": "Professional brand strategy development including market research, audience analysis, competitor analysis, brand positioning, messaging strategy, and brand architecture planning.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "Brand Strategy Consulting",
        "category": "Marketing Strategy",
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
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Brand Strategy Packages",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Foundation Strategy Package",
              "description": "Basic brand strategy for startups and small businesses",
              "price": "2000",
              "priceCurrency": "GHS",
              "priceValidUntil": "2025-12-31"
            },
            {
              "@type": "Offer",
              "name": "Comprehensive Strategy Package",
              "description": "Full brand strategy with market analysis and positioning",
              "price": "5000",
              "priceCurrency": "GHS",
              "priceValidUntil": "2025-12-31"
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "47",
          "bestRating": "5",
          "worstRating": "1"
        }
      },

      {
        "@type": "Service",
        "@id": "https://vistaforge.com/services#logo-design",
        "name": "Professional Logo Design & Visual Identity",
        "description": "Custom logo design and complete visual identity systems including color palettes, typography, brand guidelines, and usage standards.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "Graphic Design",
        "category": "Brand Identity",
        "areaServed": {
          "@type": "Country",
          "name": "Ghana"
        },
        "offers": {
          "@type": "Offer",
          "priceRange": "₵600 - ₵2000",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "89",
          "bestRating": "5",
          "worstRating": "1"
        }
      },

      {
        "@type": "Service",
        "@id": "https://vistaforge.com/services#web-development",
        "name": "Custom Website Design & Development",
        "description": "Responsive, modern website design and development using the latest technologies. From simple business sites to complex e-commerce platforms.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "Web Development",
        "category": "Digital Marketing",
        "areaServed": {
          "@type": "Country",
          "name": "Ghana"
        },
        "offers": {
          "@type": "Offer",
          "priceRange": "₵1200 - ₵4500+",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "63",
          "bestRating": "5",
          "worstRating": "1"
        }
      },

      {
        "@type": "Service",
        "@id": "https://vistaforge.com/services#ui-ux-design",
        "name": "UI/UX Design for Digital Products",
        "description": "User interface and experience design for websites, mobile apps, and digital products. Includes wireframes, prototypes, and high-fidelity designs.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "UX Design",
        "category": "Digital Design",
        "areaServed": {
          "@type": "Country",
          "name": "Ghana"
        },
        "offers": {
          "@type": "Offer",
          "priceRange": "₵1200 - ₵4500",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        }
      },

      {
        "@type": "Service",
        "@id": "https://vistaforge.com/services#social-media",
        "name": "Social Media Branding & Campaign Design",
        "description": "Complete social media branding including profile designs, post templates, campaign graphics, and brand-consistent content creation.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "Social Media Marketing",
        "category": "Digital Marketing",
        "areaServed": {
          "@type": "Country",
          "name": "Ghana"
        },
        "offers": {
          "@type": "Offer",
          "priceRange": "₵600 - ₵2000",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        }
      },

      // AI-optimized FAQ schema
      {
        "@type": "FAQPage",
        "@id": "https://vistaforge.com/services#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does professional logo design cost in Ghana?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Professional logo design in Ghana costs between ₵600 to ₵2,000 depending on complexity and deliverables. Our packages include multiple concepts, unlimited revisions, and all file formats needed for print and digital use."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to complete a brand identity project?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A complete brand identity project typically takes 4-8 weeks. This includes brand strategy (2 weeks), design development (2-4 weeks), and final implementation (1-2 weeks). Rush orders are available for an additional fee."
            }
          },
          {
            "@type": "Question",
            "name": "Do you work with startups and small businesses?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! We specialize in working with startups and small businesses in Ghana and across Africa. Our flexible packages and payment terms are designed to support growing businesses with limited budgets."
            }
          },
          {
            "@type": "Question",
            "name": "What makes VistaForge different from other design agencies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "VistaForge combines deep understanding of the African market with global design standards. We're not just designers – we're strategic partners invested in your business success, offering end-to-end brand solutions."
            }
          },
          {
            "@type": "Question",
            "name": "Can you handle both branding and website development?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! We offer complete brand-to-digital solutions. Many clients choose us for both branding and web development to ensure perfect alignment between their visual identity and online presence."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide training on how to use the brand assets?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all our packages include brand usage training and guidelines. We provide comprehensive brand manuals and offer optional training sessions to ensure your team can effectively use and maintain brand consistency."
            }
          },
          {
            "@type": "Question",
            "name": "What file formats do you provide for logo designs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide logos in all necessary formats: vector files (AI, EPS, SVG) for scalability, raster files (PNG, JPG) for web use, and specialized formats for embroidery, signage, and other applications."
            }
          }
        ]
      },

      // CreativeWork schema for the services guide
      {
        "@type": "CreativeWork",
        "@id": "https://vistaforge.com/services#services-guide",
        "name": "VistaForge Services Guide",
        "description": "Complete guide to VistaForge's brand design and web development services",
        "author": {
          "@id": "https://vistaforge.com/#organization"
        },
        "publisher": {
          "@id": "https://vistaforge.com/#organization"
        },
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "about": [
          {
            "@type": "Thing",
            "name": "Brand Design"
          },
          {
            "@type": "Thing",
            "name": "Logo Design"
          },
          {
            "@type": "Thing",
            "name": "Web Development"
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEO
        title="Our Services - Brand Design, Logo Design & Web Development"
        description="Explore VistaForge's comprehensive brand design and web development services. From logo design to full brand identity and stunning websites, we help businesses stand out."
        keywords="brand design services, logo design, web development, brand identity, graphic design, creative services, Ghana design agency, UI/UX design"
        image="/hero2.png"
        url="/services"
        section="Services"
        structuredData={servicesStructuredData}
      />
      <main className="bg-white" id="main-content">
      {/* Hero Section with Subtle Shapes */}
      <section className="relative bg-[#0015AA] text-white py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large Yellow Circle (top-left) */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow"></div>
          {/* Medium Blue Square (bottom-right) */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-700 opacity-20 rotate-45 animate-spin-slow"></div>
          {/* Small Yellow Circle (center-right) */}
          <div className="absolute top-1/4 right-0 w-24 h-24 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow delay-300"></div>
          {/* Abstract Wave/Shape (bottom-left) */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-white to-transparent opacity-15"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Build Your Brand From Vision to Impact.
          </h1>
          <p className="mt-6 text-lg max-w-3xl mx-auto">
            We provide a complete suite of branding services, from crafting a powerful visual identity to developing a website that performs. We handle everything so you can focus on growing your business.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Main Services Sections with Pricing */}
      <section className="bg-white py-20 px-4 sm:px-6 ">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#0015AA]">Our Services in Detail</h2>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            A successful brand is built on a solid foundation of strategy, design, and seamless execution. We specialize in building all three.
          </p>
        </div>

        {/* Service 1: Brand Strategy & Positioning */}
        <animated.div style={serviceSpring}>
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 py-16">
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0015AA] to-[#003366] opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#FBB03B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BsStack size={40} className="text-[#0015AA]" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Strategy</h3>
                    <p className="text-gray-200 text-sm">Building Foundations</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl mr-1.5 font-bold text-[#0015AA]">Brand Strategy & Positioning</h3>
              <p className="mt-4 text-lg text-gray-700">
                Before any design begins, we dive deep into your business—market research, competitor analysis, and crafting your brand story, mission, and values. This becomes your strategic blueprint, ensuring your brand isn’t just visually appealing but also cohesive and resonant with your audience.
              </p>
              <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-xl font-bold text-[#0015AA] flex items-center">
                  <BsCashStack className="mr-2 text-[#FBB03B]" /> Pricing: <span className="ml-2">₵2,000 – ₵5,000</span>
                </h4>
                <p className="text-sm mt-2 text-gray-600">
                  <span className="font-semibold">₵2,000:</span> For foundational strategy (e.g., startups needing only messaging and values).<br />
                  <span className="font-semibold">₵5,000:</span> For full brand strategy documents, audience personas, and launch consulting.
                </p>
              </div>
            </div>
          </div>
        </animated.div>

        {/* Service 2: Logo & Visual Identity Design */}
        <animated.div style={serviceSpring}>
          <div className="container w-full flex flex-col lg:flex-row-reverse items-center gap-12 py-16 bg-gray-50 rounded-lg">
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FBB03B] to-[#E0A030] opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#0015AA] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BsPen size={40} className="text-[#FBB03B]" />
                    </div>
                    <h3 className="text-[#0015AA] text-xl font-bold mb-2">Design</h3>
                    <p className="text-[#0015AA] text-sm">Creating Identity</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-[#0015AA]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#0015AA] font-bold text-lg">2</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl ml-6 font-bold text-[#0015AA]">Logo & Visual Identity Design</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Custom logo design with multiple concepts, refined typography, color palette, and usage guidelines. Includes mockups for stationery and basic brand materials.
              </p>
              <div className="bg-white ml-6 p-6 rounded-lg mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-xl font-bold text-[#0015AA] flex items-center">
                  <BsCashStack className="mr-2 text-[#FBB03B]" /> Pricing: <span className="ml-2">₵600 – ₵2,000</span>
                </h4>
                <p className="text-sm mt-2 text-gray-600">
                  <span className="font-semibold">₵600:</span> Simple logo + color/font suggestions.<br />
                  <span className="font-semibold">₵2,000:</span> Full identity kit with logo variations, guidelines, and mockups.
                </p>
              </div>
            </div>
          </div>
        </animated.div>

        {/* Service 3: Website Design & Development */}
        <animated.div style={serviceSpring}>
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 py-16">
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0015AA] to-[#003366] opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#FBB03B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BsLaptop size={40} className="text-[#0015AA]" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Develop</h3>
                    <p className="text-gray-200 text-sm">Bringing to Life</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl ml-6 font-bold text-[#0015AA]">Website Design & Development</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Responsive, professional website custom-built or with WordPress/CMS. Includes domain, hosting, basic SEO, and mobile compatibility.
              </p>
              <div className="ml-6 bg-gray-100 p-6 rounded-lg mt-6 shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-xl font-bold text-[#0015AA] flex items-center">
                  <BsCashStack className="mr-2 text-[#FBB03B]" /> Pricing: <span className="ml-2">₵1,200 – ₵4,500+</span>
                </h4>
                <p className="text-sm mt-2 text-gray-600">
                  <span className="font-semibold">₵1,200–₵2,800:</span> 4-page business site, perfect for startups.<br />
                  <span className="font-semibold">₵3,500 – ₵4,500+:</span> Multi-page corporate or e-commerce websites.
                </p>
              </div>
            </div>
          </div>
        </animated.div>

        {/* Service 4: UI/UX Design for Apps & Digital Products */}
        {/* Service 4: UI/UX Design for Apps & Digital Products */}
        <animated.div style={serviceSpring}>
          <div className="w-full flex flex-col lg:flex-row-reverse items-center gap-12 py-16 bg-gray-50 rounded-lg">
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FBB03B] to-[#E0A030] opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#0015AA] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BsPhone size={40} className="text-[#FBB03B]" />
                    </div>
                    <h3 className="text-[#0015AA] text-xl font-bold mb-2">Digital</h3>
                    <p className="text-[#0015AA] text-sm">Interactive Experience</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-[#0015AA]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#0015AA] font-bold text-lg">4</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl ml-6 font-bold text-[#0015AA]">UI/UX Design for Apps & Digital Products</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Wireframes, high-fidelity UI designs, and user flow prototypes using tools like Figma. Tailored to enhance usability and conversion.
              </p>
              <div className="ml-6 bg-white p-6 rounded-lg mt-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-xl font-bold text-[#0015AA] flex items-center">
                  <BsCashStack className="mr-2 text-[#FBB03B]" /> Pricing: <span className="ml-2">₵1,200 – ₵4,500</span>
                </h4>
                <p className="text-sm mt-2 text-gray-600">
                  <span className="font-semibold">₵1,200:</span> Short prototypes or 3–5 screen designs.<br />
                  <span className="font-semibold">₵4,500:</span> Full UI kit for a mid-sized web or mobile app.
                </p>
              </div>
            </div>
          </div>
        </animated.div>

        {/* Service 5: Social Media Branding & Campaigns */}
        <animated.div style={serviceSpring}>
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 py-16">
            <div className="w-full lg:w-1/2">
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0015AA] to-[#003366] opacity-90"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#FBB03B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BsBarChart size={40} className="text-[#0015AA]" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Social</h3>
                    <p className="text-gray-200 text-sm">Brand Engagement</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">5</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="ml-6 text-3xl font-bold text-[#0015AA]">Social Media Branding & Campaigns</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Branded post templates, banners, campaign graphics, and design strategy for consistent presence across platforms.
              </p>
              <div className="ml-6 bg-gray-100 p-6 rounded-lg mt-6 shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-xl font-bold text-[#0015AA] flex items-center">
                  <BsCashStack className="mr-2 text-[#FBB03B]" /> Pricing: <span className="ml-2">₵600 – ₵2,000 per campaign</span>
                </h4>
                <p className="text-sm mt-2 text-gray-600">
                  <span className="font-semibold">₵600:</span> Basic social media kit (profile, 5–10 posts).<br />
                  <span className="font-semibold">₵2,000:</span> Full campaign package with strategy, graphics, and ad templates.
                </p>
              </div>
            </div>
          </div>
        </animated.div>
      </section>


      {/* NEW SECTION: About Us / Our Approach */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Side: Image with a new message */}
          <div className="md:w-1/2 relative flex justify-center items-center about-image-mask">
            <img
              src={aboutImage}
              alt="Two team members discussing a project"
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
            {/* New message circle for a startup agency */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-6 shadow-xl text-center">
              <h3 className="text-3xl font-bold text-[#FBB03B]">Fresh</h3>
              <p className="text-sm text-gray-700 font-semibold mt-1">Perspective</p>
            </div>
          </div>

          {/* Right Side: Text and Service Highlights */}
          <div className="md:w-1/2">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">WHO WE ARE</p>
            <h2 className="text-4xl font-bold text-[#0015AA] mt-2">Driven by passion, focused on results.</h2>
            <p className="mt-4 text-lg text-gray-700">
              At Vista Forge, our small but dedicated team is passionate about building brands that make an impact. We bring a fresh perspective and modern strategies to every project, ensuring your brand stands out in today's competitive landscape. We're committed to your success, and our nimble size means we're incredibly responsive and client-focused.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start">
                <BsBriefcase className="text-[#0015AA] text-2xl mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-[#0015AA]">Modern Marketing</h3>
                  <p className="text-gray-600">Comprehensive strategies to enhance your online presence and reach your target audience effectively.</p>
                </div>
              </div>
              <div className="flex items-start">
                <BsRocket className="text-[#0015AA] text-2xl mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-[#0015AA]">Agile SEO Services</h3>
                  <p className="text-gray-600">Optimizing your digital content to rank higher in search results, driving organic traffic and visibility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action Section */}
      <section className="relative bg-[#0015AA] text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Background Designs */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FBB03B] opacity-20 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-700 opacity-15 rotate-45 animate-spin-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce-slow"></div>
          <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 0 C150 50, 200 100, 100 200 C0 100, 50 50, 100 0" stroke="#FBB03B" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <h2 className="text-4xl font-bold">Ready to Elevate Your Brand?</h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Book a free consultation today, and let's discuss how we can bring your vision to life.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Book Your Free Call
          </Link>
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
};

export default ServicesPage;