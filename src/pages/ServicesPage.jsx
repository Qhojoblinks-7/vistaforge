import React from 'react';
import { useSpring,animated} from 'react-spring';
import { BsPen, BsStack, BsLaptop, BsBarChart, BsPhone, BsTools, BsCashStack, BsBriefcase, BsRocket } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import aboutImage from '../assets/hero3.jpeg';
import '../styles/ServicesPage.css';

const ServicesPage = () => {
  const serviceSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 300,
    config: { tension: 120, friction: 14 }
  });

  return (
    <main className="bg-white" id="main-content">
      {/* Hero Section with Subtle Shapes */}
      <section className="relative bg-[#0015AA] text-white py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
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
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
            <div className="md:w-1/2">
              <div className="w-full h-80 rounded-lg bg-gray-200 flex items-center justify-center">
                <BsStack size={80} className="text-gray-400" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl mr-1.5 font-bold text-[#0015AA]">Brand Strategy & Positioning</h3>
              <p className="mt-4 text-lg text-gray-700">
                Before any design begins, we dive deep into your business—market research, competitor analysis, and crafting your brand story, mission, and values. This becomes your strategic blueprint, ensuring your brand isn’t just visually appealing but also cohesive and resonant with your audience.
              </p>
              <div className="bg-gray-100 p-6 rounded-lg mt-6 shadow-sm">
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
          <div className="container w-full flex flex-col md:flex-row-reverse items-center gap-12 py-16 bg-gray-50 rounded-lg">
            <div className="md:w-1/2">
              <div className="w-full h-80 rounded-lg bg-gray-200 flex items-center justify-center">
                <BsPen size={80} className="text-gray-400" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl ml-6 font-bold text-[#0015AA]">Logo & Visual Identity Design</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Custom logo design with multiple concepts, refined typography, color palette, and usage guidelines. Includes mockups for stationery and basic brand materials.
              </p>
              <div className="bg-white ml-6 p-6 rounded-lg mt-6 shadow-sm">
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
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
            <div className="md:w-1/2">
              <div className="w-full h-80 rounded-lg bg-gray-200 flex items-center justify-center">
                <BsLaptop size={80} className="text-gray-400" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl ml-6 font-bold text-[#0015AA]">Website Design & Development</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Responsive, professional website custom-built or with WordPress/CMS. Includes domain, hosting, basic SEO, and mobile compatibility.
              </p>
              <div className="ml-6 bg-gray-100 p-6 rounded-lg mt-6 shadow-sm">
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
          <div className="w-full flex flex-col md:flex-row-reverse items-center gap-12 py-16 bg-gray-50 rounded-lg">
            <div className="md:w-1/2">
              <div className="w-full h-80 rounded-lg bg-gray-200 flex items-center justify-center">
                <BsPhone size={80} className="text-gray-400" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-3xl ml-6 font-bold text-[#0015AA]">UI/UX Design for Apps & Digital Products</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Wireframes, high-fidelity UI designs, and user flow prototypes using tools like Figma. Tailored to enhance usability and conversion.
              </p>
              <div className="ml-6 bg-white p-6 rounded-lg mt-6 shadow-sm">
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
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
            <div className="md:w-1/2">
              <div className="w-full h-80 rounded-lg bg-gray-200 flex items-center justify-center">
                <BsBarChart size={80} className="text-gray-400" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="ml-6 text-3xl font-bold text-[#0015AA]">Social Media Branding & Campaigns</h3>
              <p className="mt-4 ml-6 text-lg text-gray-700">
                Branded post templates, banners, campaign graphics, and design strategy for consistent presence across platforms.
              </p>
              <div className="ml-6 bg-gray-100 p-6 rounded-lg mt-6 shadow-sm">
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
      <section className="bg-[#0015AA] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto">
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
    </main>
  );
};

export default ServicesPage;