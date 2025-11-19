import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { Target, Lightbulb, TrendingUp, Search, Cog, CheckCircle, Shield, BarChart3, Quote, Image } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicProjectBySlug } from '../store/slices/publicPortfolioSlice';

// Project data is now fetched from the server via GraphQL. The static constant was removed
// so this page reads `currentProject` from the `publicPortfolio` slice.

const ProjectDetailPage = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { currentProject: project, loading } = useSelector((state) => state.publicPortfolio);

    useEffect(() => {
        if (slug) dispatch(fetchPublicProjectBySlug(slug));
    }, [slug, dispatch]);

    if (loading) {
        return (
            <main className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Loading project...</p>
                </div>
            </main>
        );
    }

    if (!project) {
        return (
            <main className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0015AA] mb-4">Project Not Found</h1>
                    <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
                    <Link
                        to="/portfolio"
                        className="inline-flex items-center font-bold py-3 px-6 rounded-full bg-[#FBB03B] text-[#0015AA] hover:bg-[#E0A030] transition-colors"
                    >
                        <BsArrowLeft className="mr-2" />
                        Back to Portfolio
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white" id="main-content">
            <Helmet>
                <title>{project.title} - VistaForge Brand Design Project</title>
                <meta name="description" content={`Explore the ${project.title} brand design project by VistaForge. ${project.intro}`} />
            </Helmet>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0015AA] to-[#003366] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Designs */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow"></div>
                    <div className="absolute top-1/2 -right-10 w-48 h-48 bg-blue-700 opacity-20 rotate-45 animate-spin-slow"></div>
                    <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-[#FBB03B] opacity-30 rounded-full animate-pulse-slow delay-200"></div>
                    <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white opacity-10 rounded-full animate-bounce-slow"></div>
                    <svg className="absolute bottom-0 right-0 w-96 h-96 opacity-5" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M200 0 C300 100, 400 200, 200 400 C0 200, 100 100, 200 0" stroke="#FBB03B" strokeWidth="2" fill="none"/>
                    </svg>
                </div>

                <div className="container mx-auto relative z-10">
                    <Link
                        to="/portfolio"
                        className="inline-flex items-center text-white hover:text-[#FBB03B] transition-colors mb-8"
                    >
                        <BsArrowLeft className="mr-2" />
                        Back to Portfolio
                    </Link>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="flex-shrink-0">
                            <img
                                src={project.logo}
                                alt={`${project.title || project.name} Logo`}
                                className="w-32 h-32 rounded-full object-cover shadow-lg"
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                {project.title || project.name}
                            </h1>
                            <p className="text-xl text-gray-300 mb-2">{project.clientType}</p>
                            <p className="text-lg text-gray-400">{project.industry}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layer 1: Executive Summary (Velocity Optimization) */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#0015AA] mb-4">Executive Summary</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">Critical information for rapid qualification within the recruiter's 3-minute review window.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Problem Statement */}
                        <div className="bg-white p-8 rounded-xl shadow-2xl border-l-4 border-red-400">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-red-800">The Challenge</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-center">{project.caseStudy?.startingPoint}</p>
                        </div>

                        {/* Solution Overview */}
                        <div className="bg-white p-8 rounded-xl shadow-2xl border-l-4 border-blue-400">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lightbulb className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-800">Our Solution</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-center">{project.caseStudy?.theTransformation}</p>
                        </div>

                        {/* Quantifiable Outcome */}
                        <div className="bg-white p-8 rounded-xl shadow-2xl border-l-4 border-green-400">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800">The Results</h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-center font-semibold">{project.caseStudy?.journeyEnd}</p>
                        </div>
                    </div>

                    {/* Technical Stack Justification */}
                    <div className="bg-white p-8 rounded-xl shadow-2xl">
                        <h3 className="text-xl font-bold text-[#0015AA] mb-6 text-center">Technical Stack & Justification</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#0015AA] rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">R</span>
                                </div>
                                <h4 className="font-semibold text-gray-800">React.js</h4>
                                <p className="text-sm text-gray-600">Component-based architecture for maintainable, scalable interfaces</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-[#FBB03B] rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-[#0015AA] font-bold">T</span>
                                </div>
                                <h4 className="font-semibold text-gray-800">Tailwind CSS</h4>
                                <p className="text-sm text-gray-600">Utility-first approach for rapid, consistent styling</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">F</span>
                                </div>
                                <h4 className="font-semibold text-gray-800">Framer Motion</h4>
                                <p className="text-sm text-gray-600">Performance-optimized animations for enhanced UX</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <span className="text-white font-bold">V</span>
                                </div>
                                <h4 className="font-semibold text-gray-800">Vite</h4>
                                <p className="text-sm text-gray-600">Lightning-fast build tool for optimal development experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Layer 2: Detailed Process Documentation (Access Required) */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-[#0015AA] mb-4">Detailed Process Documentation</h2>
                        <p className="text-lg text-gray-600">Deep dive into research methods, design iterations, and technical implementation</p>
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
                            <p className="text-yellow-800 font-medium">This section contains detailed process information for thorough review</p>
                        </div>
                    </div>

                    {/* Research Methods & Design Process */}
                    <div className="bg-white p-8 rounded-xl shadow-2xl mb-8">
                        <div className="flex items-center mb-6">
                            <Search className="w-6 h-6 text-[#0015AA] mr-3" />
                            <h3 className="text-2xl font-bold text-[#0015AA]">Research & Design Process</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Discovery Phase</h4>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#0015AA] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Stakeholder interviews and user research sessions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#0015AA] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Market analysis and competitive landscape review</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#0015AA] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>User persona development and journey mapping</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#0015AA] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Brand audit and current state analysis</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Design Iterations</h4>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#FBB03B] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Wireframe development and low-fidelity prototyping</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#FBB03B] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>User flow mapping and information architecture</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#FBB03B] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>High-fidelity mockups and interactive prototypes</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-[#FBB03B] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                        <span>Usability testing and iterative refinement</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Technical Implementation */}
                    <div className="bg-white p-8 rounded-xl shadow-2xl mb-8">
                        <div className="flex items-center mb-6">
                            <Cog className="w-6 h-6 text-[#0015AA] mr-3" />
                            <h3 className="text-2xl font-bold text-[#0015AA]">Technical Implementation</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Frontend Architecture</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h5 className="font-medium text-gray-800">React.js Components</h5>
                                        <p className="text-sm text-gray-600 mt-1">Modular, reusable component architecture for maintainable and scalable interfaces</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h5 className="font-medium text-gray-800">State Management</h5>
                                        <p className="text-sm text-gray-600 mt-1">Context API and custom hooks for efficient state handling</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Development Tools</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h5 className="font-medium text-gray-800">Version Control</h5>
                                        <p className="text-sm text-gray-600 mt-1">Git workflow with feature branches and code review processes</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <h5 className="font-medium text-gray-800">Build Optimization</h5>
                                        <p className="text-sm text-gray-600 mt-1">Vite bundler for fast development and optimized production builds</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Testing & Validation */}
                    <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
                        <div className="flex items-center mb-6">
                            <CheckCircle className="w-6 h-6 text-[#0015AA] mr-3" />
                            <h3 className="text-2xl font-bold text-[#0015AA]">Testing & Validation</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-green-800 mb-2">User Testing</h4>
                                <p className="text-sm text-green-700">A/B testing with target users and usability validation</p>
                            </div>
                            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-blue-800 mb-2">Accessibility Audit</h4>
                                <p className="text-sm text-blue-700">WCAG 2.1 AA compliance and screen reader testing</p>
                            </div>
                            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                                <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-purple-800 mb-2">Performance Metrics</h4>
                                <p className="text-sm text-purple-700">Load time optimization and Core Web Vitals monitoring</p>
                            </div>
                        </div>
                    </div>

                    {/* Lessons Learned */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <div className="flex items-center mb-6">
                            <Quote className="w-6 h-6 text-[#0015AA] mr-3" />
                            <h3 className="text-2xl font-bold text-[#0015AA]">Lessons Learned</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 border-l-4 border-[#FBB03B] bg-yellow-50">
                                <p className="text-gray-800 italic">"Early user feedback was crucial in refining the design direction and ensuring the final product met real user needs rather than assumptions."</p>
                            </div>
                            <div className="p-4 border-l-4 border-[#0015AA] bg-blue-50">
                                <p className="text-gray-800 italic">"Iterative prototyping saved significant development time by identifying potential issues before full implementation."</p>
                            </div>
                            <div className="p-4 border-l-4 border-green-500 bg-green-50">
                                <p className="text-gray-800 italic">"Performance optimization from the start prevented technical debt and ensured scalability for future growth."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Showcase */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-center justify-center mb-12">
                        <Image className="w-8 h-8 text-[#0015AA] mr-3" />
                        <h2 className="text-3xl font-bold text-[#0015AA]">Visual Showcase</h2>
                    </div>

                    <div className="space-y-12">
                        {Object.keys(project.caseStudy.visuals).map((key, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-2xl hover:shadow-xl transition-shadow duration-300 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                                <div className="p-6 border-b border-gray-100">
                                                    <h3 className="text-xl font-bold text-gray-800 capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </h3>
                                </div>
                                <div className="p-6">
                                    <img
                                        src={project.caseStudy?.visuals?.[key]}
                                        alt={`${project.title || project.name} ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                                        className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
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
                    <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Brand?</h2>
                    <p className="text-xl max-w-2xl mx-auto mb-8">
                        Let's create a success story like {project.title}. Every great brand starts with a conversation.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
                    >
                        Start Your Project
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default ProjectDetailPage;