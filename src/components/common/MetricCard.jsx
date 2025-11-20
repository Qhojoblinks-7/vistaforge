import React from 'react';

const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-[#0015AA]/10',
      text: 'text-[#0015AA]',
      border: 'border-[#0015AA]/20'
    },
    secondary: {
      bg: 'bg-[#FBB03B]/10',
      text: 'text-[#FBB03B]',
      border: 'border-[#FBB03B]/20'
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200'
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200'
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-300 p-6 ${colors.border} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${colors.bg} mr-4`}>
              <div className={colors.text}>
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          {trend && trendValue && (
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' :
                trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {trend === 'up' && '↗'}
                {trend === 'down' && '↘'}
                {trend === 'neutral' && '→'}
                {trendValue}
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;