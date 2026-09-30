import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BsRocket,
  BsGraphUpArrow,
  BsLaptop,
  BsCheckCircle,
  BsXCircle,
  BsLightning,
  BsShield,
  BsPeople,
} from 'react-icons/bs';
import { useSpring, animated as Animated } from 'react-spring';
import './PackagedServices.css';

const PACKAGES = [
  {
    id: 'startup-launch',
    name: 'Startup Launch Pack',
    tagline: 'From idea to investor-ready brand in 6 weeks',
    icon: BsRocket,
    color: '#0015AA',
    bgColor: 'bg-[#0015AA]/5',
    borderColor: 'border-[#0015AA]',
    price: { ghs: '₵8,500', usd: '$550', eur: '€500' },
    timeline: '6 weeks',
    idealFor: 'Pre-seed startups, founders raising first round',
    includes: [
      'Brand strategy workshop (2 sessions)',
      'Brand positioning & messaging framework',
      'Logo design + full visual identity system',
      'Brand guidelines document (15+ pages)',
      '1-page investor-ready website (Responsive)',
      'Pitch deck template (15 slides, branded)',
      'Social media starter kit (templates + 10 posts)',
      'Business card & letterhead design',
      '2 rounds of revisions per deliverable',
    ],
    notIncludes: [
      'E-commerce functionality',
      'Custom web app development',
      'Ongoing marketing retainer',
      'Print production management',
    ],
    cta: 'Start My Launch Pack',
    popular: false,
  },
  {
    id: 'rebrand-scale',
    name: 'Rebrand & Scale',
    tagline: 'Modernize your brand for Series A growth',
    icon: BsGraphUpArrow,
    color: '#FBB03B',
    bgColor: 'bg-[#FBB03B]/10',
    borderColor: 'border-[#FBB03B]',
    price: { ghs: '₵18,000', usd: '$1,150', eur: '€1,050' },
    timeline: '8-10 weeks',
    idealFor: 'Growth-stage companies, Series A-B, expanding teams',
    includes: [
      'Comprehensive brand audit & competitive analysis',
      'Stakeholder interviews (up to 5)',
      'Refined brand strategy & architecture',
      'Logo evolution + complete identity system',
      'Extended brand guidelines (30+ pages)',
      'Marketing website (8-12 pages, CMS-enabled)',
      'Blog/insights section setup',
      'Case study & testimonial templates',
      'Email newsletter design system',
      'Internal brand launch kit (slides, swag specs)',
      '3 months brand guardianship support',
      '3 rounds of revisions per deliverable',
    ],
    notIncludes: [
      'Mobile app design/development',
      'Paid media management',
      'Video production',
      'Physical signage production',
    ],
    cta: 'Start Rebrand Project',
    popular: true,
  },
  {
    id: 'digital-product',
    name: 'Digital Product Design',
    tagline: 'User-centered design for web & mobile products',
    icon: BsLaptop,
    color: '#00A86B',
    bgColor: 'bg-[#00A86B]/5',
    borderColor: 'border-[#00A86B]',
    price: { ghs: '₵12,000', usd: '$770', eur: '€700' },
    timeline: '6-8 weeks',
    idealFor: 'SaaS founders, FinTech, HealthTech, EdTech teams',
    includes: [
      'User research & persona development (5-8 users)',
      'User journey mapping & flow diagrams',
      'Wireframes (low-fi) for core user flows',
      'High-fidelity UI design (15-25 screens)',
      'Interactive prototype (Figma)',
      'Design system (components, tokens, docs)',
      'Usability testing (2 rounds, 5 users each)',
      'Developer handoff (Zeplin/Figma Dev Mode)',
      'Design QA during implementation (10 hrs)',
      'Accessibility audit (WCAG 2.1 AA)',
    ],
    notIncludes: [
      'Frontend development/implementation',
      'Backend architecture',
      'Brand strategy (separate package)',
      'Ongoing product design retainer',
    ],
    cta: 'Design My Product',
    popular: false,
  },
];

const PackagedServices = () => {
  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 120, friction: 14 },
  });

  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll position so the dot indicator follows the visible card.
  const syncActiveIndex = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const cardWidth = el.firstElementChild?.offsetWidth || 0;
    if (cardWidth === 0) return;

    const gap = 24;
    const index = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(index, 0), PACKAGES.length - 1));
  }, []);

  // Vertical wheel/trackpad swipes scroll the carousel horizontally, but only
  // while there is room to move. At either end the page keeps scrolling so the
  // user is never trapped.
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const onWheel = (event) => {
      const deltaY = event.deltaY;
      const deltaX = event.deltaX;
      // Already-horizontal intent (trackpad swipe or shift+wheel): let the
      // browser handle it natively.
      if (Math.abs(deltaX) > Math.abs(deltaY)) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft >= maxScroll - 1;

      // Allow page scrolling when the gesture points past the available range.
      if ((deltaY < 0 && atStart) || (deltaY > 0 && atEnd)) return;

      event.preventDefault();
      el.scrollLeft += deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Left/Right arrow keys move the carousel when it has focus.
  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrev();
    }
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    syncActiveIndex();
    el.addEventListener('scroll', syncActiveIndex, { passive: true });
    window.addEventListener('resize', syncActiveIndex);
    return () => {
      el.removeEventListener('scroll', syncActiveIndex);
      window.removeEventListener('resize', syncActiveIndex);
    };
  }, [syncActiveIndex]);

  const scrollToCard = (index) => {
    const el = trackRef.current;
    if (!el) return;

    const card = el.children[index];
    if (!card) return;

    el.scrollTo({
      left: card.offsetLeft - el.offsetLeft,
      behavior: 'smooth',
    });
  };

  const handlePrev = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    if (!card) return;
    el.scrollBy({ left: -(card.offsetWidth + 24), behavior: 'smooth' });
  };

  const handleNext = () => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    if (!card) return;
    el.scrollBy({ left: card.offsetWidth + 24, behavior: 'smooth' });
  };

  const renderCheck = (included) => (
    <span className="flex items-center text-gray-700 text-sm">
      <BsCheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
      <span>{included}</span>
    </span>
  );

  const renderCross = (excluded) => (
    <span className="flex items-center text-gray-400 text-sm line-through">
      <BsXCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
      <span>{excluded}</span>
    </span>
  );

  return (
    <Animated.section style={containerSpring} className="py-20 bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Packaged Offers</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0015AA] mt-2">
            Clear Scope. Fixed Price. No Surprises.
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the package that matches your stage. Each includes everything you need — no hidden fees, no scope creep.
          </p>
        </div>
      </div>

      {/* Carousel position indicator. Movement is handled by dragging,
          trackpad/wheel, touch swipe, the scrollbar, and arrow keys. */}
      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 flex items-center justify-center mb-6">
        <div className="flex items-center gap-2" role="tablist" aria-label="Package navigation">
          {PACKAGES.map((pkg, i) => (
            <button
              key={pkg.id}
              type="button"
              role="tab"
              aria-selected={activeIndex === i}
              aria-label={`Show ${pkg.name}`}
              onClick={() => scrollToCard(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-6 bg-[#0015AA]' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Full-bleed track: cards are wide enough that feature lists and price
          rows stay on one line. Scroll-snap gives carousel behaviour without
          hiding content from keyboard or trackpad users. */}
      <div
        ref={trackRef}
        className="pkg-carousel flex gap-6 overflow-x-auto scroll-smooth pt-6 pb-6"
        style={{ scrollSnapType: 'x mandatory' }}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Package offers carousel. Use left and right arrow keys to browse."
      >
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            id={pkg.id}
            className={`pkg-carousel-card relative ${pkg.bgColor} rounded-2xl p-7 ${pkg.borderColor} border-2 shadow-xl flex flex-col scroll-mt-20`}
            style={{ scrollSnapAlign: 'start' }}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span
                  className="inline-block text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg"
                  style={{ backgroundColor: pkg.color }}
                >
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${pkg.bgColor} ${pkg.borderColor} border`}
              >
                <pkg.icon size={32} style={{ color: pkg.color }} />
              </div>
              <h3 className="text-2xl font-bold text-[#0015AA] whitespace-nowrap">{pkg.name}</h3>
              <p className="mt-2 text-gray-600 text-sm whitespace-nowrap">{pkg.tagline}</p>
            </div>

            <div className="mb-6 p-5 bg-white/50 rounded-xl border border-gray-100">
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div>
                  <p className="text-3xl font-bold text-[#0015AA] whitespace-nowrap">{pkg.price.ghs}</p>
                  <p className="text-xs text-gray-500">GHS</p>
                </div>
                <div className="border-l border-gray-200">
                  <p className="text-3xl font-bold text-[#0015AA] whitespace-nowrap">{pkg.price.usd}</p>
                  <p className="text-xs text-gray-500">USD</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#0015AA] whitespace-nowrap">{pkg.price.eur}</p>
                  <p className="text-xs text-gray-500">EUR</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <BsLightning className="w-4 h-4 flex-shrink-0" /> {pkg.timeline}
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <BsPeople className="w-4 h-4 flex-shrink-0" /> {pkg.idealFor}
                </span>
              </div>
            </div>

            <div className="flex-1 mb-6">
              <h4 className="font-semibold text-[#0015AA] mb-3 flex items-center gap-2">
                <BsCheckCircle className="w-5 h-5 text-green-500" /> What&apos;s Included
              </h4>
              <ul className="space-y-2">
                {pkg.includes.map((item, i) => (
                  <li key={i}>{renderCheck(item)}</li>
                ))}
              </ul>
            </div>

            <details className="mb-6 group">
              <summary className="flex items-center justify-between text-sm text-gray-500 cursor-pointer font-medium">
                <span>What&apos;s not included</span>
                <BsLightning className="w-4 h-4 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="mt-3 space-y-1 pl-2 border-l border-gray-200">
                {pkg.notIncludes.map((item, i) => (
                  <li key={i}>{renderCross(item)}</li>
                ))}
              </ul>
            </details>

            <button
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 whitespace-nowrap"
              style={
                pkg.popular
                  ? { backgroundColor: pkg.color, color: '#fff' }
                  : { backgroundColor: '#fff', color: pkg.color, borderColor: pkg.color, borderWidth: 2 }
              }
            >
              {pkg.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-4">Need something custom? We also offer à la carte services.</p>
          <a
            href="/contact"
            className="inline-block bg-[#0015AA] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Request Custom Quote
          </a>
        </div>
      </div>
    </Animated.section>
  );
};

export default PackagedServices;
