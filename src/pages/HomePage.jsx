import React from 'react';
import { BsPen, BsStack, BsLaptop, BsPrinter, BsBarChart, BsPhone } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero2.png';
import hero3 from '../assets/hero3.jpeg';
import '../styles/HeroAnimation.css'
import Footer from '../components/Footer';
import SEO from '../components/SEO';

// Reusable component for service cards
const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0015AA] text-white mx-auto">
      <Icon size={24} className="sm:w-8 sm:h-8" />
    </div>
    <h3 className="text-xl sm:text-2xl font-semibold text-[#0015AA] mt-4 sm:mt-6">{title}</h3>
    <p className="mt-2 text-sm sm:text-base text-gray-600">
      {description}
    </p>
  </div>
);

// Reusable component for process steps
const ProcessStep = ({ number, title, description, className = '' }) => (
  <div className={`w-full max-w-sm relative z-10 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gray-50 rounded-lg transform ${className} transition-transform duration-300 hover:rotate-0 hover:scale-105`}>
    <div className="bg-white p-6 rounded-lg fading-border-card relative">
      <h3 className="absolute top-4 right-4 text-xl font-bold text-[#0015AA]">{`0${number}`}</h3>
      <h4 className="text-2xl font-semibold text-[#0015AA] mt-2">{title}</h4>
      <p className="mt-2 text-gray-600">
        {description}
      </p>
    </div>
  </div>
);

const HomePage = () => {
  // AI-optimized structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // HowTo Schema for brand building process
      {
        "@type": "HowTo",
        "@id": "https://vistaforge.com/#howto-build-brand",
        "name": "How to Build a Successful Brand Identity",
        "description": "Complete guide to building a brand that stands out and connects with your audience",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Define Your Brand Strategy",
            "text": "Research your market, understand your audience, and develop your brand positioning and messaging.",
            "image": "https://vistaforge.com/strategy-step.jpg"
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Create Visual Identity",
            "text": "Design your logo, color palette, typography, and visual elements that represent your brand.",
            "image": "https://vistaforge.com/design-step.jpg"
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Build Digital Presence",
            "text": "Develop your website and digital assets that bring your brand to life online.",
            "image": "https://vistaforge.com/digital-step.jpg"
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Launch and Maintain",
            "text": "Launch your brand and maintain consistency across all touchpoints.",
            "image": "https://vistaforge.com/launch-step.jpg"
          }
        ],
        "supply": [
          {
            "@type": "HowToSupply",
            "name": "Brand Strategy Document"
          },
          {
            "@type": "HowToSupply",
            "name": "Logo Design Files"
          },
          {
            "@type": "HowToSupply",
            "name": "Brand Guidelines"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Adobe Creative Suite"
          },
          {
            "@type": "HowToTool",
            "name": "Figma"
          },
          {
            "@type": "HowToTool",
            "name": "WordPress"
          }
        ],
        "totalTime": "P8W"
      },

      // Enhanced Service schemas with AI-friendly details
      {
        "@type": "Service",
        "@id": "https://vistaforge.com/#logo-design-service",
        "name": "Professional Logo Design Services",
        "description": "Custom logo design that captures your brand's essence and creates lasting impressions. Our expert designers create logos that work across all mediums and platforms.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "Graphic Design",
        "category": "Brand Identity",
        "offers": {
          "@type": "Offer",
          "priceRange": "₵600 - ₵2000",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Ghana"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Logo Design Packages",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Basic Logo Package",
              "description": "Simple logo design with 3 concepts",
              "price": "600",
              "priceCurrency": "GHS"
            },
            {
              "@type": "Offer",
              "name": "Professional Logo Package",
              "description": "Complete logo design with brand guidelines",
              "price": "2000",
              "priceCurrency": "GHS"
            }
          ]
        }
      },

      {
        "@type": "Service",
        "@id": "https://vistaforge.com/#brand-identity-service",
        "name": "Complete Brand Identity Design",
        "description": "Full brand identity systems including logo, colors, typography, and brand guidelines. We create cohesive brand experiences that tell your story.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "Brand Strategy",
        "category": "Marketing",
        "offers": {
          "@type": "Offer",
          "priceRange": "₵2000 - ₵5000",
          "availability": "https://schema.org/InStock"
        }
      },

      {
        "@type": "Service",
        "@id": "https://vistaforge.com/#web-design-service",
        "name": "Custom Website Design & Development",
        "description": "Responsive, modern websites that convert visitors into customers. From simple business sites to complex e-commerce platforms.",
        "provider": {
          "@id": "https://vistaforge.com/#organization"
        },
        "serviceType": "Web Development",
        "category": "Digital Marketing",
        "offers": {
          "@type": "Offer",
          "priceRange": "₵1200 - ₵4500+",
          "availability": "https://schema.org/InStock"
        }
      },

      // AI-optimized FAQ schema
      {
        "@type": "FAQPage",
        "@id": "https://vistaforge.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much does a professional logo design cost in Ghana?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Professional logo design in Ghana typically costs between ₵600 to ₵2,000, depending on complexity and deliverables. Our packages include multiple concepts, revisions, and final files in all formats."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to create a complete brand identity?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "A complete brand identity project usually takes 4-8 weeks. This includes brand strategy (2 weeks), design development (2-4 weeks), and final implementation (1-2 weeks)."
            }
          },
          {
            "@type": "Question",
            "name": "Do you work with startups and small businesses?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Absolutely! We specialize in working with startups and small businesses in Ghana and across Africa. Our flexible packages and payment terms are designed to support growing businesses."
            }
          },
          {
            "@type": "Question",
            "name": "What makes VistaForge different from other design agencies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "VistaForge combines deep understanding of the African market with global design standards. We're not just designers – we're strategic partners invested in your business success."
            }
          },
          {
            "@type": "Question",
            "name": "Can you help with both branding and website development?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! We offer complete brand-to-digital solutions. Many clients choose us for both branding and web development to ensure perfect alignment between their visual identity and online presence."
            }
          },
          {
            "@type": "Question",
            "name": "Do you provide ongoing support after project completion?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we offer ongoing brand support including logo updates, additional marketing materials, brand guideline refreshes, and strategic consulting as your business grows."
            }
          }
        ]
      },

      // LocalBusiness schema for local SEO
      {
        "@type": "LocalBusiness",
        "@id": "https://vistaforge.com/#localbusiness",
        "name": "VistaForge Creative Agency",
        "description": "Leading brand design and web development agency in Accra, Ghana",
        "url": "https://vistaforge.com",
        "telephone": "+233-59-255-8160",
        "email": "hello@vistaforge.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "GH",
          "addressLocality": "Accra",
          "addressRegion": "Greater Accra"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "5.6037",
          "longitude": "-0.1870"
        },
        "openingHours": "Mo-Fr 09:00-18:00",
        "priceRange": "₵₵₵",
        "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "Mobile Money"],
        "currenciesAccepted": "GHS",
        "sameAs": [
          "https://linkedin.com/company/vistaforge",
          "https://instagram.com/vistaforge",
          "https://facebook.com/vistaforge"
        ]
      }
    ]
  };

  return (
    <>
      <SEO
        title="We Build Brands That Stand The Test of Time"
        description="Professional brand identity and web design agency. We craft memorable brands that drive business growth. Logo design, brand strategy, and stunning websites."
        keywords="brand design, logo design, web design, brand identity, graphic design, branding agency, creative agency, Ghana, Accra"
        image="/hero2.png"
        url="/"
        structuredData={homepageStructuredData}
      />
      <main className="bg-white" id="main-content">

      {/* Hero Section */}
      <section className="relative bg-[#0015AA] text-white py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8 overflow-hidden">
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/2 -left-20 w-48 h-48 bg-[#FBB03B] opacity-30 rotate-45 animate-spin-slow"></div>
          <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-blue-700 opacity-20 rounded-full animate-pulse-slow delay-200"></div>
          <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-white to-transparent opacity-15"></div>
        </div>
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-8 sm:gap-12 relative z-10">
          {/* Left Side: Text and Buttons */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              We Build Brands That Stand The Test of Time.
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
              From strategic vision to stunning visuals, we craft brands that connect, resonate, and grow. Let’s create something lasting.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Link
                to="/contact"
                className="px-6 sm:px-8 py-3 bg-[#FBB03B] text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#0015AA] text-sm sm:text-base text-center"
              >
                Start My Brand Journey
              </Link>
              <Link
                to="/portfolio"
                className="px-6 sm:px-8 py-3 text-white font-semibold rounded-md border-2 border-white hover:bg-white hover:text-[#0015AA] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0015AA] text-sm sm:text-base text-center"
              >
                View Our Work
              </Link>
            </div>
          </div>
          {/* Right Side: Image */}
          <div className="md:w-1/2">
            <img
              src={heroImage}
              alt="A team of brand strategists and designers collaborating on a new project."
              className="w-full h-auto rounded-xl  blend-left"
            />
          </div>
        </div>
      </section>

      {/* "We Craft Brands That Matter" Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Left Side: Image */}
          <div className="md:w-1/2">
            <img 
              src={hero3}
              alt="A creative team discussing a brand strategy plan in an office setting." 
              className="rounded-xl shadow-lg" 
            />
          </div>
          {/* Right Side: Text and Stats */}
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-[#0015AA]">We Craft Brands That Matter.</h2>
            <p className="mt-4 text-lg text-gray-700 max-w-lg">
              At Vista Forge, we believe every brand has a unique story to tell. Our team of creative strategists and designers work closely with you to uncover your brand's essence and transform it into a powerful visual identity.
            </p>
            <p className="mt-4 text-lg text-gray-700 max-w-lg">
              From logo design to complete brand systems, we ensure your brand not only looks great but also resonates with your target audience and supports your business goals.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="bg-gray-100 py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0015AA]">Our Services</h2>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            We offer comprehensive brand identity solutions to help your business make a lasting impression.
          </p>
        </div>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12">
          <ServiceCard
            icon={BsPen}
            title="Logo Design"
            description="Create memorable logos that capture your brand's personality and make a strong first impression across all touchpoints."
          />
          <ServiceCard
            icon={BsStack}
            title="Brand Identity"
            description="Develop complete brand systems including colors, typography, and visual elements that work seamlessly together."
          />
          <ServiceCard
            icon={BsLaptop}
            title="Web Design"
            description="Design beautiful, user-friendly websites that reflect your brand identity and convert visitors into customers."
          />
          <ServiceCard
            icon={BsPrinter}
            title="Print Design"
            description="Create stunning print materials including business cards, brochures, and packaging that extend your brand offline."
          />
          <ServiceCard
            icon={BsBarChart}
            title="Brand Strategy"
            description="Develop strategic positioning and messaging that differentiates your brand in the marketplace."
          />
          <ServiceCard
            icon={BsPhone}
            title="Digital Assets"
            description="Design social media templates, email headers, and other digital assets to maintain brand consistency online."
          />
        </div>
      </section>

      {/* Our Process Section */}
      <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#0015AA] opacity-15 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow delay-200"></div>
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-blue-700 opacity-15 rotate-45 animate-spin-slow"></div>
          <div className="absolute top-0 right-0 w-40 h-40 transform rotate-12 translate-x-1/2 -translate-y-1/2">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25L25 50L0 75L25 100" stroke="#FBB03B" strokeOpacity="0.1" strokeWidth="5" />
              <path d="M50 0L75 25L50 50L75 75L50 100" stroke="#FBB03B" strokeOpacity="0.1" strokeWidth="5" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-tl from-white to-transparent opacity-35"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold text-[#0015AA]">Let us show you how we drive your brand to new heights.</h2>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Our streamlined process ensures a collaborative and transparent journey from concept to launch. We’ll be with you every step of the way.
          </p>
        </div>
        <div className="container mx-auto mt-12 relative flex flex-col items-center space-y-8 z-10">
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>
          <ProcessStep
            number={1}
            title="Define"
            description="We start by deeply understanding your brand, your audience, and your goals. This phase is all about research, strategy, and setting the foundation for success."
            className="-rotate-1 md:mr-48"
          />
          <ProcessStep
            number={2}
            title="Design"
            description="This is where your vision takes shape. We create stunning visual identities, mockups, and prototypes that are not just beautiful but also strategic."
            className="rotate-2 md:ml-48"
          />
          <ProcessStep
            number={3}
            title="Build"
            description="Our development team brings the design to life, building a fast, responsive, and secure digital presence that performs flawlessly across all devices."
            className="-rotate-1 md:mr-48"
          />
          <ProcessStep
            number={4}
            title="Launch"
            description="The big moment! We carefully deploy your new brand and digital assets, and we continue to provide support and analytics to ensure your success."
            className="rotate-2 md:ml-48"
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#0015AA]">Why Choose Us?</h2>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            We don't just build brands; we build partnerships. Here's what sets us apart from the rest.
          </p>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 angled-border-card transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Expertise & Experience</h3>
            <p className="mt-2 text-gray-600">
              At VistaForge, we combine design and technology to create modern, scalable brands and websites. Our work draws on real-world tools like Illustrator, Photoshop, Figma, and React to deliver results that are both creative and functional.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 angled-border-card">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Strategic Vision</h3>
            <p className="mt-2 text-gray-600">
              Every project begins with understanding your goals and audience. We don’t just design; we solve problems by crafting identities and digital experiences that are clear, consistent, and built to grow with your business.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 angled-border-card">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Proven Process</h3>
            <h5 className="mt-2 font-semibold text-gray-600">We believe in transparency and collaboration. Clients receive:</h5>
            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
              <li className="text-gray-600">Clear timelines and milestones</li>
              <li className="text-gray-600">Regular updates and feedback loops</li>
              <li className="text-gray-600">Defined pricing packages no hidden costs</li>
              <li className="text-gray-600">A dedicated team invested in your success</li>
              <li className="text-gray-600">Final delivery of brand assets and websites</li>
            </ul>
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
          <h2 className="text-4xl font-bold">Ready to Transform Your Brand?</h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Let's build something remarkable together. We’re excited to hear about your vision.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Get a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
};

export default HomePage;