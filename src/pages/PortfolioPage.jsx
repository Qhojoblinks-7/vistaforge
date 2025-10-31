import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from 'react-spring';
import { BsArrowRight } from 'react-icons/bs';
import { Target, Lightbulb, TrendingUp, Search, Cog, CheckCircle, Shield, BarChart3, Quote, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import DesignProjectCard from '../components/DesignProjectCard';
import { fetchPublicProjects } from '../store/slices/publicPortfolioSlice';
import { Link } from 'react-router-dom';

// Detailed data for your portfolio projects, now in a Storytelling Journey format
const PROJECTS = [
    {
        name: "SunRise Foods", clientType: "SME", industry: "FMCG", intro: "SunRise Foods is an Accra-based SME producing organic snacks for local supermarkets and schools. They needed to stand out in a competitive FMCG market.",
        logo: "https://via.placeholder.com/150/FBB03B/fff?text=SF", link: "/projects/sunrise",
        caseStudy: { 
            startingPoint: "As a local SME with high-quality organic snacks, SunRise Foods was held back by outdated packaging and a lack of digital visibility, making them invisible to the growing health-conscious audience.", 
            theTransformation: "We initiated a full brand refresh, designing a vibrant, modern packaging system and developing a seamless e-commerce-ready website to expand their reach beyond local retail.", 
            journeyEnd: "Post-launch, SunRise Foods reported a **25% increase in retail orders** within the first 3 months and successfully launched their direct-to-consumer online channel.", 
            visuals: { 
                logoVariations: "https://via.placeholder.com/800x200/FBB03B/fff?text=Logo+Variations", 
                packagingMockups: "https://via.placeholder.com/800x500/FBB03B/fff?text=Packaging+Mockups", 
                websiteHomepage: "https://via.placeholder.com/800x500/FBB03B/fff?text=Website+Homepage+Mockup", 
            }
        }
    },
    {
        name: "SwiftPay", clientType: "Fintech Startup", industry: "Fintech", intro: "SwiftPay is a Ghanaian fintech startup offering mobile-based international transfers for SMEs and individuals.",
        logo: "https://via.placeholder.com/150/0015AA/fff?text=SP", link: "/projects/swiftpay",
        caseStudy: { 
            startingPoint: "As an early-stage fintech, SwiftPay's initial brand lacked the professional credibility and trust essential to attract serious investment and instill confidence in users making international transfers.", 
            theTransformation: "We engineered a professional, secure brand identity, complete with a sleek logo and a high-fidelity UI/UX prototype for their mobile application, focused on speed and reliability.", 
            journeyEnd: "Armed with a refined, trustworthy brand and solid visual presentation, SwiftPay successfully **secured a significant round of seed funding**, achieving a key business milestone.", 
            visuals: { 
                logoAndIdentity: "https://via.placeholder.com/800x400/0015AA/fff?text=Logo+and+Brand+Identity", 
                appUIMockups: "https://via.placeholder.com/800x500/0015AA/fff?text=App+UI+Mockups", 
            }
        }
    },
    {
        name: "EduBridge Ghana", clientType: "Non-profit", industry: "Education", intro: "EduBridge is a non-profit organization that connects rural students with digital learning resources.",
        logo: "https://via.placeholder.com/150/8a2be2/fff?text=EG", link: "/projects/edubridge",
        caseStudy: { 
            startingPoint: "Their old branding felt corporate and didn’t connect emotionally with their donors or student audience, hindering their fundraising and outreach potential.", 
            theTransformation: "VistaForge created a human-centered identity with warm tones, redesigned their website for better accessibility, and provided streamlined social media branding templates for consistent, emotional messaging.", 
            journeyEnd: "EduBridge saw a powerful increase in emotional resonance, resulting in **donor engagement rising by 40%** and a significant boost in fundraising and community support.", 
            visuals: { 
                brandIdentity: "https://via.placeholder.com/800x400/8a2be2/fff?text=EduBridge+Brand+Identity", 
                websiteMockup: "https://via.placeholder.com/800x500/8a2be2/fff?text=Website+Mockup", 
                socialMediaTemplates: "https://via.placeholder.com/800x300/8a2be2/fff?text=Social+Media+Templates", 
            }
        }
    },
    {
        name: "KenteMode", clientType: "Clothing Brand", industry: "Fashion", intro: "KenteMode is a fashion brand blending traditional Ghanaian fabrics with modern streetwear.",
        logo: "https://via.placeholder.com/150/6A0DAD/fff?text=KM", link: "/projects/kentemode",
        tools: ["figma", "photoshop", "illustrator"],
        deliverables: [
            { title: "Brand Identity", description: "Complete logo design, color palette, and typography system" },
            { title: "E-commerce Store", description: "Full UI/UX design for online shopping platform" },
            { title: "Social Media Kit", description: "Instagram campaign visuals and branded content templates" }
        ],
        designSystem: {
            colors: [
                { name: "Primary", hex: "#6A0DAD" },
                { name: "Secondary", hex: "#FFD700" },
                { name: "Accent", hex: "#FF6B35" },
                { name: "Neutral", hex: "#2D3748" }
            ]
        },
        caseStudy: {
            startingPoint: "KenteMode's bold, modern designs weren't reflected in their online visuals, limiting their appeal and market reach primarily to local buyers rather than an international streetwear audience.",
            theTransformation: "We developed a bold logo, designed a dynamic online store, and created a visually striking, lookbook-driven Instagram campaign to match the brand's creative energy and international aspirations.",
            journeyEnd: "The revamped brand attracted an international audience, leading to an impressive **60% increase in online orders** from outside Ghana in the first quarter post-launch.",
            visuals: {
                logoDesign: "https://via.placeholder.com/800x200/6A0DAD/fff?text=KenteMode+Logo+Design",
                onlineStore: "https://via.placeholder.com/800x500/6A0DAD/fff?text=Online+Store+Mockup",
                instagramCampaign: "https://via.placeholder.placeholder.com/800x300/6A0DAD/fff?text=Instagram+Campaign",
            }
        }
    },
    {
        name: "BrightFuture Academy", clientType: "Private School", industry: "Education", intro: "BrightFuture Academy is a private school in Tema aiming to modernize its image and attract more parents.",
        logo: "https://via.placeholder.com/150/003366/fff?text=BFA", link: "/projects/brightfuture",
        caseStudy: { 
            startingPoint: "The Academy’s outdated digital presence and inconsistent branding made them less competitive in attracting new enrollments compared to modern, private school competitors.", 
            theTransformation: "VistaForge conducted a brand refresh, redesigning the logo, building a parent-friendly, informative website, and introducing a professional student portal concept.", 
            journeyEnd: "The modern image successfully connected with parents, boosting prospective student applications by **30%** and leading to a significant increase in enrollment and community trust.", 
            visuals: { 
                logoRedesign: "https://via.placeholder.com/800x200/003366/fff?text=Logo+Redesign", 
                websiteMockup: "https://via.placeholder.com/800x500/003366/fff?text=Website+Mockup", 
            }
        }
    },
];

const PortfolioPage = () => {
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.publicPortfolio);

    // Transform GraphQL data to match component expectations
    const transformedProjects = projects.map(project => ({
        ...project,
        tools: project.designTools || [], // Map designTools to tools for compatibility
        isDesignProject: project.isDesignProject || (project.designTools && project.designTools.length > 0)
    }));

    // State to control which project is currently displayed in the large, featured slot
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const gridRef = useRef(null);

    // Fetch projects on component mount
    useEffect(() => {
        dispatch(fetchPublicProjects());
    }, [dispatch]);

    const handleProjectClick = (index) => {
        // Set the new active project
        setActiveProjectIndex(index);

        // Scroll to the top of the grid to show the newly featured project immediately
        if (gridRef.current) {
            gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Helper component for the Intro Section
    const IntroSection = () => (
        <section className="relative bg-[#0015AA] text-white py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8 text-center overflow-hidden">
            {/* Subtle Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full">
                {/* Large Yellow Circle (top-left) */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow"></div>
                {/* Medium Blue Square (bottom-right) */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-700 opacity-20 rotate-45 animate-spin-slow"></div>
                {/* Small Yellow Circle (center-right) */}
                <div className="absolute top-1/4 right-0 w-24 h-24 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow delay-300"></div>
                {/* Abstract Wave/Shape (bottom-left) */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-[#FBB03B] to-transparent opacity-15"></div>
                {/* Floating geometric shapes */}
                <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white opacity-10 rotate-12 animate-bounce-slow"></div>
                <div className="absolute top-2/3 right-1/3 w-12 h-12 bg-[#FBB03B] opacity-20 rounded-full animate-pulse-slow delay-500"></div>
                {/* Curved lines */}
                <svg className="absolute top-0 right-0 w-96 h-96 opacity-5" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M200 0 C300 100, 400 200, 200 400 C0 200, 100 100, 200 0" stroke="#FBB03B" strokeWidth="2" fill="none"/>
                </svg>
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
    );

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

            <IntroSection />

            {/* ASYMMETRICAL GRID PROJECTS SECTION (9:3 Split) */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                {/* THE CORE ASYMMETRICAL GRID CONTAINER: 12 Columns */}
                <div
                    ref={gridRef}
                    className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8"
                >
                    {/* Active Project: Large Left Column */}
                    <animated.div
                        style={useSpring({
                            from: { opacity: 0, transform: 'translateY(50px)' },
                            to: { opacity: 1, transform: 'translateY(0)' },
                            delay: 200,
                            config: { tension: 120, friction: 14 }
                        })}
                        className="lg:col-span-9 lg:col-start-1 cursor-default border-4 border-[#FBB03B] shadow-2xl z-10 bg-white group rounded-xl transition-all duration-500 ease-in-out flex flex-col transform hover:scale-[1.02] transition-transform duration-300"
                    >
                        {/* 1. Collapsed/Header View */}
                        <div className="p-6 md:p-8 flex flex-col">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#0015AA] text-3xl">
                                        {projects[activeProjectIndex]?.name}
                                    </h3>
                                    <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gray-600">
                                        {projects[activeProjectIndex]?.clientType}
                                    </p>
                                </div>
                                <img
                                    src={projects[activeProjectIndex]?.logo}
                                    alt={`${projects[activeProjectIndex]?.name} Logo`}
                                    className="rounded-full object-cover shadow-md transition-transform duration-300 ml-4 w-20 h-20"
                                />
                            </div>
                        </div>

                        {/* 2. EXECUTIVE SUMMARY - Layer 1 (Velocity Optimization) */}
                        <animated.div
                            className="p-8 bg-white border-t border-gray-100 space-y-6"
                        >
                            {/* Problem Statement */}
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                                <div className="flex items-center mb-2">
                                    <Target className="w-5 h-5 text-red-600 mr-2" />
                                    <h5 className="font-bold text-lg text-red-800">The Challenge</h5>
                                </div>
                                <p className="text-red-700 text-base leading-relaxed">
                                    {PROJECTS[activeProjectIndex].caseStudy.startingPoint}
                                </p>
                            </div>

                            {/* Solution Overview */}
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                <div className="flex items-center mb-2">
                                    <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                                    <h5 className="font-bold text-lg text-blue-800">Our Solution</h5>
                                </div>
                                <p className="text-blue-700 text-base leading-relaxed">
                                    {PROJECTS[activeProjectIndex].caseStudy.theTransformation}
                                </p>
                            </div>

                            {/* Quantifiable Outcome */}
                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                                <div className="flex items-center mb-2">
                                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                                    <h5 className="font-bold text-lg text-green-800">The Results</h5>
                                </div>
                                <p className="text-green-700 text-base leading-relaxed font-semibold">
                                    {PROJECTS[activeProjectIndex].caseStudy.journeyEnd}
                                </p>
                            </div>

                            <div className="flex justify-start text-sm pt-4 space-x-6 border-t border-gray-200">
                                <p className="font-semibold text-gray-800">Industry: <span className="font-normal text-gray-600">{PROJECTS[activeProjectIndex].industry}</span></p>
                                <p className="font-semibold text-gray-800">Client Type: <span className="font-normal text-gray-600">{PROJECTS[activeProjectIndex].clientType}</span></p>
                            </div>
                        </animated.div>

                        {/* 3. CTA or Collapse button */}
                        <div className="mt-auto p-6 md:p-8 pt-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveProjectIndex(0); // Collapse: Revert to the default featured project
                                }}
                                className="flex items-center font-bold py-2 transition-all duration-300 text-red-500 hover:text-red-700"
                            >
                                Collapse View
                                <BsArrowRight className="ml-2 transition-transform duration-300 rotate-180" />
                            </button>
                        </div>

                        {/* 4. DETAILED PROCESS DOCUMENTATION - Layer 2 */}
                        <animated.div
                            className="p-8 bg-gray-50 border-t border-gray-200 space-y-8 flex-grow"
                        >
                            <h4 className="text-2xl font-bold text-[#0015AA] text-center">Detailed Process Documentation</h4>

                            {/* Research Methods & Design Process */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <Search className="w-5 h-5 text-[#0015AA] mr-2" />
                                    <h5 className="text-lg font-bold text-gray-800">Research & Design Process</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h6 className="font-semibold text-gray-700 mb-2">Discovery Phase</h6>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Stakeholder interviews</li>
                                            <li>• Market research analysis</li>
                                            <li>• Competitive landscape review</li>
                                            <li>• User persona development</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h6 className="font-semibold text-gray-700 mb-2">Design Iterations</h6>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Wireframe development</li>
                                            <li>• User flow mapping</li>
                                            <li>• Prototype testing</li>
                                            <li>• Visual design refinement</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Technical Implementation */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <Cog className="w-5 h-5 text-[#0015AA] mr-2" />
                                    <h5 className="text-lg font-bold text-gray-800">Technical Implementation</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h6 className="font-semibold text-gray-700 mb-2">Frontend Stack</h6>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• React.js for component architecture</li>
                                            <li>• Tailwind CSS for styling</li>
                                            <li>• Framer Motion for animations</li>
                                            <li>• Responsive design principles</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h6 className="font-semibold text-gray-700 mb-2">Development Tools</h6>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li>• Figma for design collaboration</li>
                                            <li>• Git for version control</li>
                                            <li>• Performance optimization</li>
                                            <li>• Cross-browser testing</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Testing & Validation */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <CheckCircle className="w-5 h-5 text-[#0015AA] mr-2" />
                                    <h5 className="text-lg font-bold text-gray-800">Testing & Validation</h5>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                        <h6 className="font-semibold text-green-800">User Testing</h6>
                                        <p className="text-xs text-green-600 mt-1">A/B testing with target users</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                        <h6 className="font-semibold text-blue-800">Accessibility Audit</h6>
                                        <p className="text-xs text-blue-600 mt-1">WCAG compliance validation</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                        <h6 className="font-semibold text-purple-800">Performance Metrics</h6>
                                        <p className="text-xs text-purple-600 mt-1">Load time optimization</p>
                                    </div>
                                </div>
                            </div>

                            {/* Lessons Learned */}
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center mb-4">
                                    <Quote className="w-5 h-5 text-[#0015AA] mr-2" />
                                    <h5 className="text-lg font-bold text-gray-800">Lessons Learned</h5>
                                </div>
                                <div className="space-y-3">
                                    <div className="border-l-4 border-[#FBB03B] pl-4">
                                        <p className="text-gray-700 italic">"Early user feedback was crucial in refining the design direction and ensuring the final product met real user needs."</p>
                                    </div>
                                    <div className="border-l-4 border-[#0015AA] pl-4">
                                        <p className="text-gray-700 italic">"Iterative prototyping saved significant development time by identifying potential issues before full implementation."</p>
                                    </div>
                                </div>
                            </div>
                        </animated.div>

                        {/* 5. PROJECT VISUALS SECTION - USES THE REST OF THE SPACE */}
                        <animated.div
                            className="p-8 bg-white border-t border-gray-100 space-y-6 flex-grow"
                        >
                            <h5 className="font-bold text-gray-800 text-lg mb-4 text-center">Key Milestones on the Route</h5>
                            {Object.keys(PROJECTS[activeProjectIndex].caseStudy.visuals).map((key, i) => (
                                <div key={i}>
                                    <h6 className="font-bold text-gray-800 text-sm mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h6>
                                    <img
                                        src={PROJECTS[activeProjectIndex].caseStudy.visuals[key]}
                                        alt={`${PROJECTS[activeProjectIndex].name} ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                                        className="w-full h-auto rounded-lg object-cover shadow-md"
                                    />
                                </div>
                            ))}

                            {/* Layer 2 Access - Detailed Process Documentation */}
                            <div className="pt-6 text-center border-t border-gray-200">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center font-bold py-3 px-6 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition-colors"
                                >
                                    View Detailed Process Documentation
                                    <BsArrowRight className="ml-2" />
                                </button>
                            </div>
                        </animated.div>
                    </animated.div>

                    {/* Inactive Projects: Vertical Right Column - All in same container */}
                    <div className="lg:col-span-3 lg:col-start-10 flex flex-col gap-4">
                        {loading ? (
                            <div className="col-span-full flex justify-center items-center py-16">
                                <Loader2 className="w-8 h-8 animate-spin text-[#0015AA]" />
                                <span className="ml-2 text-gray-600">Loading projects...</span>
                            </div>
                        ) : error ? (
                            <div className="col-span-full text-center py-16">
                                <p className="text-red-600 mb-4">Failed to load projects: {error}</p>
                                <button
                                    onClick={() => dispatch(fetchPublicProjects())}
                                    className="bg-[#0015AA] text-white px-6 py-2 rounded-lg hover:bg-[#003366] transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : (
                            projects.map((project, index) => {
                                if (index === activeProjectIndex) return null;

                                const fadeIn = useSpring({
                                    from: { opacity: 0, transform: 'translateY(50px)' },
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                    delay: 200 + (index * 100),
                                    config: { tension: 120, friction: 14 }
                                });

                                // Check if this is a design project (has designTools array from GraphQL)
                                const isDesignProject = project.designTools && project.designTools.length > 0;

                                if (isDesignProject) {
                                    return (
                                        <animated.div key={index} style={fadeIn}>
                                            <DesignProjectCard
                                                project={project}
                                                isActive={false}
                                                onClick={() => handleProjectClick(index)}
                                            />
                                        </animated.div>
                                    );
                                }

                                // Default project card for non-design projects
                                return (
                                    <animated.div
                                        key={index}
                                        style={fadeIn}
                                        className="rounded-xl bg-gray-50 opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer h-64 flex flex-col p-4 md:p-6 group shadow-lg hover:shadow-xl"
                                        onClick={() => handleProjectClick(index)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 text-xl">
                                                    {project.name}
                                                </h3>
                                                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gray-400">
                                                    {project.clientType}
                                                </p>
                                            </div>
                                            <img
                                                src={project.logo}
                                                alt={`${project.name} Logo`}
                                                className="rounded-full object-cover shadow-md transition-transform duration-300 ml-4 w-12 h-12"
                                            />
                                        </div>

                                        {/* Intro text/Teaser */}
                                        <p className="mt-4 text-sm text-gray-700 flex-grow overflow-hidden">
                                            {project.intro}
                                        </p>

                                        {/* CTA button */}
                                        <div className="mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleProjectClick(index);
                                                }}
                                                className="flex items-center font-bold py-2 px-4 transition-all duration-300 text-[#0015AA] hover:text-[#FBB03B] bg-white hover:bg-gray-100 rounded-lg shadow-md hover:shadow-lg"
                                            >
                                                View Details
                                                <BsArrowRight className="ml-2 transition-transform duration-300 rotate-0" />
                                            </button>
                                        </div>
                                    </animated.div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative bg-[#0015AA] text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
                {/* Background Designs */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FBB03B] opacity-20 rounded-full animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-700 opacity-15 rotate-45 animate-spin-slow"></div>
                    <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce-slow"></div>
                    <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 0 C150 50, 200 100, 100 200 C0 100, 50 50, 100 0" stroke="#FBB03B" strokeWidth="1" fill="none"/>
                    </svg>
                </div>

                <div className="container mx-auto relative z-10">
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

            {/* Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#0015AA]">{PROJECTS[activeProjectIndex].name}</h2>
                                    <p className="text-lg text-gray-600 mt-2">{PROJECTS[activeProjectIndex].clientType} • {PROJECTS[activeProjectIndex].industry}</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-[#0015AA] mb-4">Project Overview</h3>
                                    <p className="text-gray-700 leading-relaxed">{PROJECTS[activeProjectIndex].intro}</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-[#0015AA] mb-4">The Journey</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                            <h4 className="font-bold text-gray-800 mb-2">🧭 Starting Point</h4>
                                            <p className="text-sm text-gray-600">{PROJECTS[activeProjectIndex].caseStudy.startingPoint}</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                            <h4 className="font-bold text-gray-800 mb-2">✨ The Transformation</h4>
                                            <p className="text-sm text-gray-600">{PROJECTS[activeProjectIndex].caseStudy.theTransformation}</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                            <h4 className="font-bold text-gray-800 mb-2">🚀 Journey's End</h4>
                                            <p className="text-sm text-gray-600">{PROJECTS[activeProjectIndex].caseStudy.journeyEnd}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-[#0015AA] mb-4">Key Visuals</h3>
                                    <div className="space-y-6">
                                        {Object.keys(PROJECTS[activeProjectIndex].caseStudy.visuals).map((key, i) => (
                                            <div key={i}>
                                                <h4 className="font-bold text-gray-800 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                                                <img
                                                    src={PROJECTS[activeProjectIndex].caseStudy.visuals[key]}
                                                    alt={`${PROJECTS[activeProjectIndex].name} ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                                                    className="w-full h-auto rounded-lg shadow-md"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center pt-6">
                                    <Link
                                        to={PROJECTS[activeProjectIndex].link}
                                        className="inline-flex items-center font-bold py-3 px-6 rounded-full bg-[#FBB03B] text-[#0015AA] hover:bg-[#E0A030] transition-colors"
                                    >
                                        Visit Project Page
                                        <BsArrowRight className="ml-2" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default PortfolioPage;