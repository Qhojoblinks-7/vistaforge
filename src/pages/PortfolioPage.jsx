import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from 'react-spring';
import { BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

// Detailed data for your portfolio projects
const PROJECTS = [
  {
    name: "SunRise Foods",
    clientType: "SME",
    industry: "FMCG",
    intro: "SunRise Foods is an Accra-based SME producing organic snacks for local supermarkets and schools. They needed to stand out in a competitive FMCG market.",
    logo: "https://via.placeholder.com/150/FBB03B/fff?text=SF",
    caseStudy: {
      challenge: "Outdated packaging and no online presence made them invisible to a growing health-conscious audience.",
      solution: "VistaForge redesigned their logo, built a vibrant packaging system, and developed an e-commerce-ready website.",
      servicesUsed: ["Logo Design", "Brand Identity", "Web Design", "Print Design"],
      visuals: {
        logoVariations: "https://via.placeholder.com/800x200/FBB03B/fff?text=Logo+Variations",
        packagingMockups: "https://via.placeholder.com/800x500/FBB03B/fff?text=Packaging+Mockups",
        websiteHomepage: "https://via.placeholder.com/800x500/FBB03B/fff?text=Website+Homepage+Mockup",
      },
      results: "Post-launch, SunRise Foods reported a 25% increase in retail orders within 3 months."
    }
  },
  {
    name: "SwiftPay",
    clientType: "Fintech Startup",
    industry: "Fintech",
    intro: "SwiftPay is a Ghanaian fintech startup offering mobile-based international transfers for SMEs and individuals.",
    logo: "https://via.placeholder.com/150/0015AA/fff?text=SP",
    caseStudy: {
      challenge: "Their early-stage brand lacked the trust and professional credibility needed to attract serious investment and users.",
      solution: "We designed a sleek logo, created a fintech-inspired brand identity, and built a UI/UX prototype for their mobile app.",
      servicesUsed: ["Logo Design", "Brand Identity", "Brand Strategy", "Digital Assets"],
      visuals: {
        logoAndIdentity: "https://via.placeholder.com/800x400/0015AA/fff?text=Logo+and+Brand+Identity",
        appUIMockups: "https://via.placeholder.com/800x500/0015AA/fff?text=App+UI+Mockups",
      },
      results: "SwiftPay secured a significant round of seed funding after presenting the refined brand identity to investors."
    }
  },
  {
    name: "EduBridge Ghana",
    clientType: "Non-profit",
    industry: "Education",
    intro: "EduBridge is a non-profit organization that connects rural students with digital learning resources.",
    logo: "https://via.placeholder.com/150/8a2be2/fff?text=EG",
    caseStudy: {
      challenge: "Their old branding felt corporate and didn’t connect emotionally with their donors or student audience.",
      solution: "VistaForge created a human-centered identity with warm tones, redesigned their website, and provided social media branding templates.",
      servicesUsed: ["Brand Identity", "Web Design", "Digital Assets", "Brand Strategy"],
      visuals: {
        brandIdentity: "https://via.placeholder.com/800x400/8a2be2/fff?text=EduBridge+Brand+Identity",
        websiteMockup: "https://via.placeholder.com/800x500/8a2be2/fff?text=Website+Mockup",
        socialMediaTemplates: "https://via.placeholder.com/800x300/8a2be2/fff?text=Social+Media+Templates",
      },
      results: "EduBridge increased donor engagement by 40% after the rebrand, leading to a significant boost in fundraising."
    }
  },
  {
    name: "KenteMode",
    clientType: "Clothing Brand",
    industry: "Fashion",
    intro: "KenteMode is a fashion brand blending traditional Ghanaian fabrics with modern streetwear.",
    logo: "https://via.placeholder.com/150/6A0DAD/fff?text=KM",
    caseStudy: {
      challenge: "Their visuals didn’t reflect their bold and creative designs, limiting appeal beyond local buyers.",
      solution: "We built a bold logo, created an online store, and designed a lookbook-driven campaign for Instagram.",
      servicesUsed: ["Logo Design", "Brand Identity", "Web Design", "Digital Assets"],
      visuals: {
        logoDesign: "https://via.placeholder.com/800x200/6A0DAD/fff?text=KenteMode+Logo+Design",
        onlineStore: "https://via.placeholder.com/800x500/6A0DAD/fff?text=Online+Store+Mockup",
        instagramCampaign: "https://via.placeholder.com/800x300/6A0DAD/fff?text=Instagram+Campaign",
      },
      results: "KenteMode attracted an international audience and increased online orders by 60% in the first quarter post-launch."
    }
  },
  {
    name: "BrightFuture Academy",
    clientType: "Private School",
    industry: "Education",
    intro: "BrightFuture Academy is a private school in Tema aiming to modernize its image and attract more parents.",
    logo: "https://via.placeholder.com/150/003366/fff?text=BFA",
    caseStudy: {
      challenge: "Their outdated website and inconsistent branding made them less appealing compared to competitors.",
      solution: "VistaForge refreshed their logo, built a parent-friendly website, and introduced a student portal design concept.",
      servicesUsed: ["Logo Design", "Web Design", "Digital Assets"],
      visuals: {
        logoRedesign: "https://via.placeholder.com/800x200/003366/fff?text=Logo+Redesign",
        websiteMockup: "https://via.placeholder.com/800x500/003366/fff?text=Website+Mockup",
      },
      results: "Applications increased by 30% after the launch of the new brand, boosting enrollment and community trust."
    }
  },
];

const PortfolioPage = () => {
  // Create separate state for each project to avoid hooks in callbacks
  const [isHovered0, setIsHovered0] = useState(false);
  const [isExpanded0, setIsExpanded0] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isExpanded1, setIsExpanded1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [isHovered3, setIsHovered3] = useState(false);
  const [isExpanded3, setIsExpanded3] = useState(false);
  const [isHovered4, setIsHovered4] = useState(false);
  const [isExpanded4, setIsExpanded4] = useState(false);

  const setHoverStates = [setIsHovered0, setIsHovered1, setIsHovered2, setIsHovered3, setIsHovered4];
  const expandedStates = [isExpanded0, isExpanded1, isExpanded2, isExpanded3, isExpanded4];
  const setExpandedStates = [setIsExpanded0, setIsExpanded1, setIsExpanded2, setIsExpanded3, setIsExpanded4];

  // Create separate animation configurations for each project
  const hoverPanel0 = useSpring({
    opacity: isHovered0 ? 1 : 0,
    height: isHovered0 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const expandedPanel0 = useSpring({
    opacity: isExpanded0 ? 1 : 0,
    height: isExpanded0 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const fadeIn0 = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 200,
    config: { tension: 120, friction: 14 }
  });

  const hoverPanel1 = useSpring({
    opacity: isHovered1 ? 1 : 0,
    height: isHovered1 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const expandedPanel1 = useSpring({
    opacity: isExpanded1 ? 1 : 0,
    height: isExpanded1 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const fadeIn1 = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 300,
    config: { tension: 120, friction: 14 }
  });

  const hoverPanel2 = useSpring({
    opacity: isHovered2 ? 1 : 0,
    height: isHovered2 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const expandedPanel2 = useSpring({
    opacity: isExpanded2 ? 1 : 0,
    height: isExpanded2 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const fadeIn2 = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 400,
    config: { tension: 120, friction: 14 }
  });

  const hoverPanel3 = useSpring({
    opacity: isHovered3 ? 1 : 0,
    height: isHovered3 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const expandedPanel3 = useSpring({
    opacity: isExpanded3 ? 1 : 0,
    height: isExpanded3 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const fadeIn3 = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 500,
    config: { tension: 120, friction: 14 }
  });

  const hoverPanel4 = useSpring({
    opacity: isHovered4 ? 1 : 0,
    height: isHovered4 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const expandedPanel4 = useSpring({
    opacity: isExpanded4 ? 1 : 0,
    height: isExpanded4 ? "auto" : 0,
    overflow: 'hidden',
    config: { tension: 200, friction: 20 }
  });
  const fadeIn4 = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 600,
    config: { tension: 120, friction: 14 }
  });

  const hoverPanels = [hoverPanel0, hoverPanel1, hoverPanel2, hoverPanel3, hoverPanel4];
  const expandedPanels = [expandedPanel0, expandedPanel1, expandedPanel2, expandedPanel3, expandedPanel4];
  const fadeIns = [fadeIn0, fadeIn1, fadeIn2, fadeIn3, fadeIn4];

  return (
    <main className="bg-white" id="main-content">
      <Helmet>
        <title>Portfolio - VistaForge Brand Design & Creative Projects</title>
        <meta name="description" content="Explore VistaForge's portfolio of successful brand design projects. See how we've helped startups, SMEs, and organizations create powerful brand identities and digital experiences." />
        <meta name="keywords" content="brand design portfolio, creative projects, logo design examples, brand identity case studies, web design portfolio, Ghana design agency" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vistaforge.com/portfolio" />
        <meta property="og:title" content="Portfolio - VistaForge Brand Design & Creative Projects" />
        <meta property="og:description" content="Explore our portfolio of successful brand design projects and see how we've helped businesses create powerful brand identities." />
        <meta property="og:image" content="https://vistaforge.com/portfolio-og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="VistaForge" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://vistaforge.com/portfolio" />
        <meta property="twitter:title" content="Portfolio - VistaForge Brand Design & Creative Projects" />
        <meta property="twitter:description" content="Explore our portfolio of successful brand design projects and see how we've helped businesses create powerful brand identities." />
        <meta property="twitter:image" content="https://vistaforge.com/portfolio-twitter-image.jpg" />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="VistaForge" />
        <meta name="language" content="English" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://vistaforge.com/portfolio" />

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
                "name": "Portfolio",
                "item": "https://vistaforge.com/portfolio"
              }
            ]
          })}
        </script>
      </Helmet>
      {/* Intro Section with Subtle Shapes */}
      <section className="relative bg-white text-[#0015AA] py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large Blue Circle (top-left) */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#0015AA] opacity-15 rounded-full animate-pulse-slow"></div>
          {/* Medium Yellow Circle (bottom-right) */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#FBB03B] opacity-15 rounded-full animate-pulse-slow delay-200"></div>
          {/* Small Yellow Square (center-left) */}
          <div className="absolute top-1/4 left-0 w-32 h-32 bg-[#FBB03B] opacity-15 rotate-45 animate-spin-slow"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Our Portfolio
          </h1>
          <p className="mt-6 text-lg max-w-3xl mx-auto">
            Every brand has its own story. Here’s how we’ve helped businesses—from startups to corporates—craft stronger identities and digital presences.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto space-y-24">
          {PROJECTS.map((project, index) => {
            const isOdd = index % 2 !== 0;

            // Use state arrays for hover and expanded states
            const setIsHovered = setHoverStates[index];
            const [isExpanded, setIsExpanded] = [expandedStates[index], setExpandedStates[index]];

            // Use pre-defined animation configurations
            const hoverPanel = hoverPanels[index];
            const expandedPanel = expandedPanels[index];
            const fadeIn = fadeIns[index];

            return (
              <animated.div
                key={index}
                style={fadeIn}
                className="group w-full bg-gray-50 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  // Optionally collapse full view on mouse leave as well
                  // if (!isExpanded) setIsExpanded(false); 
                }}
              >
                {/* Collapsed View (always visible) */}
                <div className={`flex flex-col p-8 md:flex-row md:items-center md:gap-12 ${isOdd ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-1/2 flex justify-center items-center p-6">
                    <img
                      src={project.logo}
                      alt={`${project.name} Logo`}
                      className="w-36 h-36 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="md:w-1/2 text-center md:text-left mt-6 md:mt-0">
                    <h3 className="text-3xl font-bold text-[#0015AA]">{project.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {project.clientType} • {project.industry}
                    </p>
                    <p className="mt-4 text-lg text-gray-700">
                      {project.intro}
                    </p>
                  </div>
                </div>

                {/* Hover-Expanded Content (Challenge & Solution) */}
                <animated.div style={hoverPanel}>
                  <div className="p-8 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h4 className="font-bold text-[#0015AA]">Challenge</h4>
                        <p className="text-gray-700 text-sm mt-2">{project.caseStudy.challenge}</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h4 className="font-bold text-[#0015AA]">Solution</h4>
                        <p className="text-gray-700 text-sm mt-2">{project.caseStudy.solution}</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h4 className="font-bold text-[#0015AA]">Results</h4>
                        <p className="text-gray-700 text-sm mt-2">{project.caseStudy.results}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center text-[#0015AA] font-bold py-2 px-4 rounded-full transition-all duration-300 hover:bg-gray-100"
                        >
                            {isExpanded ? "Hide Full Case Study" : "See Full Case Study"} <BsArrowRight className={`ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
                        </button>
                    </div>
                  </div>
                </animated.div>

                {/* Full Case Study Content (unfolds on button click) */}
                <animated.div style={expandedPanel}>
                  <div className="p-8 border-t border-gray-200 mt-4 space-y-8">
                    <h4 className="text-2xl font-bold text-[#0015AA] text-center mb-6">Services Provided</h4>
                    <ul className="flex flex-wrap justify-center gap-4 text-lg font-semibold text-gray-700">
                        {project.caseStudy.servicesUsed.map((service, i) => (
                            <li key={i} className="bg-gray-200 py-1 px-4 rounded-full">{service}</li>
                        ))}
                    </ul>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                        {Object.keys(project.caseStudy.visuals).map((key, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                                <h5 className="font-bold text-[#0015AA] text-xl mb-4 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h5>
                                <img 
                                    src={project.caseStudy.visuals[key]} 
                                    alt={`${project.name} ${key.replace(/([A-Z])/g, ' $1').trim()}`} 
                                    className="w-full h-auto rounded-lg object-cover" 
                                />
                            </div>
                        ))}
                    </div>
                  </div>
                </animated.div>
              </animated.div>
            );
          })}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-[#0015AA] text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold">Inspired by our work?</h2>
          <p className="mt-4 text-xl max-w-2xl mx-auto">
            Let’s make your brand the next success story.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </main>
  );
};

export default PortfolioPage;