import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from '@react-spring/web';
import { Link, useSearchParams } from 'react-router-dom';
import { BsArrowRight, BsCalendar3, BsChatLeftText, BsTag, BsChevronDown } from 'react-icons/bs';
import { BLOG_POSTS, BLOG_CATEGORIES, getFeaturedPosts } from '../data/blogPosts';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';

const AnimatedPostCard = ({ index, className = '', children }) => {
  const cardSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 200 + index * 100,
    config: { tension: 120, friction: 14 },
  });

  return (
    <animated.article style={cardSpring} className={className}>
      {children}
    </animated.article>
  );
};

const BlogPage = () => {
  // Supports /blog?category=Brand Strategy, linked from each post.
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const initialCategory = BLOG_CATEGORIES.includes(categoryParam) ? categoryParam : 'All';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [posts, setPosts] = useState(BLOG_POSTS);

  // Keep in sync when the query param changes (e.g. browser back/forward).
  useEffect(() => {
    setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const filtered = activeCategory === 'All' 
      ? BLOG_POSTS 
      : BLOG_POSTS.filter(post => post.category === activeCategory);
    setPosts(filtered);
  }, [activeCategory]);

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "VistaForge Insights",
    "description": "Expert insights on branding, web design, digital strategy, and product design for African startups and businesses.",
    "url": "https://vistaforge.com/blog",
    "publisher": {
      "@id": "https://vistaforge.com/#organization"
    },
    "blogPosts": getFeaturedPosts().map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": `https://vistaforge.com${post.coverImage}`,
      "datePublished": post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author.name,
        "jobTitle": post.author.role,
      },
      "publisher": {
        "@id": "https://vistaforge.com/#organization"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://vistaforge.com/blog/${post.slug}`
      }
    }))
  };

  return (
    <>
      <SEO
        title="Insights & Articles - Brand Strategy, Design & Digital Growth"
        description="Expert articles on brand strategy, logo design, web development, UI/UX, and digital marketing for African startups and SMEs."
        keywords="brand strategy blog, web design articles, UI/UX insights, digital marketing Africa, startup branding tips, Ghana design agency blog"
        image="/blog/hero-blog.svg"
        url="/blog"
        section="Blog"
        structuredData={blogStructuredData}
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
              Insights That Drive Growth.
            </h1>
            <p className="mt-6 text-lg max-w-3xl mx-auto text-gray-200">
              Strategy, design, and digital expertise for founders building brands that last. No fluff — just actionable insights from our work with African startups.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {BLOG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-[#0015AA] text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0015AA] hover:text-[#0015AA]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {activeCategory === 'All' && getFeaturedPosts().length > 0 && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {getFeaturedPosts().slice(0, 3).map((post, index) => (
                  <AnimatedPostCard key={post.slug} index={index} className={`relative group ${index === 0 ? 'lg:col-span-2' : ''}`}>
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl">
                        <OptimizedImage
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          widths={[400, 800, 1200, 1600]}
                          sizes={index === 0 ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="bg-[#FBB03B] text-[#0015AA] text-xs font-bold px-3 py-1 rounded-full">
                              {post.category}
                            </span>
                            <span className="text-white/80 text-xs">{post.publishedAt}</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                            {post.title}
                          </h2>
                        </div>
                      </div>
                    </Link>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                      <OptimizedImage
                        src={post.author.image}
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                        widths={[32, 64]}
                        sizes="32px"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">{post.author.role}</p>
                      </div>
                      <span className="flex items-center gap-1 ml-auto">
                        <BsCalendar3 className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </AnimatedPostCard>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No articles found in this category.</p>
                <button
                  onClick={() => setActiveCategory('All')}
                  className="mt-4 text-[#0015AA] font-bold hover:underline"
                >
                  Show all articles
                </button>
              </div>
            ) : (
              <>
                {activeCategory === 'All' && getFeaturedPosts().length > 0 && (
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
                    More Articles
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.filter(post => activeCategory !== 'All' || !post.featured).map((post, index) => (
                    <AnimatedPostCard key={post.slug} index={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="relative aspect-video overflow-hidden">
                          <OptimizedImage
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            widths={[400, 800, 1200]}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="bg-[#0015AA]/10 text-[#0015AA] text-xs font-bold px-2 py-1 rounded-full">
                              {post.category}
                            </span>
                            <span className="text-gray-500 text-xs">{post.publishedAt}</span>
                          </div>
                          <h3 className="text-lg font-bold text-[#0015AA] leading-tight mb-2 group-hover:text-[#FBB03B] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <OptimizedImage
                                src={post.author.image}
                                alt={post.author.name}
                                className="w-6 h-6 rounded-full object-cover"
                                widths={[24, 48]}
                                sizes="24px"
                              />
                              <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
                            </div>
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <BsCalendar3 className="w-4 h-4" />
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </AnimatedPostCard>
                  ))}
                </div>
              </>
            )}

            {/* Newsletter CTA */}
            <div className="mt-20 text-center">
              <div className="bg-[#0015AA] text-white rounded-2xl p-8 md:p-12">
                <h3 className="text-3xl font-bold mb-4">Get Insights Delivered Weekly</h3>
                <p className="text-gray-200 mb-6 max-w-md mx-auto">
                  No spam. Just one actionable article on brand, design, or growth — every Tuesday.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#FBB03B]"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#FBB03B] text-[#0015AA] font-bold py-3 px-8 rounded-lg hover:bg-[#E0A030] transition-colors whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-4 text-xs text-gray-400">Join 2,000+ founders. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default BlogPage;