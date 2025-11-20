import React from 'react';
import { BsCalendar, BsExclamationTriangle } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const UpcomingDeadlinesWidget = ({ projects }) => {
  // Filter projects due within the next 7 days
  const upcomingDeadlines = projects
    ?.filter(p => p.endDate)
    .filter(p => {
      const dueDate = new Date(p.endDate);
      const today = new Date();
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);
      return dueDate >= today && dueDate <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 5) || [];

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <div className="bg-gradient-to-br from-[#0015AA] to-[#003366] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BsCalendar className="mr-2 text-[#FBB03B]" />
        Upcoming Deadlines
      </h3>
      <div className="space-y-3">
        {upcomingDeadlines.map(project => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="block p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-[#FBB03B]/50 transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white">{project.title}</h4>
                <p className="text-sm text-white/70">{project.clientType}</p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium flex items-center ${
                  isOverdue(project.endDate) ? 'text-red-300' : 'text-white'
                }`}>
                  {isOverdue(project.endDate) && <BsExclamationTriangle className="mr-1" />}
                  {new Date(project.endDate).toLocaleDateString()}
                </div>
                <div className="text-xs text-white/60">
                  {Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          </Link>
        ))}
        {upcomingDeadlines.length === 0 && (
          <p className="text-white/70 text-sm text-center py-4">No upcoming deadlines</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlinesWidget;