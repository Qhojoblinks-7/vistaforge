import React from 'react';
import { BsListUl, BsColumns, BsCalendarCheck } from 'react-icons/bs';

const ViewSwitcher = ({ activeView, onViewChange, loading = false }) => {
  const views = [
    {
      id: 'list',
      label: 'List',
      icon: BsListUl,
      tooltip: 'High-Density List View'
    },
    {
      id: 'board',
      label: 'Board',
      icon: BsColumns,
      tooltip: 'Kanban Board View'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: BsCalendarCheck,
      tooltip: 'Project & Task Timeline'
    }
  ];

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200 shadow-md">
      {views.map((view) => {
        const Icon = view.icon;
        const isActive = activeView === view.id;

        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            disabled={loading}
            title={view.tooltip}
            className={`flex items-center justify-center flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#0015AA] text-white shadow-md hover:bg-[#003366] font-semibold'
                : 'bg-transparent text-gray-700 hover:bg-gray-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{view.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewSwitcher;