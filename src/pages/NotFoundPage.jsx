import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from '@react-spring/web';
import { Link } from 'react-router-dom';
import { BsHouse, BsSearch, BsArrowLeft, BsGlobe } from 'react-icons/bs';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const NotFoundPage = () => {
  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 120, friction: 14 },
  });

  const notFoundStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Page Not Found - VistaForge",
    "description": "The page you're looking for doesn't exist. Find your way back to our branding, web design, and UI/UX services.",
    "url": "https://vistaforge.com/404",
    "publisher": {
      "@id": "https://vistaforge.com/#organization"
    },
  };

  return (
    <>
      <SEO
        title="Page Not Found - VistaForge"
        description="The page you're looking for doesn't exist. Find your way back to our branding, web design, and UI/UX services for African startups."
        keywords="404, page not found, VistaForge, error page"
        image="/hero2.png"
        url="/404"
        section="Error"
        structuredData={notFoundStructuredData}
      />
      <main className="bg-white min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <animated.div style={containerSpring} className="text-center max-w-md mx-auto py-20">
          <div className="mb-8">
            <span className="text-9xl font-bold text-[#0015AA]/10">404</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0015AA] mb-4">
            Page Not Found
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          <div className="space-y-4 mb-10">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#0015AA] text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-[#0015AA]/90 transition-all duration-200"
            >
              <BsHouse className="w-5 h-5" />
              Back to Homepage
            </Link>
            
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 w-full border-2 border-[#0015AA] text-[#0015AA] font-bold py-4 px-8 rounded-full hover:bg-[#0015AA] hover:text-white transition-all duration-200"
            >
              <BsGlobe className="w-5 h-5" />
              View Our Services
            </Link>
            
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#FBB03B] text-[#0015AA] font-bold py-4 px-8 rounded-full shadow-lg hover:bg-[#E0A030] transition-all duration-200"
            >
              <BsSearch className="w-5 h-5" />
              Start a Project
            </Link>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Popular pages you might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link to="/services" className="text-[#0015AA] hover:underline">Services</Link>
              <span className="text-gray-300">|</span>
              <Link to="/portfolio" className="text-[#0015AA] hover:underline">Portfolio</Link>
              <span className="text-gray-300">|</span>
              <Link to="/blog" className="text-[#0015AA] hover:underline">Insights</Link>
              <span className="text-gray-300">|</span>
              <Link to="/about" className="text-[#0015AA] hover:underline">About Us</Link>
              <span className="text-gray-300">|</span>
              <Link to="/faq" className="text-[#0015AA] hover:underline">FAQ</Link>
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0015AA] transition-colors"
            >
              <BsArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </animated.div>

        <Footer />
      </main>
    </>
  );
};

export default NotFoundPage;