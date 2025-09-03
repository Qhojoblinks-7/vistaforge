import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.svg'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50" role="banner">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-[#0015AA] text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      <nav className="container mx-auto px-4 py-4 flex items-center justify-between" role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div className="text-xl sm:text-2xl font-bold text-[#0015AA]">
          <img src={logo} alt="Vista Forge Logo" className="h-6 sm:h-8 inline-block mr-2" />
          <Link to="/" aria-label="Vista Forge - Go to homepage">Vista Forge</Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-[#0015AA] font-semibold">
          <li><Link to="/" className="hover:text-[#FBB03B] transition-colors">Home</Link></li>
          <li><Link to="/services" className="hover:text-[#FBB03B] transition-colors">Services</Link></li>
          <li><Link to="/portfolio" className="hover:text-[#FBB03B] transition-colors">Portfolio</Link></li>
          <li><Link to="/contact" className="hover:text-[#FBB03B] transition-colors">Contact</Link></li>
        </ul>

        {/* Desktop Call to Action Button */}
        <Link to="/contact" className="hidden md:block">
          <button className="bg-[#FBB03B] text-white font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-opacity-90 transition-colors">
            Book Consultation
          </button>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-[#0015AA] focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-4 px-4 py-6 text-[#0015AA] font-semibold">
            <li><Link to="/" onClick={toggleMenu} className="block hover:text-[#FBB03B] transition-colors">Home</Link></li>
            <li><Link to="/services" onClick={toggleMenu} className="block hover:text-[#FBB03B] transition-colors">Services</Link></li>
            <li><Link to="/portfolio" onClick={toggleMenu} className="block hover:text-[#FBB03B] transition-colors">Portfolio</Link></li>
            <li><Link to="/contact" onClick={toggleMenu} className="block hover:text-[#FBB03B] transition-colors">Contact</Link></li>
            <li className="pt-4">
              <Link to="/contact" onClick={toggleMenu}>
                <button className="w-full bg-[#FBB03B] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors">
                  Book Consultation
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
