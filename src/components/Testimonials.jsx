import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { BsStarFill, BsQuote, BsArrowLeft, BsArrowRight, BsCheckCircle } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { TESTIMONIALS, AGGREGATE_RATING, getFeaturedTestimonials, getAllTestimonials } from '../data/testimonials';
import OptimizedImage from './OptimizedImage';

const Testimonials = ({ 
  variant = 'carousel', // 'carousel' | 'grid' | 'featured'
  maxItems = 3,
  className = '',
  showSchema = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = variant === 'featured' ? getFeaturedTestimonials() : getAllTestimonials();
  const displayTestimonials = testimonials.slice(0, maxItems);

  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 120, friction: 14 },
  });

  const cardSpring = (index) => useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: index * 100,
    config: { tension: 120, friction: 14 },
  });

  const next = () => setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);

  useEffect(() => {
    if (variant === 'carousel') {
      const interval = setInterval(next, 6000);
      return () => clearInterval(interval);
    }
  }, [variant]);

  const renderStars = (rating) => (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <BsStarFill key={i} className={`w-5 h-5 ${i < rating ? 'text-[#FBB03B]' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  if (variant === 'grid') {
    return (
      <animated.section style={containerSpring} className={`${className}`}>
{showSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": displayTestimonials.map((t, i) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "item": {
                    "@type": "Review",
                    "author": {
                      "@type": "Person",
                      "name": t.clientName,
                      "jobTitle": t.clientRole,
                      "worksFor": { "@type": "Organization", "name": t.clientCompany },
                    },
                    "datePublished": t.date,
                    "reviewBody": t.text,
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": t.rating,
                      "bestRating": "5",
                      "worstRating": "1",
                    },
                    "itemReviewed": {
                      "@type": "Service",
                      "name": t.projectType,
                      "provider": { "@id": "https://vistaforge.com/#organization" },
                    },
                  },
                })),
              }),
            }}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((testimonial, index) => (
            <animated.article key={testimonial.id} style={cardSpring(index)} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <OptimizedImage
                  src={testimonial.companyLogo}
                  alt={`${testimonial.clientCompany} logo`}
                  className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1"
                  widths={[40, 80]}
                  sizes="40px"
                />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{testimonial.clientCompany}</p>
                  <p className="text-xs text-gray-500">{testimonial.projectType}</p>
                </div>
              </div>
              
              <BsQuote className="w-8 h-8 text-[#FBB03B]/30 mb-4" />
              
              <blockquote className="text-gray-700 leading-relaxed mb-6 flex-1">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>
              
              <div className="mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <OptimizedImage
                  src={testimonial.clientImage}
                  alt={testimonial.clientName}
                  className="w-10 h-10 rounded-full object-cover"
                  widths={[40, 80]}
                  sizes="40px"
                />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{testimonial.clientName}</p>
                  <p className="text-xs text-gray-500">{testimonial.clientRole}, {testimonial.clientCompany}</p>
                </div>
              </div>
              
              {testimonial.projectUrl && (
                <Link 
                  to={testimonial.projectUrl} 
                  className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#0015AA] hover:text-[#FBB03B] transition-colors"
                >
                  View Case Study
                  <BsArrowRight className="w-4 h-4" />
                </Link>
              )}
            </animated.article>
          ))}
        </div>
      </animated.section>
    );
  }

  if (variant === 'featured') {
    return (
      <animated.div style={containerSpring} className={`${className}`}>
        {showSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": displayTestimonials[0]?.clientName,
                  "jobTitle": displayTestimonials[0]?.clientRole,
                },
                "datePublished": displayTestimonials[0]?.date,
                "reviewBody": displayTestimonials[0]?.text,
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": displayTestimonials[0]?.rating,
                  "bestRating": "5",
                  "worstRating": "1",
                },
                "itemReviewed": {
                  "@type": "Service",
                  "name": displayTestimonials[0]?.projectType,
                  "provider": { "@id": "https://vistaforge.com/#organization" },
                },
              }),
            }}
          />
        )}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
          <BsQuote className="w-16 h-16 text-[#FBB03B]/20 absolute top-6 right-6" />
          
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#0015AA]/10 text-[#0015AA] text-sm font-bold px-3 py-1 rounded-full">
              Client Success Story
            </span>
            <span className="text-gray-500 text-sm">{displayTestimonials[0]?.date}</span>
          </div>
          
          <div className="mb-6">
            {renderStars(displayTestimonials[0]?.rating || 5)}
          </div>
          
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed mb-8 max-w-4xl">
            &ldquo;{displayTestimonials[0]?.text}&rdquo;
          </blockquote>
          
          {displayTestimonials[0]?.metrics && (
            <div className="bg-[#0015AA]/5 rounded-xl p-4 mb-6 inline-flex items-center gap-4">
              <BsCheckCircle className="w-6 h-6 text-[#FBB03B] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">{displayTestimonials[0].metrics.label}</p>
                <p className="text-2xl font-bold text-[#0015AA]">{displayTestimonials[0].metrics.value}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <OptimizedImage
              src={displayTestimonials[0]?.clientImage}
              alt={displayTestimonials[0]?.clientName}
              className="w-12 h-12 rounded-full object-cover"
              widths={[48, 96]}
              sizes="48px"
            />
            <div>
              <p className="font-bold text-gray-900">{displayTestimonials[0]?.clientName}</p>
              <p className="text-sm text-[#FBB03B]">{displayTestimonials[0]?.clientRole}</p>
              <p className="text-xs text-gray-500">{displayTestimonials[0]?.clientCompany}</p>
            </div>
          </div>
        </div>
      </animated.div>
    );
  }

  // Carousel variant
  return (
    <animated.section style={containerSpring} className={`${className}`}>
{showSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                "itemListElement": displayTestimonials.map((t, i) => ({
                  "@type": "ListItem",
                  "position": i + 1,
                  "item": {
                    "@type": "Review",
                    "author": {
                      "@type": "Person",
                      "name": t.clientName,
                      "jobTitle": t.clientRole,
                      "worksFor": { "@type": "Organization", "name": t.clientCompany },
                    },
                    "datePublished": t.date,
                    "reviewBody": t.text,
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": t.rating,
                      "bestRating": "5",
                      "worstRating": "1",
                    },
                    "itemReviewed": {
                      "@type": "Service",
                      "name": t.projectType,
                      "provider": { "@id": "https://vistaforge.com/#organization" },
                    },
                  },
                })),
              }),
            }}
          />
        )}
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {displayTestimonials.map((testimonial, index) => (
              <animated.div key={testimonial.id} style={cardSpring(index)} className="w-full flex-shrink-0 px-4">
                <article className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 h-full max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <OptimizedImage
                      src={testimonial.companyLogo}
                      alt={`${testimonial.clientCompany} logo`}
                      className="w-12 h-12 rounded-lg object-contain bg-gray-50 p-2"
                      widths={[48, 96]}
                      sizes="48px"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.clientCompany}</p>
                      <p className="text-sm text-gray-500">{testimonial.projectType}</p>
                    </div>
                  </div>
                  
                  <BsQuote className="w-10 h-10 text-[#FBB03B]/30 mb-4" />
                  
                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                    &ldquo;{testimonial.text}&rdquo;
                  </blockquote>
                  
                  <div className="flex items-center gap-4 mb-6">
                    {renderStars(testimonial.rating)}
                    <span className="text-sm text-gray-500 ml-2">({testimonial.rating}.0)</span>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <OptimizedImage
                      src={testimonial.clientImage}
                      alt={testimonial.clientName}
                      className="w-12 h-12 rounded-full object-cover"
                      widths={[48, 96]}
                      sizes="48px"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.clientName}</p>
                      <p className="text-sm text-[#FBB03B]">{testimonial.clientRole}</p>
                      <p className="text-xs text-gray-500">{testimonial.clientCompany}</p>
                    </div>
                  </div>
                  
                  {testimonial.projectUrl && (
                    <Link 
                      to={testimonial.projectUrl} 
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0015AA] hover:text-[#FBB03B] transition-colors"
                    >
                      View Case Study
                      <BsArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </article>
              </animated.div>
            ))}
          </div>
        </div>
        
        {displayTestimonials.length > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-[#0015AA] hover:text-white hover:border-[#0015AA] transition-all duration-200 shadow-lg"
              aria-label="Previous testimonial"
            >
              <BsArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {displayTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i === currentIndex
                      ? 'bg-[#0015AA] w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-[#0015AA] hover:text-white hover:border-[#0015AA] transition-all duration-200 shadow-lg"
              aria-label="Next testimonial"
            >
              <BsArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </animated.section>
  );
};

export default Testimonials;