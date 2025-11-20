import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  description,
  actions = [],
  stats = [],
  className = ""
}) => {
  return (
    <div className={`mb-8 relative ${className}`}>
      {/* Header Banner Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0015AA]/10 via-[#FBB03B]/5 to-[#0015AA]/10 rounded-xl"></div>
      <div className="absolute top-4 right-8 w-24 h-24 bg-[#FBB03B]/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-2 left-12 w-16 h-16 bg-[#0015AA]/15 rounded-full blur-lg"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between py-6 px-6 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {title && <h1 className="text-2xl lg:text-3xl font-bold text-[#0015AA]">{title}</h1>}
            {subtitle && <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{subtitle}</span>}
          </div>
          {description && <p className="text-gray-700 font-medium">{description}</p>}
          {stats.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-3">
              {stats.map((stat, index) => (
                <div key={index} className="text-sm text-gray-600">
                  <span className="font-semibold">{stat.value}</span> {stat.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  action.variant === 'primary'
                    ? 'bg-[#0015AA] text-white hover:bg-[#003366] shadow-lg hover:shadow-xl'
                    : action.variant === 'secondary'
                    ? 'bg-[#FBB03B] text-white hover:bg-[#E0A030] shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${action.className || ''}`}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;