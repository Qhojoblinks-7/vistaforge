import React, { useState } from 'react';
import { FaPlus, FaChevronDown, FaChevronRight, FaCalendarAlt, FaUser, FaFlag } from 'react-icons/fa';

const TaskView = ({ projects, tasks, milestones, onProjectSelect, loading, error }) => {
  const [expandedProjects, setExpandedProjects] = useState(new Set());

  const toggleProjectExpansion = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.project === projectId);
    if (projectTasks.length === 0) return { completed: 0, total: 0, percentage: 0 };

    const completed = projectTasks.filter(task => task.status === 'complete').length;
    const percentage = Math.round((completed / projectTasks.length) * 100);

    return { completed, total: projectTasks.length, percentage };
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
        <span className="ml-3 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Timeline</h2>
          <p className="text-gray-600 mt-1">Gantt-style project and task management</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors">
          <FaPlus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {projects.map((project) => {
            const isExpanded = expandedProjects.has(project.id);
            const progress = getProjectProgress(project.id);
            const projectTasks = tasks.filter(task => task.project === project.id);
            const projectMilestones = milestones.filter(m => m.project === project.id);

            return (
              <div key={project.id} className="p-4">
                {/* Project Header */}
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -m-4 p-4 rounded-lg transition-colors"
                  onClick={() => toggleProjectExpansion(project.id)}
                >
                  <div className="flex items-center space-x-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      {isExpanded ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />}
                    </button>

                    <img
                      src={project.logo}
                      alt={`${project.name} logo`}
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.client_type} • {project.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {progress.completed}/{progress.total} tasks
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#0015AA] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProjectSelect(project);
                      }}
                      className="text-[#0015AA] hover:text-[#003366] text-sm font-medium"
                    >
                      Details
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 ml-8 space-y-4">
                    {/* Milestones */}
                    {projectMilestones.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <FaFlag className="w-4 h-4 mr-2 text-red-500" />
                          Milestones
                        </h4>
                        <div className="space-y-2">
                          {projectMilestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FaFlag className={`w-4 h-4 ${milestone.is_reached ? 'text-green-600' : 'text-red-500'}`} />
                                <div>
                                  <span className="font-medium text-gray-900">{milestone.name}</span>
                                  {milestone.description && (
                                    <p className="text-sm text-gray-600">{milestone.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <FaCalendarAlt className="w-4 h-4 mr-1" />
                                  {formatDate(milestone.target_date)}
                                </div>
                                {milestone.is_reached && (
                                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tasks */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tasks</h4>
                      <div className="space-y-2">
                        {projectTasks.length > 0 ? (
                          projectTasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-center space-x-3 flex-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                                  {task.status.replace('_', ' ')}
                                </span>
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900">{task.name}</span>
                                  {task.description && (
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {task.assigned_to && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <FaUser className="w-4 h-4 mr-1" />
                                    {task.assigned_to}
                                  </div>
                                )}
                                {task.due_date && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <FaCalendarAlt className="w-4 h-4 mr-1" />
                                    {formatDate(task.due_date)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <p>No tasks yet. Add tasks to track progress!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
            <p className="text-gray-500">Create your first project to start managing tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskView;