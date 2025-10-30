import React, { useState, useMemo } from 'react';
import { BsArrowUp, BsArrowDown, BsExclamationTriangle, BsPlus } from 'react-icons/bs';
import ProjectListItem from './ProjectListItem';

const ProjectListView = ({
  projects,
  onProjectSelect,
  onProjectDelete,
  loading,
  error
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // Sorting logic
  const sortedProjects = useMemo(() => {
    if (!projects) return [];

    return [...projects].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [projects, sortConfig]);

  // Handle column sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Render sort indicator
  const renderSortIndicator = (columnKey) => {
    if (sortConfig.key !== columnKey) return null;

    return sortConfig.direction === 'asc'
      ? <BsArrowUp className="w-3 h-3 ml-1 inline" />
      : <BsArrowDown className="w-3 h-3 ml-1 inline" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
        <span className="ml-3 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <BsExclamationTriangle className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading projects</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
        </div>
        <div className="text-sm text-gray-500">
          {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-100 sticky top-0 border-b border-gray-300">
            <tr>
              <th
                className="w-5/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('name')}
              >
                Project {renderSortIndicator('name')}
              </th>
              <th className="w-1/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th
                className="w-1/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('progress')}
              >
                Progress {renderSortIndicator('progress')}
              </th>
              <th
                className="w-1/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('is_active')}
              >
                Status {renderSortIndicator('is_active')}
              </th>
              <th
                className="w-1/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('industry')}
              >
                Industry {renderSortIndicator('industry')}
              </th>
              <th
                className="w-1/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSort('order')}
              >
                Order {renderSortIndicator('order')}
              </th>
              <th className="w-2/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Tools
              </th>
              <th className="w-1/12 px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProjects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onEditClick={onProjectSelect}
                onDeleteClick={(project) => {
                  if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
                    onProjectDelete(project);
                  }
                }}
              />
            ))}
          </tbody>
        </table>

        {sortedProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BsPlus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Click 'Add Project' to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListView;
