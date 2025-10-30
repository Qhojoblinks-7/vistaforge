import React from 'react';

const ProjectCard = ({ project, onCardClick, phaseColor = 'border-gray-300' }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getToolIcon = (tool) => {
    // Simple mapping of design tools to colors (you can expand this)
    const toolColors = {
      'Figma': 'bg-purple-500',
      'Adobe XD': 'bg-pink-500',
      'Sketch': 'bg-orange-500',
      'Photoshop': 'bg-blue-600',
      'Illustrator': 'bg-yellow-500',
      'InVision': 'bg-green-500',
      'Zeplin': 'bg-indigo-500',
      'Principle': 'bg-red-500'
    };
    return toolColors[tool] || 'bg-gray-400';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-4 mb-3 ${phaseColor} cursor-pointer hover:shadow-xl transition-all duration-200 border-l-4 transform hover:scale-[1.02]`}
      onClick={() => onCardClick(project)}
    >
      {/* Project Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {project.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {project.client_type}
          </p>
        </div>
        <div className="flex-shrink-0 ml-2">
          <img
            src={project.logo}
            alt={`${project.name} logo`}
            className="w-6 h-6 rounded-full"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs text-gray-500">{project.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
            style={{ width: `${project.progress || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Design Tools */}
      <div className="flex items-center space-x-1">
        <span className="text-xs text-gray-500 mr-2">Tools:</span>
        <div className="flex space-x-1">
          {project.design_tools && project.design_tools.slice(0, 4).map((tool, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${getToolIcon(tool)}`}
              title={tool}
            />
          ))}
          {project.design_tools && project.design_tools.length > 4 && (
            <span className="text-xs text-gray-400 ml-1">
              +{project.design_tools.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            project.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {project.is_active ? 'Active' : 'Inactive'}
          </span>
          <span className="text-xs text-gray-400">
            #{project.order || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;