import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from 'react-spring';
import { BsPen, BsStack, BsLaptop, BsBarChart, BsPhone, BsTools, BsCashStack,BsBriefcase,BsRocket } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import aboutImage from '../assets/hero3.jpeg';
import '../styles/ServicesPage.css';
import Footer from '../components/Footer';

const ServicesPage = () => {
  const serviceSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 300,
    config: { tension: 120, friction: 14 }
  });

  return (
    <main className="bg-white" id="main-content">
      <Helmet>
        <title>Services - VistaForge Brand Design & Web Development</title>
        <meta name="description" content="Explore VistaForge's comprehensive brand design and web development services. From logo design to full brand identity and stunning websites, we help businesses stand out." />
        <meta name="keywords" content="brand design services, logo design, web development, brand identity, graphic design, creative services, Ghana design agency" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vistaforge.com/services" />
        <meta property="og:title" content="Services - VistaForge Brand Design & Web Development" />
        <meta property="og:description" content="Explore our comprehensive brand design and web development services. From logo design to full brand identity, we help businesses stand out." />
        <meta property="og:image" content="https://vistaforge.com/services-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="VistaForge" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vistaforge.com/services" />
        <meta property="twitter:title" content="Services - VistaForge Brand Design & Web Development" />
        <meta property="twitter:description" content="Explore our comprehensive brand design and web development services. From logo design to full brand identity, we help businesses stand out." />
        <meta property="twitter:image" content="https://vistaforge.com/services-twitter-image.jpg" />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="VistaForge" />
        <meta name="language" content="English" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vistaforge.com/services" />

        {/* Breadcrumbs structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
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
                "name": "Services",
                "item": "https://vistaforge.com/services"
              }
            ]
          })}
        </script>

        {/* Service structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Brand Design & Web Development Services",
            "description": "Professional brand design, logo design, and web development services for businesses in Ghana and beyond.",
            "provider": {
              "@type": "Organization",
              "name": "VistaForge",
              "url": "https://vistaforge.com"
            },
            "serviceType": "Creative Design Services",
            "areaServed": "Ghana"
          })}
        </script>
      </Helmet>
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
  );
};

export default ServicesPage;