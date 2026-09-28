import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from 'react-spring';
import { BsChevronDown, BsChevronUp, BsSearch, BsTag } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const FAQ_DATA = [
  {
    category: 'General',
    questions: [
      {
        question: 'What makes VistaForge different from other design agencies?',
        answer: 'VistaForge combines deep understanding of the African market with global design standards. We\'re not just designers — we\'re strategic partners invested in your business success, offering end-to-end brand solutions from strategy to implementation. Our team has helped 12+ African startups raise over $4.2M in funding.',
      },
      {
        question: 'Do you work with startups and small businesses?',
        answer: 'Absolutely! We specialize in working with startups and small businesses in Ghana and across Africa. Our flexible packages and payment terms are designed to support growing businesses with limited budgets. Our Startup Launch Pack (₵8,500 / $550) includes everything a pre-seed founder needs.',
      },
      {
        question: 'Where are you located? Do you work remotely?',
        answer: 'Our studio is based in Accra, Ghana, but we work with clients across Africa (Nigeria, Kenya, South Africa, Rwanda) and internationally. Our process is fully remote-friendly with structured video calls, Figma collaboration, and async updates.',
      },
      {
        question: 'How do I get started?',
        answer: 'Book a free 30-minute consultation via our contact page or use our Project Starter wizard. We\'ll discuss your goals, timeline, and budget, then recommend the right package or custom scope.',
      },
    ],
  },
  {
    category: 'Branding & Strategy',
    questions: [
      {
        question: 'How much does professional logo design cost in Ghana?',
        answer: 'Professional logo design in Ghana costs between ₵600 to ₵2,000 ($40–$130) depending on complexity and deliverables. Our packages include multiple concepts, unlimited revisions within scope, and all file formats needed for print and digital use (AI, EPS, SVG, PNG, JPG).',
      },
      {
        question: 'How long does it take to complete a brand identity project?',
        answer: 'A complete brand identity project typically takes 4–8 weeks. This includes brand strategy (2 weeks), design development (2–4 weeks), and final implementation (1–2 weeks). Rush orders are available for an additional fee. Our Rebrand & Scale package takes 8–10 weeks for more comprehensive work.',
      },
      {
        question: 'What\'s included in a brand identity system?',
        answer: 'Our brand identity systems include: logo variations (primary, secondary, icon), color palette with usage specs, typography system, iconography style, photography/illustration direction, brand guidelines document (15–30 pages), and templates for social media, presentations, email signatures, and stationery.',
      },
      {
        question: 'Can you help with brand strategy before design?',
        answer: 'Yes, and we strongly recommend it. Our Brand Strategy Workshop (₵2,000–₵5,000) includes market research, competitor analysis, audience personas, positioning statement, messaging framework, and brand architecture. Strategy-first approach prevents expensive rework later.',
      },
    ],
  },
  {
    category: 'Web Design & Development',
    questions: [
      {
        question: 'How much does a website cost in Ghana?',
        answer: 'Website design and development in Ghana ranges from ₵1,200 for a 4-page business site to ₵4,500+ for multi-page corporate or e-commerce websites ($80–$290+). All our websites are responsive, CMS-enabled (WordPress/Webflow), include basic SEO setup, analytics, and 30 days of support.',
      },
      {
        question: 'Do you use WordPress, Webflow, or custom code?',
        answer: 'We use the right tool for your needs: WordPress for content-heavy sites needing easy updates, Webflow for design-forward marketing sites with clean code export, and custom React/Next.js for complex web applications. We\'ll recommend the best fit during consultation.',
      },
      {
        question: 'Will my website be mobile-friendly and fast?',
        answer: 'Absolutely. Every site we build is mobile-first responsive, optimized for Core Web Vitals (LCP < 2.5s, CLS < 0.1), and includes image optimization, lazy loading, and minified assets. We test on real devices across African network conditions.',
      },
      {
        question: 'Do you provide hosting and maintenance?',
        answer: 'We set up hosting on reliable platforms (Vercel, Netlify, AWS, or local Ghanaian hosts) and provide 30 days of post-launch support. Ongoing maintenance packages start at ₵500/month and include security updates, backups, content updates, and performance monitoring.',
      },
    ],
  },
  {
    category: 'UI/UX & Product Design',
    questions: [
      {
        question: 'What\'s your process for designing a mobile app or SaaS product?',
        answer: 'Our Digital Product Design package (₵12,000 / $770, 6–8 weeks) follows a 6-week process: Discovery & compliance audit → User research & journey mapping → Information architecture & flow design → Wireframes & low-fi prototyping → High-fidelity UI & design system → Prototype, usability testing & developer handoff. Includes accessibility audit (WCAG 2.1 AA).',
      },
      {
        question: 'Do you do user research and usability testing?',
        answer: 'Yes, it\'s built into our process. We conduct 8–12 user interviews, contextual inquiry, and run 2 rounds of usability testing (5 users each) with think-aloud protocol. We measure task completion rate, error rate, and SUS score. This is non-negotiable for FinTech and HealthTech products.',
      },
      {
        question: 'What design tools do you use?',
        answer: 'Primary: Figma (design, prototyping, design systems, Dev Mode handoff). Supporting: FigJam for workshops, Maze for unmoderated testing, Stark for accessibility auditing. We provide organized Figma files with auto-layout, components, and design tokens ready for developers.',
      },
      {
        question: 'Can you work with our existing development team?',
        answer: 'Yes. Our handoff includes: annotated Figma specs, design tokens (colors, spacing, typography), component library with all states, interaction specs, accessibility annotations, and 10 hours of design QA during implementation. We\'ve cut frontend dev time by 40% for teams using our handoff.',
      },
    ],
  },
  {
    category: 'Pricing & Payments',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfer (Ghana, Nigeria, Kenya, South Africa), mobile money (MTN MoMo, AirtelTigo Cash, M-Pesa), card payments via Flutterwave/Paystack, and international wire transfer (USD/EUR). 50% deposit to start, 50% on delivery. Monthly installments available for projects over ₵10,000.',
      },
      {
        question: 'Are there any hidden fees?',
        answer: 'No. Our packaged offers include everything listed — no surprise add-ons. Additional costs only apply if you request scope changes outside the agreed deliverables, and we\'ll always quote those separately before proceeding. Print production, stock photography, and third-party licenses are separate.',
      },
      {
        question: 'Do you offer discounts for non-profits or early-stage startups?',
        answer: 'We offer a 15% discount for registered non-profits and social enterprises. For pre-revenue startups, we can structure payment plans over 3–6 months. We also reserve 2 pro-bono slots per year for high-impact social ventures — apply via our contact form.',
      },
      {
        question: 'What currencies do you quote in?',
        answer: 'We quote in GHS (Ghana Cedis), USD (US Dollars), and EUR (Euros). Exchange rates are locked at project start. Current rates: 1 USD = ~15.5 GHS, 1 EUR = ~16.8 GHS. All contracts specify the locked rate.',
      },
    ],
  },
  {
    category: 'Process & Delivery',
    questions: [
      {
        question: 'What\'s your revision policy?',
        answer: 'Our packages include 2–3 rounds of structured revisions per deliverable (depending on package). We use Figma comments for clear, actionable feedback. Additional revision rounds are ₵500–₵1,500 each. We\'ve found 2–3 rounds is sufficient when strategy is aligned upfront.',
      },
      {
        question: 'How do you handle project communication?',
        answer: 'We use a dedicated Slack channel or WhatsApp group for async updates, weekly 30-min video check-ins, and Figma for design feedback. You get a Notion project dashboard with timeline, deliverables, and approval checkpoints. No black-box processes.',
      },
      {
        question: 'What files do I receive at the end?',
        answer: 'Brand: AI, EPS, SVG, PNG (multiple sizes), JPG, brand guidelines (PDF + Figma). Website: Deployed site + CMS access + source code (if custom) + admin guide. UI/UX: Figma file with design system, annotated specs, design tokens (JSON), component library, prototype links, accessibility report.',
      },
      {
        question: 'Do you provide training on using brand assets?',
        answer: 'Yes, all packages include a 1-hour brand usage training session (recorded) covering: logo usage rules, color application, typography, template customization, and common mistakes to avoid. We also provide a brand cheat-sheet (1-page PDF) for quick reference.',
      },
    ],
  },
];

const FAQPage = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 120, friction: 14 },
  });

  const cardSpring = (index) => useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: index * 50,
    config: { tension: 120, friction: 14 },
  });

  const categories = ['All', ...FAQ_DATA.map(c => c.category)];

  const filteredFAQs = FAQ_DATA
    .filter(cat => activeCategory === 'All' || cat.category === activeCategory)
    .flatMap(cat => cat.questions.map(q => ({ ...q, category: cat.category })))
    .filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_DATA.flatMap(cat => 
      cat.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer,
        },
      }))
    ),
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions - Branding, Web Design & UI/UX"
        description="Answers to common questions about VistaForge's services, pricing, process, and working with us. Covers branding, websites, UI/UX, payments, and project delivery."
        keywords="VistaForge FAQ, branding questions, web design pricing Ghana, UI/UX process, logo design cost, payment methods, project timeline"
        image="/hero2.png"
        url="/faq"
        section="FAQ"
        structuredData={faqStructuredData}
      />
      <main className="bg-white" id="main-content">
        {/* Hero Section */}
        <section className="relative bg-[#0015AA] text-white py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow"></div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-700 opacity-20 rotate-45 animate-spin-slow"></div>
          </div>
          <div className="container mx-auto relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Frequently Asked Questions.
            </h1>
            <p className="mt-6 text-lg max-w-3xl mx-auto text-gray-200">
              Everything you need to know about working with VistaForge. Can't find your answer?
              <Link to="/contact" className="text-[#FBB03B] font-bold hover:underline ml-1">
                Ask us directly
              </Link>
            </p>
          </div>
        </section>

        {/* Search & Filter */}
        <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
              <div className="relative">
                <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="faq-search"
                  type="search"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="FAQ categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setExpandedIndex(null); }}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#0015AA] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0015AA] hover:text-[#0015AA]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-4xl">
            <animated.div style={containerSpring}>
              {FAQ_DATA
                .filter(cat => activeCategory === 'All' || cat.category === activeCategory)
                .map((cat, catIndex) => (
                  <div key={cat.category} className="mb-12">
                    <h2 className="text-2xl font-bold text-[#0015AA] mb-6 flex items-center gap-3">
                      <span className="bg-[#0015AA]/10 text-[#0015AA] px-3 py-1 rounded-full text-sm">{cat.category}</span>
                      {cat.category}
                    </h2>
                    <div className="space-y-4">
                      {cat.questions
                        .filter(q => 
                          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((q, qIndex) => (
                          <animated.div key={`${cat.category}-${qIndex}`} style={cardSpring(qIndex)} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => setExpandedIndex(expandedIndex === `${cat.category}-${qIndex}` ? null : `${cat.category}-${qIndex}`)}
                              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:ring-offset-2"
                              aria-expanded={expandedIndex === `${cat.category}-${qIndex}`}
                            >
                              <h3 className="text-lg font-semibold text-gray-900 pr-10">{q.question}</h3>
                              {expandedIndex === `${cat.category}-${qIndex}` ? (
                                <BsChevronUp className="w-6 h-6 text-[#0015AA] flex-shrink-0" />
                              ) : (
                                <BsChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                              )}
                            </button>
                            {expandedIndex === `${cat.category}-${qIndex}` && (
                              <div className="px-6 pb-6 border-t border-gray-100 animate-slide-down">
                                <p className="text-gray-700 leading-relaxed">{q.answer}</p>
                              </div>
                            )}
                          </animated.div>
                        ))}
                    </div>
                  </div>
                ))}
              
              {filteredFAQs.length === 0 && (
                <div className="text-center py-16">
                  <BsSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search or <button onClick={() => setSearchTerm('')} className="text-[#0015AA] font-bold hover:underline">view all questions</button>.</p>
                </div>
              )}
            </animated.div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <div className="bg-[#0015AA] text-white rounded-2xl p-8 md:p-12">
                <h3 className="text-3xl font-bold mb-4">Still Have Questions?</h3>
                <p className="text-gray-200 mb-6 max-w-md mx-auto">
                  Book a free 30-minute consultation and get personalized answers for your specific project.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-[#FBB03B] text-[#0015AA] font-bold py-3 px-8 rounded-full hover:bg-[#E0A030] transition-colors"
                >
                  Book Free Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default FAQPage;