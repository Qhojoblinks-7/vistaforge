import React from 'react';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ProjectListItem from '../ProjectListItem';

const ListView = ({ projects, tasks, milestones, onProjectSelect, loading, error }) => {
  // Calculate progress for each project
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.project === projectId);
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter(task => task.status === 'complete').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  // Get project phase based on progress and milestones
  const getProjectPhase = (project) => {
    const progress = getProjectProgress(project.id);
    const projectMilestones = milestones.filter(m => m.project === project.id);
    const completedMilestones = projectMilestones.filter(m => m.is_reached).length;

    if (progress === 100 && completedMilestones === projectMilestones.length) {
      return { phase: 'Complete', color: 'bg-green-100 text-green-800' };
    } else if (progress > 75 || completedMilestones > projectMilestones.length * 0.7) {
      return { phase: 'Launch', color: 'bg-purple-100 text-purple-800' };
    } else if (progress > 50 || completedMilestones > projectMilestones.length * 0.5) {
      return { phase: 'Development', color: 'bg-blue-100 text-blue-800' };
    } else if (progress > 25 || completedMilestones > 0) {
      return { phase: 'Design', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { phase: 'Discovery', color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
        <span className="ml-3 text-gray-600">Loading projects...</span>
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
        
      </div>

      {/* Projects Table/List */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => {
                // Add computed properties for ProjectListItem
                const enhancedProject = {
                  ...project,
                  progress: getProjectProgress(project.id),
                  design_tools: project.design_tools || ['Figma', 'Adobe XD'] // Default tools if not provided
                };

                return (
                  <ProjectListItem
                    key={project.id}
                    project={enhancedProject}
                    onEditClick={onProjectSelect}
                    onDeleteClick={(project) => {
                      // Handle delete with confirmation
                      if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                        console.log('Delete project:', project.id);
                        // TODO: Implement actual delete logic
                      }
                    }}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="md:hidden">
          {projects.map((project) => {
            const progress = getProjectProgress(project.id);
            const phaseInfo = getProjectPhase(project);
            const enhancedProject = {
              ...project,
              progress,
              design_tools: project.design_tools || ['Figma', 'Adobe XD']
            };

            return (
              <div key={project.id} className="border-b border-gray-200 p-4 last:border-b-0">
                <div className="space-y-3">
                  {/* Project Name */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {project.status || 'Active'}
                    </span>
                  </div>

                  {/* Client */}
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-500 w-16">Client:</span>
                    <span className="text-gray-900">{project.client_type || 'N/A'}</span>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-500 w-16">Progress:</span>
                    <div className="flex-1 ml-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#0015AA] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 mt-1">{progress}%</span>
                    </div>
                  </div>

                  {/* Phase */}
                  <div className="flex items-center text-sm">
                    <span className="font-medium text-gray-500 w-16">Phase:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${phaseInfo.color}`}>
                      {phaseInfo.phase}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      onClick={() => onProjectSelect(project)}
                      className="p-2 text-gray-400 hover:text-[#0015AA] transition-colors"
                      title="View Details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onProjectSelect(project)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
                          console.log('Delete project:', project.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaPlus className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500">Get started by creating your first project.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;