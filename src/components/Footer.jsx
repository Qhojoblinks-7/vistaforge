import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Logo from '../assets/footer_logo.svg';

const Footer = () => {
  return (
    <footer className="bg-[#1C2331] text-gray-300 py-8 px-4 sm:py-12 sm:px-6 lg:px-8" role="contentinfo">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">

        {/* Column 1: Brand Info */}
        <div className="sm:col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
          <div className="text-xl sm:text-2xl font-bold text-white mb-2">
            <Link to="/" aria-label="Vista Forge - Go to homepage" className="focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">
              <img src={Logo} alt="Vista Forge Logo" className="h-6 sm:h-8 inline-block mr-2" />
              <span className="sm:not-sr-only">Vista Forge</span>
            </Link>
          </div>
          
          <p className="text-sm mb-4 text-center md:text-left">
            Creating memorable brand identities that drive business growth.
          </p>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]" aria-label="Facebook">
              <FaFacebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]" aria-label="Twitter">
              <FaTwitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]" aria-label="Instagram">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]" aria-label="LinkedIn">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Column 2: Services */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm" role="list">
            <li><Link to="/services" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">Logo Design</Link></li>
            <li><Link to="/services" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">Brand Identity</Link></li>
            <li><Link to="/services" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">Web Design</Link></li>
            <li><Link to="/services" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">Print Design</Link></li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2 text-sm" role="list">
            <li><Link to="/about" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">About Us</Link></li>
            <li><Link to="/portfolio" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">Portfolio</Link></li>
            <li><Link to="/about" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">Testimonials</Link></li>
            <li><Link to="/contact" className="hover:text-[#FBB03B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">Contact</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-white mb-4">Contact Info</h4>
          <ul className="space-y-2 text-sm" role="list">
            <li><a href="mailto:hello@vistaforge.com" className="hover:text-[#FBB03B] transition-colors break-all focus:outline-none focus:ring-2 focus:ring-[#FBB03B] focus:ring-offset-2 focus:ring-offset-[#1C2331]">hello@vistaforge.com</a></li>
            <li>(555) 123-4567</li>
            <li>123 Design St, Creative City</li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm" role="contentinfo">
        <p>&copy; 2024 Vista Forge. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
