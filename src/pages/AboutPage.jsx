import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { BsLightbulbFill, BsGem, BsGraphUp, BsAwardFill } from 'react-icons/bs';
import { FaHandshake } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// You will need to add a team member image to your project
// Example: import amaBoatengImage from './assets/ama-boateng.webp';

// Dummy team members for placeholder
const TEAM_MEMBERS = [
  { name: "Ama Boateng", role: "Co-Founder & Lead Strategist", tagline: "Visionary architect of brand narratives.", image: 'path/to/ama-boateng.webp' },
  { name: "Kofi Mensah", role: "Co-Founder & Creative Director", tagline: "Bringing ideas to life with stunning visuals.", image: 'path/to/kofi-mensah.webp' },
  { name: "Adwoa Nsiah", role: "Lead UI/UX Designer", tagline: "Crafting intuitive and delightful user experiences.", image: 'path/to/adwoa-nsiah.webp' },
  { name: "Kwame Nkrumah", role: "Web Development Lead", tagline: "Building robust and scalable digital platforms.", image: 'path/to/kwame-nkrumah.webp' },
];

const AboutUsPage = () => {
  // Animation for the hero section
  const heroProps = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 120, friction: 14 }
  });

  // Animation for mission/vision and other sections on scroll
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const missionProps = useSpring({
    opacity: missionInView ? 1 : 0,
    transform: missionInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 14 },
    delay: 200,
  });

  // Timeline animations - moved hooks to top level
  const [timelineRef1, timelineInView1] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [timelineRef2, timelineInView2] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [timelineRef3, timelineInView3] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [timelineRef4, timelineInView4] = useInView({ triggerOnce: true, threshold: 0.5 });

  const timelineProps1 = useSpring({
    opacity: timelineInView1 ? 1 : 0,
    transform: timelineInView1 ? 'translateY(0px)' : 'translateY(30px)',
    delay: 100,
    config: { tension: 120, friction: 14 }
  });

  const timelineProps2 = useSpring({
    opacity: timelineInView2 ? 1 : 0,
    transform: timelineInView2 ? 'translateY(0px)' : 'translateY(30px)',
    delay: 200,
    config: { tension: 120, friction: 14 }
  });

  const timelineProps3 = useSpring({
    opacity: timelineInView3 ? 1 : 0,
    transform: timelineInView3 ? 'translateY(0px)' : 'translateY(30px)',
    delay: 300,
    config: { tension: 120, friction: 14 }
  });

  const timelineProps4 = useSpring({
    opacity: timelineInView4 ? 1 : 0,
    transform: timelineInView4 ? 'translateY(0px)' : 'translateY(30px)',
    delay: 400,
    config: { tension: 120, friction: 14 }
  });

  const timelineSteps = [
    { year: "2025", title: "VistaForge Founded", description: "A vision to redefine African branding and digital presence began in Accra, Ghana.", ref: timelineRef1, props: timelineProps1 },
    { year: "2026", title: "First Major Project & Portfolio Showcase", description: "Successfully delivered impactful branding for a local startup, marking our first step onto the digital stage.", ref: timelineRef2, props: timelineProps2 },
    { year: "2027", title: "Expanding to Global Clients", description: "Our reputation grew, attracting international clients seeking our unique blend of creativity and strategic insight.", ref: timelineRef3, props: timelineProps3 },
    { year: "Present", title: "Innovating for the Future", description: "Continuously evolving our services, embracing new technologies, and setting new benchmarks in creative excellence.", ref: timelineRef4, props: timelineProps4 },
  ];

  // Core values animations
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const valueCardsProps = useSpring({
    opacity: valuesInView ? 1 : 0,
    transform: valuesInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 14 },
    delay: 300,
  });

  // CTA animation
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.5 });
  const ctaProps = useSpring({
    opacity: ctaInView ? 1 : 0,
    transform: ctaInView ? 'translateY(0px)' : 'translateY(100px)',
    config: { tension: 120, friction: 14 },
    delay: 100,
  });

  return (
    <main className="bg-white text-gray-800 font-poppins" id="main-content">
      <Helmet>
        <title>About VistaForge - Professional Brand Design & Creative Agency</title>
        <meta name="description" content="Learn about VistaForge, Ghana's leading brand design agency. Meet our team of creative strategists and discover our mission to empower African businesses with innovative branding solutions." />
        <meta name="keywords" content="about VistaForge, brand design agency Ghana, creative team, brand strategy, digital agency Accra, African branding" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vistaforge.com/about" />
        <meta property="og:title" content="About VistaForge - Professional Brand Design & Creative Agency" />
        <meta property="og:description" content="Meet the team behind VistaForge and discover our mission to empower African businesses with innovative branding and digital solutions." />
        <meta property="og:image" content="https://vistaforge.com/about-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="VistaForge" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vistaforge.com/about" />
        <meta property="twitter:title" content="About VistaForge - Professional Brand Design & Creative Agency" />
        <meta property="twitter:description" content="Meet the team behind VistaForge and discover our mission to empower African businesses with innovative branding and digital solutions." />
        <meta property="twitter:image" content="https://vistaforge.com/about-twitter-image.jpg" />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="VistaForge" />
        <meta name="language" content="English" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vistaforge.com/about" />

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
                "name": "About",
                "item": "https://vistaforge.com/about"
              }
            ]
          })}
        </script>
      </Helmet>
      {/* 1. Hero Section - This section will be the same for both versions */}
      <section className="relative bg-[#0015AA] text-white py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FBB03B] opacity-20 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-1/2 -left-20 w-48 h-48 bg-[#FBB03B] opacity-20 rotate-45 animate-spin-slow"></div>
          <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-blue-700 opacity-15 rounded-full animate-pulse-slow delay-200"></div>
          <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-white to-transparent opacity-15"></div>
          <div className="absolute top-0 left-0 w-40 h-40 transform rotate-12 -translate-x-1/2 -translate-y-1/2">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 25L25 50L0 75L25 100" stroke="#FBB03B" strokeOpacity="0.1" strokeWidth="5" />
              <path d="M50 0L75 25L50 50L75 75L50 100" stroke="#FBB03B" strokeOpacity="0.1" strokeWidth="5" />
            </svg>
          </div>
          <div className="absolute top-0 left-1/2 w-32 h-20 bg-[#0015AA] opacity-5 rounded-bl-3xl rounded-tr-3xl"></div>
        </div>
        <animated.div style={heroProps} className="container mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-montserrat leading-tight">
            Who We Are
          </h1>
          <p className="mt-6 text-lg max-w-3xl mx-auto">
            VistaForge is where creativity meets strategy. We help businesses of all sizes craft powerful brands and digital experiences.
          </p>
        </animated.div>
      </section>

      {/* --- Desktop Layout (Hidden on mobile) --- */}
      <div className="hidden md:block">
        {/* 2. Mission & Vision Section (Full) */}
        <section ref={missionRef} className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <animated.div style={missionProps} className="container mx-auto text-center">
            <h2 className="text-4xl font-bold font-montserrat text-[#0015AA]">Our Mission & Vision</h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Mission Block */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <BsGraphUp className="text-[#FBB03B] text-5xl mx-auto mb-4" />
                <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">Our Mission</h3>
                <p className="mt-4 text-lg text-gray-700">
                  To empower African and global businesses with innovative branding and digital solutions that inspire trust and growth.
                </p>
              </div>
              {/* Vision Block */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <BsLightbulbFill className="text-[#0015AA] text-5xl mx-auto mb-4" />
                <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">Our Vision</h3>
                <p className="mt-4 text-lg text-gray-700">
                  To be Africa's most trusted creative agency, building brands that stand tall on the world stage.
                </p>
              </div>
            </div>
          </animated.div>
        </section>

        {/* 3. Our Story Section (Timeline) (Full) */}
        <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold font-montserrat text-[#0015AA]">Our Story: A Journey of Craft & Growth</h2>
            <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
              From a spark of an idea to a thriving creative hub, every step of VistaForge's journey has been about bridging creativity with strategic impact.
            </p>
            <div className="relative mt-16 pb-12">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#0015AA]"></div>

              {timelineSteps.map((step, index) => {
                const isEven = index % 2 === 0;

                return (
                  <animated.div ref={step.ref} style={step.props} key={index} className={`mb-12 flex items-center w-full ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                    <div className="w-full md:w-1/2 flex justify-center">
                      <div className={`timeline-dot absolute w-6 h-6 rounded-full bg-[#FBB03B] border-4 border-white ${isEven ? 'md:left-1/2 md:-ml-3' : 'md:left-1/2 md:-ml-3'} top-1/2 transform -translate-y-1/2`}></div>
                      <div className={`p-6 bg-white rounded-lg shadow-lg max-w-md w-full relative ${isEven ? 'md:mr-auto md:text-left md:pr-12' : 'md:ml-auto md:text-right md:pl-12'} text-center`}>
                        <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">{step.title}</h3>
                        <p className="text-sm font-bold text-[#FBB03B] mt-1">{step.year}</p>
                        <p className="mt-3 text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:block md:w-1/2"></div>
                  </animated.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Core Values Section (Full) */}
        <section ref={valuesRef} className="bg-white py-20 px-4 sm:px-6 lg:px-8">
          <animated.div style={valueCardsProps} className="container mx-auto text-center">
            <h2 className="text-4xl font-bold font-montserrat text-[#0015AA]">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              These principles guide everything we do, ensuring every project delivers quality, consistency, and true impact.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <BsLightbulbFill className="text-[#FBB03B] text-6xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">Creativity</h3>
                <p className="mt-3 text-gray-600">We push boundaries to design unique and innovative solutions.</p>
              </div>
              <div className="group bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <BsGem className="text-[#0015AA] text-6xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">Consistency</h3>
                <p className="mt-3 text-gray-600">Every project meets high standards, delivering quality results every time.</p>
              </div>
              <div className="group bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <BsGraphUp className="text-[#FBB03B] text-6xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">Impact</h3>
                <p className="mt-3 text-gray-600">We focus on measurable results, not just aesthetics, driving real business growth.</p>
              </div>
              <div className="group bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <FaHandshake className="text-[#0015AA] text-6xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">Partnership</h3>
                <p className="mt-3 text-gray-600">We grow with our clients, fostering strong relationships and shared success.</p>
              </div>
              <div className="group bg-gray-50 p-8 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <BsAwardFill className="text-[#FBB03B] text-6xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold font-montserrat text-[#0015AA]">Excellence</h3>
                <p className="mt-3 text-gray-600">We aim for nothing less than global quality and exceptional standards.</p>
              </div>
            </div>
          </animated.div>
        </section>

        {/* 5. Team Section (Full) */}
        <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold font-montserrat text-[#0015AA]">Meet the Minds Behind VistaForge</h2>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              Our diverse team of passionate strategists, designers, and developers are united by a common goal: your success.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {TEAM_MEMBERS.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  {/* Lazy-loaded image */}
                  <LazyLoadImage
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                    effect="blur" // Adds a blur effect while loading
                  />
                  <h3 className="text-xl font-semibold font-montserrat text-[#0015AA]">{member.name}</h3>
                  <p className="text-md text-[#FBB03B] mt-1">{member.role}</p>
                  <p className="text-sm text-gray-600 mt-2 italic">"{member.tagline}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* --- Mobile Layout (Hidden on desktop) --- */}
      <div className="md:hidden">
        {/* Compressed Our Story */}
        <section className="bg-white py-12 px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold font-montserrat text-[#0015AA]">Our Story</h2>
          <p className="mt-4 text-gray-700 max-w-prose mx-auto">
            Founded in 2025, VistaForge was built to bridge the gap between bold creativity and smart business strategy. We're not just a team; we're your partners, dedicated to turning your ideas into a brand that lasts.
          </p>
        </section>

        {/* Compressed Our Values */}
        <section className="bg-gray-100 py-12 px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold font-montserrat text-[#0015AA]">Our Values</h2>
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#0015AA]">Creativity</h3>
              <p className="text-sm text-gray-600">We design solutions that are bold and original.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#0015AA]">Impact</h3>
              <p className="text-sm text-gray-600">We focus on results that drive real business growth.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-[#0015AA]">Excellence</h3>
              <p className="text-sm text-gray-600">We deliver world-class quality on every project.</p>
            </div>
          </div>
        </section>

        {/* Compressed Team Section */}
        <section className="bg-white py-12 px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold font-montserrat text-[#0015AA]">Meet the Team</h2>
          <p className="mt-4 text-gray-700 max-w-prose mx-auto">
            Young. Driven. Bold. Our team blends strategy, design, and technology to craft unforgettable brand experiences.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {TEAM_MEMBERS.map((member, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                {/* Lazy-loaded image */}
                <LazyLoadImage
                  src={member.image}
                  alt={member.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover mb-2"
                  effect="blur"
                />
                <h3 className="text-md font-semibold text-[#0015AA]">{member.name}</h3>
                <p className="text-xs text-[#FBB03B] mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 6. Call-to-Action Banner - This section will be the same for both versions */}
      <section ref={ctaRef} className="bg-[#FBB03B] text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <animated.div style={ctaProps} className="container mx-auto relative z-10">
          <h2 className="text-4xl sm:text-1xl font-bold font-montserrat leading-tight">
            This is just the beginning.
            <br />
            Let's write the next chapter of your brand's story together.
          </h2>
          <Link
            to="/contact"
            className="mt-10 inline-block bg-[#0015AA] text-white text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-opacity-90"
          >
            Start a Project
          </Link>
        </animated.div>
      </section>
    </main>
  );
};

export default AboutUsPage;
