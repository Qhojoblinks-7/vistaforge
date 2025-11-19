import React from 'react';

const colorMap = {
  primary: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600' },
  secondary: 'bg-green-50 border-green-200 text-green-600',
  danger: 'bg-red-50 border-red-200 text-red-600'
};

const MetricCard = ({ title, value, color }) => {
  const colorClasses = colorMap[color] || colorMap.primary;

  return (
    <div className={`card ${colorClasses.bg} ${colorClasses.border}`}>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${colorClasses.text}`}>{value}</p>
    </div>
  );
};

export default MetricCard;