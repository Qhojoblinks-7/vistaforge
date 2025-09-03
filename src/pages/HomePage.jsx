import React from 'react';
import { BsPen, BsStack, BsLaptop, BsPrinter, BsBarChart, BsPhone } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import '../styles/HeroAnimation.css'
import heroImage from '../assets/hero2.png';
import hero3 from '../assets/hero3.jpeg';

const HomePage = () => {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <section className="relative bg-[#0015AA] text-white py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8 overflow-hidden">
  {/* Subtle Background Shapes */}
  <div className="absolute top-0 left-0 w-full h-full">
    {/* Large Yellow Circle (top-right) */}
    <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow"></div>
    {/* Medium Yellow Square (center-left) */}
    <div className="absolute top-1/2 -left-20 w-48 h-48 bg-[#FBB03B] opacity-30 rotate-45 animate-spin-slow"></div>
    {/* Small Blue Circle (bottom-left) */}
    <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-blue-700 opacity-20 rounded-full animate-pulse-slow delay-200"></div>
    {/* Abstract Wave/Shape (bottom-right) */}
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
          <button
            onClick={() => window.location.href = '/contact'}
            className="px-6 sm:px-8 py-3 bg-[#FBB03B] text-white font-semibold rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#0015AA] text-sm sm:text-base"
            aria-label="Start your brand journey - Contact us for a consultation"
          >
            Start My Brand Journey
          </button>
          <button
            onClick={() => window.location.href = '/portfolio'}
            className="px-6 sm:px-8 py-3 text-white font-semibold rounded-md border-2 border-white hover:bg-white hover:text-[#0015AA] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0015AA] text-sm sm:text-base"
            aria-label="View our portfolio of work"
          >
            View Our Work
          </button>
        </div>
    </div>

    {/* Right Side: Image */}
    <div className="md:w-1/2">
      <img
        src={heroImage}
        alt="Team working together on a brand strategy"
        className="w-full h-auto rounded-xl blend-left"
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
              src={hero3} // Add your image to the public folder
              alt="Our team of brand strategists" 
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
          {/* Card 1: Logo Design */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0015AA] text-white mx-auto">
              <BsPen size={24} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0015AA] mt-4 sm:mt-6">Logo Design</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Create memorable logos that capture your brand's personality and make a strong first impression across all touchpoints.
            </p>
          </div>

          {/* Card 2: Brand Identity */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0015AA] text-white mx-auto">
              <BsStack size={24} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0015AA] mt-4 sm:mt-6">Brand Identity</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Develop complete brand systems including colors, typography, and visual elements that work seamlessly together.
            </p>
          </div>

          {/* Card 3: Web Design */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0015AA] text-white mx-auto">
              <BsLaptop size={24} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0015AA] mt-4 sm:mt-6">Web Design</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Design beautiful, user-friendly websites that reflect your brand identity and convert visitors into customers.
            </p>
          </div>

          {/* Card 4: Print Design */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0015AA] text-white mx-auto">
              <BsPrinter size={24} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0015AA] mt-4 sm:mt-6">Print Design</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Create stunning print materials including business cards, brochures, and packaging that extend your brand offline.
            </p>
          </div>

          {/* Card 5: Brand Strategy */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0015AA] text-white mx-auto">
              <BsBarChart size={24} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0015AA] mt-4 sm:mt-6">Brand Strategy</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Develop strategic positioning and messaging that differentiates your brand in the marketplace.
            </p>
          </div>

          {/* Card 6: Digital Assets */}
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0015AA] text-white mx-auto">
              <BsPhone size={24} className="sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0015AA] mt-4 sm:mt-6">Digital Assets</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Design social media templates, email headers, and other digital assets to maintain brand consistency online.
            </p>
          </div>
        </div>
      </section>
    
      <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
  {/* Subtle Background Shapes */}
  <div className="absolute top-0 left-0 w-full h-full">
    {/* Large Blue Circle (top-left) */}
    <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#0015AA] opacity-15 rounded-full animate-pulse-slow"></div>
    {/* Small Yellow Circle (middle-right) */}
    <div className="absolute top-1/2 right-10 w-24 h-24 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow delay-200"></div>
    {/* Medium Blue Square (bottom-left) */}
    <div className="absolute -bottom-10 left-10 w-48 h-48 bg-blue-700 opacity-15 rotate-45 animate-spin-slow"></div>
    {/* New: Yellow Zigzag shape (top-right) */}
    <div className="absolute top-0 right-0 w-40 h-40 transform rotate-12 translate-x-1/2 -translate-y-1/2">
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 25L25 50L0 75L25 100" stroke="#FBB03B" strokeOpacity="0.1" strokeWidth="5" />
        <path d="M50 0L75 25L50 50L75 75L50 100" stroke="#FBB03B" strokeOpacity="0.1" strokeWidth="5" />
      </svg>
    </div>
    {/* New: Abstract Curve (bottom-right) */}
    <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-tl from-white to-transparent opacity-35"></div>
  </div>

  <div className="container mx-auto text-center relative z-10">
    <h2 className="text-4xl font-bold text-[#0015AA]">Let us show you how we drive your brand to new heights.</h2>
    <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
      Our streamlined process ensures a collaborative and transparent journey from concept to launch. We’ll be with you every step of the way.
    </p>
  </div>

  {/* The responsive process flow */}
  <div className="container mx-auto mt-12 relative flex flex-col items-center space-y-8 z-10">
    {/* Vertical connecting line (hidden on mobile) */}
    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300"></div>

    {/* Step 1: Define - Tilted slightly left */}
    <div className="w-full max-w-sm relative z-10 transform -rotate-1 md:mr-48 hover:rotate-0 transition-transform duration-300 shadow-xl bg-gray-50 rounded-lg">
      <div className="process-card-spot"></div>
      <div className="bg-white p-6 rounded-lg fading-border-card relative">
        <h3 className="absolute top-4 right-4 text-xl font-bold text-[#FBB03B]">01</h3>
        <h4 className="text-2xl font-semibold text-[#0015AA] mt-2">Define</h4>
        <p className="mt-2 text-gray-600">
          We start by deeply understanding your brand, your audience, and your goals. This phase is all about research, strategy, and setting the foundation for success.
        </p>
      </div>
    </div>
    {/* Step 2: Design - Tilted slightly right */}
    <div className="w-full max-w-sm relative z-10 transform rotate-2 md:ml-48 hover:rotate-0 transition-transform duration-300 shadow-xl bg-gray-50 rounded-lg">
      <div className="process-card-spot"></div>
      <div className="bg-white p-6 rounded-lg fading-border-card">
        <h3 className="absolute top-4 right-4 text-xl font-bold text-[#FBB03B]">02</h3>
        <h4 className="text-2xl font-semibold text-[#0015AA] mt-2">Design</h4>
        <p className="mt-2 text-gray-600">
          This is where your vision takes shape. We create stunning visual identities, mockups, and prototypes that are not just beautiful but also strategic.
        </p>
      </div>
    </div>

    {/* Step 3: Build - Tilted slightly left again */}
    <div className="w-full max-w-sm relative z-10 transform -rotate-1 md:mr-48 hover:rotate-0 transition-transform duration-300 shadow-xl bg-gray-50 rounded-lg">
      <div className="process-card-spot"></div>
      <div className="bg-white p-6 rounded-lg fading-border-card">
        <h3 className="absolute top-4 right-4 text-xl font-bold text-[#FBB03B]">03</h3>
        <h4 className="text-2xl font-semibold text-[#0015AA] mt-2">Build</h4>
        <p className="mt-2 text-gray-600">
          Our development team brings the design to life, building a fast, responsive, and secure digital presence that performs flawlessly across all devices.
        </p>
      </div>
    </div>
    
    {/* Step 4: Launch - Tilted slightly right again */}
    <div className="w-full max-w-sm relative z-10 transform rotate-2 md:ml-48 hover:rotate-0 transition-transform duration-300 shadow-xl bg-gray-50 rounded-lg">
      <div className="process-card-spot"></div>
      <div className="bg-white p-6 rounded-lg fading-border-card">
        <h3 className="absolute top-4 right-4 text-xl font-bold text-[#FBB03B]">04</h3>
        <h4 className="text-2xl font-semibold text-[#0015AA] mt-2">Launch</h4>
        <p className="mt-2 text-gray-600">
          The big moment! We carefully deploy your new brand and digital assets, and we continue to provide support and analytics to ensure your success.
        </p>
      </div>
    </div>
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
          {/* Card 1: Expertise & Experience */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 angled-border-card">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Expertise & Experience</h3>
            <p className="mt-2 text-gray-600">
              With a decade of experience and a portfolio of over 150 successful projects, we bring a level of expertise that guarantees results and peace of mind.
            </p>
          </div>

          {/* Card 2: Strategic Vision */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 angled-border-card">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Strategic Vision</h3>
            <p className="mt-2 text-gray-600">
              We're not just designers; we're problem solvers. We start with a deep dive into your business to build a brand that's not just beautiful, but also smart.
            </p>
          </div>

          {/* Card 3: Proven Results */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 angled-border-card">
            <h3 className="text-2xl font-semibold text-[#0015AA] mt-2">Proven Results</h3>
            <p className="mt-2 text-gray-600">
              Our commitment to your success is reflected in our 98% client satisfaction rate. We don’t rest until you're thrilled with the outcome.
            </p>
          </div>
        </div>
      </section>



      {/* Call to Action Section */}
      <section className="bg-[#0015AA] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto">
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

