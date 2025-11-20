import React from 'react';
import { Helmet } from 'react-helmet-async';

const PageLayout = ({
  title,
  description,
  keywords,
  children,
  showBackground = true,
  customBackground,
  className = ""
}) => {
  const backgroundPattern = showBackground ? (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0015AA]/5 via-transparent to-[#FBB03B]/5">
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#FBB03B]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 left-16 w-48 h-48 bg-[#0015AA]/8 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/6 rounded-full blur-xl"></div>
    </div>
  ) : null;

  return (
    <div className={`min-h-screen bg-gray-50 py-8 relative overflow-hidden ${className}`}>
      {customBackground || backgroundPattern}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Helmet>
          <title>{title} - VistaForge</title>
          <meta name="description" content={description} />
          {keywords && <meta name="keywords" content={keywords} />}
        </Helmet>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;