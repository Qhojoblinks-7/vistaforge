import React from 'react';
import { BsCashStack, BsGraphUp, BsExclamationTriangle } from 'react-icons/bs';

const MetricCard = ({ title, value, color, cta }) => {
  const colorClasses = {
    primary: 'bg-[#0015AA]',
    secondary: 'bg-[#FBB03B]',
    danger: 'bg-red-500'
  };

  const bgGradients = {
    primary: 'bg-gradient-to-br from-[#0015AA] to-[#003366]',
    secondary: 'bg-gradient-to-br from-[#FBB03B] to-[#E0A030]',
    danger: 'bg-gradient-to-br from-red-500 to-red-700'
  };

  return (
    <div className={`${bgGradients[color]} p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/10`}>
      <div className="flex items-center justify-between">
        <div className="text-white">
          <h3 className="text-sm font-medium text-white/80 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
          {cta && <p className="text-xs text-white/70 mt-1">{cta}</p>}
        </div>
        <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white shadow-lg`}>
          {color === 'primary' && <BsCashStack size={20} />}
          {color === 'secondary' && <BsGraphUp size={20} />}
          {color === 'danger' && <BsExclamationTriangle size={20} />}
        </div>
      </div>
    </div>
  );
};

const FinancialMetricsPanel = ({ unbilledAmount, totalRevenue, overdueInvoices }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Unbilled Amount"
        value={`$${unbilledAmount.toFixed(2)}`}
        color="primary"
        cta="Reminder: Generate invoices frequently."
      />
      <MetricCard
        title="Total Revenue YTD"
        value={`$${totalRevenue.toFixed(2)}`}
        color="secondary"
        cta="Goal: View full analytics."
      />
      <MetricCard
        title="Overdue Invoices"
        value={`${overdueInvoices} invoices`}
        color="danger"
        cta="Alert: Follow up on overdue payments."
      />
    </div>
  );
};

export default FinancialMetricsPanel;