import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from 'react-spring';
import { BsArrowRight, BsEnvelope, BsPhone, BsPinMap } from 'react-icons/bs';

const ContactPage = () => {
  // Spring animations for the form fields
  const formSpring = useSpring({
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0 },
    delay: 200,
  });

  // State to manage form data and submission status
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus(null); // Reset status
    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form data submitted:', formData);
      setSubmissionStatus('success');
      setFormData({ // Clear form fields
        fullName: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
      });
    } catch (error) {
      console.error('Submission failed:', error);
      setSubmissionStatus('error');
    }
  };

  const scrollToForm = () => {
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="bg-white text-[#0015AA] font-poppins" id="main-content">
      <Helmet>
        <title>Contact VistaForge - Get In Touch With Our Brand Design Team</title>
        <meta name="description" content="Ready to transform your brand? Contact VistaForge for professional brand design, logo design, and web development services. Let's discuss your project today." />
        <meta name="keywords" content="contact VistaForge, brand design agency contact, logo design Ghana, web design contact, creative agency Accra, brand consultation" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vistaforge.com/contact" />
        <meta property="og:title" content="Contact VistaForge - Get In Touch With Our Brand Design Team" />
        <meta property="og:description" content="Ready to transform your brand? Contact VistaForge for professional brand design and web development services. Let's discuss your project." />
        <meta property="og:image" content="https://vistaforge.com/contact-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="VistaForge" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vistaforge.com/contact" />
        <meta property="twitter:title" content="Contact VistaForge - Get In Touch With Our Brand Design Team" />
        <meta property="twitter:description" content="Ready to transform your brand? Contact VistaForge for professional brand design and web development services. Let's discuss your project." />
        <meta property="twitter:image" content="https://vistaforge.com/contact-twitter-image.jpg" />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="VistaForge" />
        <meta name="language" content="English" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vistaforge.com/contact" />

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
                "name": "Contact",
                "item": "https://vistaforge.com/contact"
              }
            ]
          })}
        </script>

        {/* Contact structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "mainEntity": {
              "@type": "Organization",
              "name": "VistaForge",
              "url": "https://vistaforge.com",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+233-59-255-8160",
                "contactType": "customer service",
                "email": "hello@vistaforge.com"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Ghana",
                "addressLocality": "Accra"
              }
            }
          })}
        </script>
      </Helmet>
      {/* Header Section with Subtle Shapes */}
      <section className="relative bg-[#0015AA] text-white py-24 px-4 sm:px-6 lg:px-8 text-center font-montserrat overflow-hidden">
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large Yellow Circle (top-left) */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow"></div>
          {/* Medium Yellow Circle (bottom-right) */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow delay-200"></div>
          {/* Small Blue Square (center-right) */}
          <div className="absolute top-1/4 right-0 w-32 h-32 bg-blue-700 opacity-20 rotate-45 animate-spin-slow"></div>
          {/* Abstract Wave/Shape (bottom-left) */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-[#FBB03B] to-transparent opacity-5"></div>
        </div>

        <div className="container mx-auto relative z-10"> {/* z-10 ensures content is above shapes */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Let’s Build Something Together
          </h1>
          <p className="mt-6 text-lg max-w-3xl mx-auto font-poppins">
            Have a project in mind or just want to learn more about how we work?
            We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Contact Section: Form & Info */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16" ref={formRef}>
          {/* Contact Form */}
          <animated.div style={formSpring} className="bg-white p-8 sm:p-12 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-[#0015AA] font-montserrat mb-8">Tell Us About Your Project</h2>
            {submissionStatus === 'success' && (
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 text-sm">
                Your message has been sent successfully! We'll get back to you shortly.
              </div>
            )}
            {submissionStatus === 'error' && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-sm">
                Oops! Something went wrong. Please try again later.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-[#FBB03B] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-[#FBB03B] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-[#FBB03B] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company/Organization (optional)
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-[#FBB03B] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                  Service Interest
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-[#FBB03B] focus:outline-none transition-colors"
                >
                  <option value="">Select a service...</option>
                  <option value="Branding">Branding</option>
                  <option value="Web Design">Web Design</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message/Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-[#FBB03B] focus:outline-none transition-colors"
                ></textarea>
              </div>
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="flex items-center bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
                >
                  Send Message <BsArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          </animated.div>

          {/* Contact Information */}
          <div className="flex flex-col space-y-8 lg:space-y-12 mt-12 lg:mt-0">
            <div className="p-8 rounded-lg shadow-xl text-center lg:text-left">
              <h3 className="text-xl font-bold font-montserrat mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <BsEnvelope className="text-2xl text-[#FBB03B]" />
                  <span className="text-gray-700">hello@vistaforge.com</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <BsPhone className="text-2xl text-[#FBB03B]" />
                  <span className="text-gray-700">+233 (0)59 255 8160</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <BsPinMap className="text-2xl text-[#FBB03B]" />
                  <span className="text-gray-700">Accra, Ghana</span>
                </div>
              </div>
            </div>
            
            {/* Map Section */}
            <div className="rounded-lg shadow-xl overflow-hidden h-[300px] lg:h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15582.59012301932!2d-0.1904321689369941!3d5.556209259165487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a173428d097%3A0x6b772b1d6141c2c3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sus!4v1694269984955!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="bg-[#0015AA] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold font-montserrat">
            Your brand’s transformation starts here. Let’s make it happen.
          </h2>
          <button
            onClick={scrollToForm}
            className="mt-8 inline-block bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Start Your Project
          </button>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;