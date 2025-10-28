import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BsPen, BsStack, BsLaptop, BsPrinter, BsBarChart, BsPhone } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero2.png';
import hero3 from '../assets/hero3.jpeg';
import '../styles/HeroAnimation.css'

// Reusable component for service cards
const ServiceCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 transition-transform duration-300">
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VistaForge",
    "url": "https://vistaforge.com",
    "logo": "https://vistaforge.com/logo.svg",
    "description": "We Build Brands That Stand The Test of Time. From strategic vision to stunning visuals, we craft brands that connect, resonate, and grow.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Ghana",
      "addressLocality": "Accra"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+233-59-255-8160",
      "contactType": "customer service",
      "email": "hello@vistaforge.com"
    },
    "sameAs": [
      "https://facebook.com/vistaforge",
      "https://twitter.com/vistaforge",
      "https://instagram.com/vistaforge",
      "https://linkedin.com/company/vistaforge"
    ]
  };

  return (
    <main className="bg-white" id="main-content">
      <Helmet>
        <title>VistaForge - We Build Brands That Stand The Test of Time</title>
        <meta name="description" content="Professional brand identity and web design agency. We craft memorable brands that drive business growth. Logo design, brand strategy, and stunning websites." />
        <meta name="keywords" content="brand design, logo design, web design, brand identity, graphic design, branding agency, creative agency, Ghana" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vistaforge.com/" />
        <meta property="og:title" content="VistaForge - Professional Brand Design & Web Development" />
        <meta property="og:description" content="We craft memorable brands that drive business growth. From strategic vision to stunning visuals, we create brands that connect and resonate." />
        <meta property="og:image" content="https://vistaforge.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="VistaForge" />
        <meta property="og:locale" content="en_US" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vistaforge.com/" />
        <meta property="twitter:title" content="VistaForge - Professional Brand Design & Web Development" />
        <meta property="twitter:description" content="We craft memorable brands that drive business growth. From strategic vision to stunning visuals, we create brands that connect and resonate." />
        <meta property="twitter:image" content="https://vistaforge.com/twitter-image.jpg" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="VistaForge" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <link rel="canonical" href="https://vistaforge.com/" />
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

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
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 angled-border-card transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Expertise & Experience</h3>
            <p className="mt-2 text-gray-600">
              At VistaForge, we combine design and technology to create modern, scalable brands and websites. Our work draws on real-world tools like Illustrator, Photoshop, Figma, and React to deliver results that are both creative and functional.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 angled-border-card">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Strategic Vision</h3>
            <p className="mt-2 text-gray-600">
              Every project begins with understanding your goals and audience. We don’t just design; we solve problems by crafting identities and digital experiences that are clear, consistent, and built to grow with your business.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 angled-border-card">
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
    </main>
  );
};

export default HomePage;