import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

const ProjectListItem = ({ project, onEditClick, onDeleteClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <tr className="bg-white border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md">
      {/* Name & Slug - Primary Click Target */}
      <td className="px-6 py-4 w-5/12">
        <div className="flex items-center">
          <img
            src={project.logo}
            alt={`${project.name} logo`}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <button
              onClick={() => onEditClick(project)}
              className="text-left font-medium text-gray-900 hover:text-[#0015AA] cursor-pointer block"
            >
              {project.name}
            </button>
            <div className="text-xs text-gray-500 mt-1">
              {project.slug} • {project.client_type}
            </div>
          </div>
        </div>
      </td>

      {/* Progress - Visual Progress Bar */}
      <td className="px-6 py-4 w-1/12 text-center">
        <div className="w-full max-w-xs mx-auto">
          <div className="text-xs text-gray-500 mb-1">
            {project.progress || 0}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-300 ${getProgressColor(project.progress || 0)}`}
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </td>

      {/* Status - Color-coded Badge */}
      <td className="px-6 py-4 w-1/12 text-center">
        <div className="flex items-center justify-center">
          {project.is_active ? (
            <BsCheckCircle className="w-4 h-4 text-green-600 mr-1" />
          ) : (
            <BsXCircle className="w-4 h-4 text-red-600 mr-1" />
          )}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            project.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {project.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </td>

      {/* Industry */}
      <td className="px-6 py-4 w-1/12 text-sm text-gray-600 text-center">
        {project.industry}
      </td>

      {/* Order */}
      <td className="px-6 py-4 w-1/12 text-sm text-gray-600 text-center">
        {project.order || 0}
      </td>

      {/* Tools - Design Tools Tags */}
      <td className="px-6 py-4 w-2/12">
        <div className="flex flex-wrap gap-1">
          {project.design_tools && project.design_tools.slice(0, 4).map((tool, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tool}
            </span>
          ))}
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 w-1/12 text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => window.open(`/projects/${project.slug}`, '_blank')}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="View Frontend"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteClick(project)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Project"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProjectListItem;