import React from 'react';
import { FaPlus, FaGripVertical } from 'react-icons/fa';
import ProjectCard from '../ProjectCard';

const BoardView = ({ projects, tasks, milestones, onProjectSelect, loading, error }) => {
  // Define project phases
  const phases = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-50 border-gray-200' },
    { id: 'discovery', name: 'Discovery', color: 'bg-[#0015AA]/5 border-[#0015AA]/20' },
    { id: 'design', name: 'Design', color: 'bg-[#FBB03B]/5 border-[#FBB03B]/20' },
    { id: 'development', name: 'Development', color: 'bg-gray-50 border-gray-200' },
    { id: 'launch', name: 'Launch', color: 'bg-[#0015AA]/5 border-[#0015AA]/20' },
    { id: 'complete', name: 'Complete', color: 'bg-[#FBB03B]/5 border-[#FBB03B]/20' }
  ];

  // Calculate progress for each project
  const getProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.project === projectId);
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter(task => task.status === 'complete').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  // Assign projects to phases based on progress and milestones
  const getProjectPhase = (project) => {
    const progress = getProjectProgress(project.id);
    const projectMilestones = milestones.filter(m => m.project === project.id);
    const completedMilestones = projectMilestones.filter(m => m.is_reached).length;

    if (!project.is_active) return 'lead';
    if (progress === 100 && completedMilestones === projectMilestones.length) return 'complete';
    if (progress > 75 || completedMilestones > projectMilestones.length * 0.7) return 'launch';
    if (progress > 50 || completedMilestones > projectMilestones.length * 0.5) return 'development';
    if (progress > 25 || completedMilestones > 0) return 'design';
    if (progress > 0) return 'discovery';

    return 'lead';
  };

  // Group projects by phase
  const projectsByPhase = phases.reduce((acc, phase) => {
    acc[phase.id] = projects.filter(project => getProjectPhase(project) === phase.id);
    return acc;
  }, {});

  const handleDragStart = (e, project) => {
    e.dataTransfer.setData('text/plain', project.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, phaseId) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData('text/plain');
    // TODO: Implement phase update logic
    console.log(`Moving project ${projectId} to phase ${phaseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
        <span className="ml-3 text-gray-600">Loading board...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Board</h2>
          <p className="text-gray-600 mt-1">Visual project management by phase</p>
        </div>

      </div>

      {/* Board */}
      <div className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-6 shadow-inner max-w-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#0015AA transparent', maxWidth: '100%', overflowX: 'auto' }}>
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={`flex-shrink-0 w-72 sm:w-80 ${phase.color} rounded-lg border-2 p-3 sm:p-4 min-h-[600px] shadow-lg`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, phase.id)}
            style={{ minWidth: '288px', maxWidth: '320px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{phase.name}</h3>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                {projectsByPhase[phase.id].length}
              </span>
            </div>

            <div className="space-y-3">
              {projectsByPhase[phase.id].map((project) => {
                // Add computed properties for ProjectCard
                const enhancedProject = {
                  ...project,
                  progress: getProjectProgress(project.id),
                  design_tools: project.design_tools || ['Figma', 'Adobe XD'] // Default tools if not provided
                };

                return (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                  >
                    <ProjectCard
                      project={enhancedProject}
                      onCardClick={onProjectSelect}
                      phaseColor={`border-l-4 border-${phase.id === 'discovery' ? '[#0015AA]' :
                        phase.id === 'design' ? '[#FBB03B]' :
                        phase.id === 'development' ? 'gray' :
                        phase.id === 'launch' ? '[#0015AA]' :
                        phase.id === 'complete' ? '[#FBB03B]' : 'gray'}-500`}
                    />
                  </div>
                );
              })}

              {projectsByPhase[phase.id].length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm">No projects in {phase.name.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;