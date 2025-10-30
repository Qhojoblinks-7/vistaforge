import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const TestimonialsSection = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold text-[#0015AA]">What Our Clients Say</h2>
        <div className="mt-12 bg-gray-50 p-10 rounded-lg shadow-xl relative">
          <FaQuoteLeft className="absolute top-4 left-4 text-[#FBB03B] opacity-20" size={60} />
          <p className="relative text-xl md:text-2xl font-medium text-gray-800 italic leading-snug">
            "Working with Vista Forge was a game-changer for our brand. They didn't just give us a logo; they gave us a clear direction and a brand identity that truly resonates with our audience. The entire process was seamless and the results speak for themselves."
          </p>
          <div className="mt-8 pt-4 border-t border-gray-300">
            <p className="font-bold text-[#0015AA] text-lg">Jane Doe</p>
            <p className="text-gray-600">CEO, Tech Innovators Inc.</p>
          </div>
        </div>
        
        <div className="mt-12">
            <p className="text-lg text-gray-700">
                Want to hear more stories like this?
            </p>
            <a
                href="/about"
                className="mt-4 inline-block bg-[#FBB03B] text-[#0015AA] font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
                View More Testimonials
            </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;