import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { FaTimes, FaInfo, FaTasks, FaFlag, FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import { BsPlus } from 'react-icons/bs';
import TaskListItem from './TaskListItem';
import apiService from '../services/api';

const ProjectDetailDrawer = ({
  project,
  isOpen,
  onClose,
  onSave,
  tasks: initialTasks = [],
  milestones: initialMilestones = []
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [newTask, setNewTask] = useState({ name: '', due_date: '', status: 'to_do' });
  const [newMilestone, setNewMilestone] = useState({ name: '', due_date: '' });
  const [tasks, setTasks] = useState(initialTasks);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [loading, setLoading] = useState(false);

  // Load tasks and milestones when project changes
  useEffect(() => {
    if (project?.id && isOpen) {
      loadProjectData();
    }
  }, [project?.id, isOpen]);

  // Refresh tasks when activeTab changes to tasks
  useEffect(() => {
    if (activeTab === 'tasks' && project?.id && isOpen) {
      loadProjectData();
    }
  }, [activeTab]);

  const loadProjectData = async () => {
    if (!project?.id) return;

    setLoading(true);
    try {
      const [tasksData, milestonesData] = await Promise.all([
        apiService.getTasks(project.id),
        apiService.getMilestones(project.id)
      ]);
      setTasks(tasksData);
      setMilestones(milestonesData);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.name.trim() || !project?.id) return;

    try {
      const taskData = { ...newTask, project: project.id };
      const createdTask = await apiService.createTask(taskData);
      setTasks(prev => [...prev, createdTask]);
      setNewTask({ name: '', due_date: '', status: 'to_do' });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      const updatedTask = await apiService.updateTask(taskId, updates);
      setTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.name.trim() || !project?.id) return;

    try {
      const milestoneData = { ...newMilestone, project: project.id };
      const createdMilestone = await apiService.createMilestone(milestoneData);
      setMilestones(prev => [...prev, createdMilestone]);
      setNewMilestone({ name: '', due_date: '' });
    } catch (error) {
      console.error('Failed to create milestone:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    try {
      await apiService.deleteMilestone(milestoneId);
      setMilestones(prev => prev.filter(milestone => milestone.id !== milestoneId));
    } catch (error) {
      console.error('Failed to delete milestone:', error);
    }
  };

  // Animation for slide-in/slide-out
  const drawerAnimation = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
    config: { tension: 300, friction: 30 }
  });

  const tabs = [
    { id: 'details', label: 'Details', icon: FaInfo },
    { id: 'tasks', label: 'Tasks', icon: FaTasks },
    { id: 'milestones', label: 'Milestones', icon: FaFlag }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <animated.div
        style={drawerAnimation}
        className="fixed inset-y-0 right-0 w-full sm:w-1/3 bg-white z-50 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 p-3 sm:p-4 border-b bg-white flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-2">
            {project?.name || 'Project Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex items-center justify-center py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#0015AA] border-b-2 border-[#0015AA] bg-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden xs:inline">{tab.label}</span>
                <span className="xs:hidden">{tab.label.slice(0, 4)}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto max-w-full">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                <div className="space-y-4">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      defaultValue={project?.name || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug
                    </label>
                    <input
                      type="text"
                      defaultValue={project?.slug || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>

                  {/* Client Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Type
                    </label>
                    <select
                      defaultValue={project?.client_type || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    >
                      <option value="">Select client type</option>
                      <option value="SME">SME</option>
                      <option value="Startup">Startup</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Non-profit">Non-profit</option>
                    </select>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      defaultValue={project?.industry || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>

                  {/* Intro */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Intro
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={project?.intro || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Brief project introduction..."
                    />
                  </div>

                  {/* Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      defaultValue={project?.logo || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <select
                      defaultValue={project?.project_type || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    >
                      <option value="">Select project type</option>
                      <option value="brand_design">Brand Design</option>
                      <option value="web_development">Web Development</option>
                      <option value="marketing">Marketing</option>
                      <option value="consulting">Consulting</option>
                    </select>
                  </div>

                  {/* Design Tools */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Design Tools
                    </label>
                    <input
                      type="text"
                      defaultValue={project?.design_tools?.join(', ') || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Figma, Adobe XD, Sketch..."
                    />
                  </div>

                  {/* Project Story */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Story
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={project?.caseStudy?.startingPoint || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Describe the full project story..."
                    />
                  </div>

                  {/* Visuals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visuals (JSON)
                    </label>
                    <textarea
                      rows={3}
                      defaultValue={JSON.stringify(project?.caseStudy?.visuals || {}, null, 2)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent font-mono text-xs"
                      placeholder='{"logo": "url", "mockup": "url"}'
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      defaultValue={project?.order || 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                    />
                  </div>

                  {/* Is Active */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={project?.is_active || false}
                        className="rounded border-gray-300 text-[#0015AA] focus:ring-[#0015AA]"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">Is Active</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="p-3 sm:p-6">
              {/* Add Task Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Task</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Task name"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent text-sm sm:text-base"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent text-sm sm:text-base"
                    />
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="to_do">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    <button
                      onClick={handleAddTask}
                      className="px-3 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors"
                    >
                      <BsPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div className="space-y-1">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0015AA] mx-auto mb-2"></div>
                    <p>Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaTasks className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks yet</p>
                    <p className="text-sm">Add your first task to get started</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskListItem
                      key={task.id}
                      task={task}
                      onEditClick={() => {/* TODO: Implement edit modal */}}
                      onDeleteClick={() => handleDeleteTask(task.id)}
                      onStatusChange={(taskId, status) => handleUpdateTask(taskId, { status })}
                      showProjectName={false}
                      compact={true}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="p-3 sm:p-6">
              {/* Add Milestone Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Milestone</h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Milestone name"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent text-sm sm:text-base"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="date"
                      value={newMilestone.due_date}
                      onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent text-sm sm:text-base"
                    />
                    <button
                      onClick={handleAddMilestone}
                      className="px-3 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors"
                    >
                      <BsPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Milestone List */}
              <div className="space-y-3">
                {milestones.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FaFlag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No milestones yet</p>
                    <p className="text-sm">Define key project phases and dates</p>
                  </div>
                ) : (
                  milestones.map((milestone) => (
                    <div key={milestone.id} className={`p-3 rounded-lg border ${
                      milestone.is_reached
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {milestone.is_reached && <FaCheck className="w-4 h-4 text-green-600" />}
                          <span className={`font-medium ${
                            milestone.is_reached ? 'text-green-800 line-through' : 'text-gray-900'
                          }`}>
                            {milestone.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                      {milestone.description && (
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      )}
                      {milestone.due_date && (
                        <p className={`text-xs mt-1 ${
                          milestone.is_reached ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          Target: {new Date(milestone.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-3 sm:p-4 border-t bg-white flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Implement save logic
              onSave?.(project);
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors text-sm sm:text-base"
          >
            Save Changes
          </button>
        </div>
      </animated.div>
    </>
  );
};

export default ProjectDetailDrawer;