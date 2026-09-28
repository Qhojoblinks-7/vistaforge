import React from 'react';
import { BsRocket, BsGraphUpArrow, BsLaptop, BsCheckCircle, BsXCircle, BsLightning, BsShield, BsPeople } from 'react-icons/bs';
import { useSpring, animated } from 'react-spring';

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
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 120, friction: 14 },
  });

  const cardSpring = (index) => useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 200 + index * 150,
    config: { tension: 120, friction: 14 },
  });

  const renderCheck = (included) => (
    <span className="flex items-center text-gray-700 text-sm">
      <BsCheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
      {included}
    </span>
  );

  const renderCross = (excluded) => (
    <span className="flex items-center text-gray-400 text-sm line-through">
      <BsXCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
      {excluded}
    </span>
  );

  return (
    <animated.section style={containerSpring} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Packaged Offers</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0015AA] mt-2">
            Clear Scope. Fixed Price. No Surprises.
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the package that matches your stage. Each includes everything you need — no hidden fees, no scope creep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, index) => (
            <animated.div key={pkg.id} style={cardSpring(index)} className={`relative ${pkg.bgColor} rounded-2xl p-8 ${pkg.borderColor} border-2 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`inline-block ${pkg.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${pkg.bgColor} ${pkg.borderColor} border`}>
                  <pkg.icon size={32} className={`text-[${pkg.color}]`} />
                </div>
                <h3 className="text-2xl font-bold text-[#0015AA]">{pkg.name}</h3>
                <p className="mt-2 text-gray-600 text-sm">{pkg.tagline}</p>
              </div>

              <div className="mb-6 p-4 bg-white/50 rounded-xl border border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <p className="text-3xl font-bold text-[#0015AA]">{pkg.price.ghs}</p>
                    <p className="text-xs text-gray-500">GHS</p>
                  </div>
                  <div className="border-l border-gray-200">
                    <p className="text-3xl font-bold text-[#0015AA]">{pkg.price.usd}</p>
                    <p className="text-xs text-gray-500">USD</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#0015AA]">{pkg.price.eur}</p>
                    <p className="text-xs text-gray-500">EUR</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BsLightning className="w-4 h-4" /> {pkg.timeline}
                  </span>
                  <span className="flex items-center gap-1">
                    <BsPeople className="w-4 h-4" /> {pkg.idealFor}
                  </span>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <h4 className="font-semibold text-[#0015AA] mb-3 flex items-center gap-2">
                  <BsCheckCircle className="w-5 h-5 text-green-500" /> What's Included
                </h4>
                <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="animate-slide-in">{renderCheck(item)}</li>
                  ))}
                </ul>
              </div>

              <details className="mb-6 group">
                <summary className="flex items-center justify-between text-sm text-gray-500 cursor-pointer font-medium">
                  <span>What's not included</span>
                  <BsLightning className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="mt-3 space-y-1 pl-2 border-l border-gray-200">
                  {pkg.notIncludes.map((item, i) => (
                    <li key={i} className="animate-fade-in">{renderCross(item)}</li>
                  ))}
                </ul>
              </details>

              <button
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${pkg.popular
                  ? `bg-[${pkg.color}] text-white hover:opacity-90 shadow-lg shadow-[${pkg.color}]/30`
                  : `bg-white text-[${pkg.color}] ${pkg.borderColor} border-2 hover:bg-[${pkg.color}]/5`}`}
              >
                {pkg.cta}
              </button>
            </animated.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Need something custom? We also offer à la carte services.</p>
          <a
            href="/contact"
            className="inline-block bg-[#0015AA] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Request Custom Quote
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        details summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </animated.section>
  );
};

export default PackagedServices;