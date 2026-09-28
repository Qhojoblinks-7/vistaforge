import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicProjectBySlug } from '../store/slices/publicPortfolioSlice';
import { BsArrowLeft, BsCheckCircle, BsArrowRight } from 'react-icons/bs';
import { Target, Lightbulb, TrendingUp, Search, Cog, CheckCircle, Shield, BarChart3, Quote, Loader2, Share2, Heart } from 'lucide-react';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const CaseStudyPage = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { currentProject, loading, error } = useSelector((state) => state.publicPortfolio);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPublicProjectBySlug(slug));
    }
  }, [dispatch, slug]);

  // Transform GraphQL data to match component expectations
  const project = currentProject ? {
    ...currentProject,
    tools: currentProject.designTools || [],
    isDesignProject: currentProject.isDesignProject || (currentProject.designTools && currentProject.designTools.length > 0),
    link: `/projects/${currentProject.slug}`,
  } : null;

  const structuredData = project ? {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://vistaforge.com/case-studies/${project.slug}`,
    "name": project.name || project.title,
    "description": project.intro,
    "image": project.heroImage || project.logo,
    "url": `https://vistaforge.com/case-studies/${project.slug}`,
    "author": {
      "@type": "Organization",
      "name": "VistaForge",
      "url": "https://vistaforge.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VistaForge",
      "url": "https://vistaforge.com"
    },
    "datePublished": project.createdAt,
    "dateModified": project.updatedAt || project.createdAt,
    "about": [
      {
        "@type": "Thing",
        "name": project.industry || "Brand Design"
      },
      {
        "@type": "Thing",
        "name": project.clientType || "Business"
      }
    ],
    "keywords": project.designTools?.join(", ") || "brand design, case study",
    "isPartOf": {
      "@type": "CreativeWork",
      "name": "VistaForge Portfolio"
    }
  } : null;

  if (loading) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0015AA] mx-auto mb-4" />
          <p className="text-gray-600">Loading case study...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-600 mb-4">Case study not found</p>
          <Link
            to="/portfolio"
            className="inline-block bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] transition-colors"
          >
            Back to Portfolio
          </Link>
        </div>
      </main>
    );
  }

  const caseStudy = project.caseStudy || {};

  return (
    <>
      <SEO
        title={`${project.name || project.title} - Case Study`}
        description={project.intro}
        keywords={project.designTools?.join(", ") || "brand design, case study, portfolio"}
        image={project.heroImage || project.logo}
        url={`/case-studies/${project.slug}`}
        type="article"
        section="Portfolio"
        tags={project.designTools}
        structuredData={structuredData}
      />
      <main className="bg-white" id="main-content">
        {/* Hero Section */}
        <section className="relative bg-[#0015AA] text-white py-16 px-4 sm:py-20 sm:px-6 lg:py-24 lg:px-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#FBB03B] opacity-20 rounded-full animate-pulse-slow"></div>
            <div className="absolute top-1/2 -left-20 w-48 h-48 bg-[#FBB03B] opacity-20 rotate-45 animate-spin-slow"></div>
            <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-blue-700 opacity-15 rounded-full animate-pulse-slow delay-200"></div>
          </div>
          <div className="container mx-auto relative z-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <Link
                  to="/portfolio"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Back to portfolio"
                >
                  <BsArrowLeft className="w-5 h-5" />
                </Link>
                <span className="text-sm font-medium text-[#FBB03B] uppercase tracking-wider">
                  {project.clientType} • {project.industry}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {project.name || project.title}
              </h1>
              <p className="text-lg sm:text-xl max-w-2xl opacity-90">
                {project.intro}
              </p>
            </div>
          </div>
        </section>

        {/* Project Meta */}
        <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#0015AA]/10 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#0015AA]" />
                </div>
                <h3 className="font-semibold text-gray-900">The Challenge</h3>
              </div>
              <p className="text-gray-600">{caseStudy.startingPoint || 'Challenge details coming soon.'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#FBB03B]/10 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#FBB03B]" />
                </div>
                <h3 className="font-semibold text-gray-900">Our Solution</h3>
              </div>
              <p className="text-gray-600">{caseStudy.theTransformation || 'Solution details coming soon.'}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">The Results</h3>
              </div>
              <p className="text-gray-600 font-medium">{caseStudy.journeyEnd || 'Results coming soon.'}</p>
            </div>
          </div>
        </section>

        {/* Visuals Gallery */}
        {caseStudy.visuals && Object.keys(caseStudy.visuals).length > 0 && (
          <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-[#0015AA] text-center mb-12">Project Visuals</h2>
              <div className="space-y-12">
                {Object.entries(caseStudy.visuals).map(([key, imageUrl]) => (
                  <div key={key} className="rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={imageUrl}
                      alt={`${project.name || project.title} - ${key.replace(/([A-Z])/g, ' $1').trim()}`}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                      <h3 className="font-semibold text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Detailed Process */}
        {caseStudy.process && (
          <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-[#0015AA] text-center mb-12">Our Process</h2>
              <div className="space-y-12">
                {/* Research & Design Process */}
                {caseStudy.process.researchMethods && (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Search className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Research & Design Process</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {caseStudy.process.researchMethods.discoveryPhase && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Discovery Phase</h4>
                          <ul className="space-y-2">
                            {caseStudy.process.researchMethods.discoveryPhase.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-600">
                                <BsCheckCircle className="w-5 h-5 text-[#FBB03B] flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {caseStudy.process.researchMethods.designIterations && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Design Iterations</h4>
                          <ul className="space-y-2">
                            {caseStudy.process.researchMethods.designIterations.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-gray-600">
                                <BsCheckCircle className="w-5 h-5 text-[#FBB03B] flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical Implementation */}
                {caseStudy.process.technicalImplementation && (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <Cog className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Technical Implementation</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {caseStudy.process.technicalImplementation.frontendStack && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Frontend Stack</h4>
                          <div className="flex flex-wrap gap-2">
                            {caseStudy.process.technicalImplementation.frontendStack.map((item, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {caseStudy.process.technicalImplementation.developmentTools && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Development Tools</h4>
                          <div className="flex flex-wrap gap-2">
                            {caseStudy.process.technicalImplementation.developmentTools.map((item, idx) => (
                              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Testing & Validation */}
                {caseStudy.process.testingValidation && (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Testing & Validation</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {caseStudy.process.testingValidation.map((test, idx) => (
                        <div key={idx} className={`p-6 rounded-xl ${test.bgColor || 'bg-gray-50'}`}>
                          <div className={`w-12 h-12 mx-auto mb-4 ${test.iconColor || 'text-gray-600'}`}>
                            <CheckCircle className="w-full h-full" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-center mb-2">{test.title}</h4>
                          <p className="text-sm text-gray-600 text-center">{test.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lessons Learned */}
                {caseStudy.process.lessonsLearned && (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                        <Quote className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Lessons Learned</h3>
                    </div>
                    <div className="space-y-4">
                      {caseStudy.process.lessonsLearned.map((lesson, idx) => (
                        <div key={idx} className={`border-l-4 pl-6 ${lesson.borderColor || 'border-[#FBB03B]'}`}>
                          <p className="text-gray-700 italic">"{lesson.quote}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Deliverables */}
        {project.deliverables && project.deliverables.length > 0 && (
          <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-[#0015AA] text-center mb-12">Key Deliverables</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.deliverables.map((deliverable, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-[#FBB03B] transition-colors">
                    <h3 className="font-semibold text-gray-900 mb-2">{deliverable.title}</h3>
                    <p className="text-gray-600">{deliverable.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Design System */}
        {project.designSystem && (
          <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-6xl">
              <h2 className="text-3xl font-bold text-[#0015AA] text-center mb-12">Design System</h2>
              <div className="space-y-10">
                {project.designSystem.colors && project.designSystem.colors.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Color Palette</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {project.designSystem.colors.slice(0, 8).map((color, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                          <div
                            className="w-full h-24 rounded-lg mx-auto mb-3 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <p className="font-medium text-gray-900">{color.name}</p>
                          <p className="text-sm text-gray-500 font-mono">{color.hex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {project.designSystem.typography && (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Typography</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(project.designSystem.typography).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">{key}</p>
                          <p className="text-lg font-semibold text-gray-900">{value.fontFamily}</p>
                          <p className="text-sm text-gray-500">{value.weight} • {value.size}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative bg-[#0015AA] text-white py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FBB03B] opacity-20 rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-700 opacity-15 rotate-45 animate-spin-slow"></div>
            <svg className="absolute bottom-0 right-0 w-64 h-64 opacity-5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 0 C150 50, 200 100, 100 200 C0 100, 50 50, 100 0" stroke="#FBB03B" strokeWidth="1" fill="none"/>
            </svg>
          </div>
          <div className="container mx-auto relative z-10">
            <h2 className="text-4xl font-bold">Ready to Start Your Project?</h2>
            <p className="mt-4 text-xl max-w-2xl mx-auto">
              Let's create something remarkable together. Book a free consultation to discuss your vision.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-block bg-[#FBB03B] text-[#0015AA] text-lg font-bold py-4 px-12 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Start Your Project
              </Link>
              <Link
                to="/portfolio"
                className="inline-block bg-transparent border-2 border-white text-white text-lg font-bold py-4 px-12 rounded-full transition-colors hover:bg-white hover:text-[#0015AA]"
              >
                View More Work
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default CaseStudyPage;