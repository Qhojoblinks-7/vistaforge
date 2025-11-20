import React from 'react';
import { BsClock, BsPlayCircle, BsCheckCircle, BsFileText } from 'react-icons/bs';

const RecentActivityFeed = ({ timeLogs = [], invoices = [] }) => {
  // Combine and sort activities by date
  const activities = [
    ...timeLogs.map(log => ({
      id: `timelog-${log.id}`,
      type: 'timelog',
      message: `Logged ${(log.durationMinutes / 60).toFixed(1)}h on '${log.client?.name || 'Unknown'}'`,
      timestamp: new Date(log.createdAt),
      icon: BsClock,
      color: 'text-blue-600'
    })),
    ...invoices.map(invoice => ({
      id: `invoice-${invoice.id}`,
      type: 'invoice',
      message: `Invoice #${invoice.invoiceNumber} status changed to ${invoice.status}`,
      timestamp: new Date(invoice.updatedAt),
      icon: BsFileText,
      color: 'text-green-600'
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-gradient-to-br from-[#FBB03B] to-[#E0A030] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BsPlayCircle className="mr-2 text-[#0015AA]" />
        Recent Activity
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <activity.icon className={`mt-0.5 text-white`} size={16} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{activity.message}</p>
              <p className="text-xs text-white/70">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-white/70 text-sm text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;