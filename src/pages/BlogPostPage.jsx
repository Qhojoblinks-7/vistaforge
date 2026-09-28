import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSpring, animated } from 'react-spring';
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsCalendar3, BsChatLeftText, BsTag, BsShare, BsTwitter, BsLinkedin } from 'react-icons/bs';
import { BLOG_POSTS, getBlogPost } from '../data/blogPosts';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import OptimizedImage from '../components/OptimizedImage';

const BlogPostPage = ({ match }) => {
  const { slug } = match.params;
  const post = getBlogPost(slug);

  const contentSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 120, friction: 14 },
  });

  if (!post) {
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-[#0015AA] mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link to="/blog" className="inline-block bg-[#0015AA] text-white font-bold py-3 px-8 rounded-full">
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const postStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://vistaforge.com${post.coverImage}`,
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "jobTitle": post.author.role,
      "image": `https://vistaforge.com${post.author.image}`,
      "url": `https://vistaforge.com/about#team`,
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://vistaforge.com/#organization",
      "name": "VistaForge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://vistaforge.com/logo.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://vistaforge.com/blog/${post.slug}`
    },
    "keywords": post.seo.keywords,
    "articleSection": post.category,
    "tags": post.tags,
  };

  const shareUrl = `https://vistaforge.com/blog/${post.slug}`;
  const shareText = encodeURIComponent(post.title);

  return (
    <>
      <SEO
        title={post.seo.title}
        description={post.seo.description}
        keywords={post.seo.keywords}
        image={post.coverImage}
        url={`/blog/${post.slug}`}
        section="Blog"
        structuredData={postStructuredData}
      />
      <main className="bg-white" id="main-content">
        {/* Article Header */}
        <article className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-[#0015AA] transition-colors">Home</Link>
              <BsArrowLeft className="w-4 h-4 transform rotate-180" />
              <Link to="/blog" className="hover:text-[#0015AA] transition-colors">Blog</Link>
              <BsArrowLeft className="w-4 h-4 transform rotate-180" />
              <span className="text-gray-400 truncate max-w-xs">{post.category}</span>
            </nav>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Link to={`/blog?category=${post.category}`} className="bg-[#0015AA]/10 text-[#0015AA] text-sm font-bold px-3 py-1 rounded-full hover:bg-[#0015AA]/20 transition-colors">
                {post.category}
              </Link>
              {post.tags.map((tag, i) => (
                <span key={i} className="text-gray-500 text-sm">#{tag}</span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0015AA] leading-tight mb-6">
              {post.title}
            </h1>

            {/* Author & Date */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-100">
              <Link to="/about#team" className="flex items-center gap-3 group">
                <OptimizedImage
                  src={post.author.image}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                  widths={[48, 96]}
                  sizes="48px"
                />
                <div>
                  <p className="font-bold text-gray-900 group-hover:text-[#0015AA] transition-colors">{post.author.name}</p>
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                </div>
              </Link>
              <div className="flex items-center gap-4 text-sm text-gray-500 ml-auto">
                <span className="flex items-center gap-1">
                  <BsCalendar3 className="w-4 h-4" />
                  {post.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <BsChatLeftText className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-gray-500">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#0015AA] hover:text-white transition-colors"
                aria-label="Share on Twitter"
              >
                <BsTwitter className="w-5 h-5" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#0077B5] hover:text-white transition-colors"
                aria-label="Share on LinkedIn"
              >
                <BsLinkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-[#FBB03B] hover:text-[#0015AA] transition-colors"
                aria-label="Share via Email"
              >
                <BsShare className="w-5 h-5" />
              </a>
            </div>
          </div>
        </article>

        {/* Cover Image */}
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          <OptimizedImage
            src={post.coverImage}
            alt={post.title}
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl"
            widths={[800, 1200, 1600, 2000]}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          />
        </div>

        {/* Article Content */}
        <article className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="container mx-auto max-w-3xl">
            <animated.div style={contentSpring} className="prose prose-lg prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </animated.div>
          </div>
        </article>

        {/* Author Bio */}
        <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm">
              <OptimizedImage
                src={post.author.image}
                alt={post.author.name}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                widths={[80, 160]}
                sizes="80px"
              />
              <div>
                <Link to="/about#team" className="font-bold text-lg text-gray-900 hover:text-[#0015AA] transition-colors">
                  {post.author.name}
                </Link>
                <p className="text-[#FBB03B] text-sm font-medium mt-1">{post.author.role}</p>
                <p className="mt-3 text-gray-600">
                  {post.author.name} leads {post.author.role.toLowerCase()} at VistaForge, helping African startups build brands that convert.
                </p>
                <Link to="/about#team" className="inline-block mt-3 text-sm font-bold text-[#0015AA] hover:underline">
                  View Profile →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-[#0015AA] mb-8">Read Next</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS
                .filter(p => p.slug !== post.slug)
                .slice(0, 3)
                .map((relatedPost, index) => (
                  <animated.article key={relatedPost.slug} style={useSpring({
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                    delay: index * 100,
                    config: { tension: 120, friction: 14 },
                  })} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                    <Link to={`/blog/${relatedPost.slug}`} className="block">
                      <div className="relative aspect-video overflow-hidden">
                        <OptimizedImage
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          widths={[400, 800, 1200]}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="bg-[#0015AA]/10 text-[#0015AA] text-xs font-bold px-2 py-1 rounded-full">
                            {relatedPost.category}
                          </span>
                          <span className="text-gray-500 text-xs">{relatedPost.publishedAt}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0015AA] leading-tight mb-2 group-hover:text-[#FBB03B] transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <OptimizedImage
                              src={relatedPost.author.image}
                              alt={relatedPost.author.name}
                              className="w-6 h-6 rounded-full object-cover"
                              widths={[24, 48]}
                              sizes="24px"
                            />
                            <span className="text-sm font-medium text-gray-700">{relatedPost.author.name}</span>
                          </div>
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <BsCalendar3 className="w-4 h-4" />
                            {relatedPost.readTime}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </animated.article>
                ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="bg-[#0015AA] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-2xl text-center">
            <h3 className="text-3xl font-bold mb-4">Enjoyed This Article?</h3>
            <p className="text-gray-200 mb-6">
              Get one actionable insight on brand, design, or growth every Tuesday. No spam.
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
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default BlogPostPage;