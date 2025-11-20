import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Play, Square, Plus, Edit, Trash2, Clock, DollarSign, User } from 'lucide-react';
import { useTimer } from '../../../context/TimerContext';
import ProjectInfoPanel from '../components/ProjectInfoPanel';
import {
  fetchProjectDetail,
  updateProjectDetail,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
  selectProjectDetail,
  selectProjectTasks,
  selectProjectTimeLogs,
  selectProjectDetailLoading,
  selectProjectDetailError,
  clearProject
} from '../../../store/slices/projectDetailSlice';

const ProjectDetailView = ({ projectId, onBack }) => {
  const { id: paramId } = useParams();
  const id = projectId || paramId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeTimer, startTimer, stopTimer, formatTime } = useTimer();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Redux selectors
  const project = useSelector(selectProjectDetail);
  const tasks = useSelector(selectProjectTasks);
  const timeLogs = useSelector(selectProjectTimeLogs);
  const loading = useSelector(selectProjectDetailLoading);
  const error = useSelector(selectProjectDetailError);

  // Fetch project on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchProjectDetail(id));
    }
    return () => {
      dispatch(clearProject());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading project</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const client = project?.client;

  const handleStartTimer = (taskId) => {
    startTimer(taskId, project.id);
  };

  const handleStopTimer = async () => {
    if (activeTimer) {
      try {
        // For now, just stop the timer locally
        // TODO: Implement timer stop API call
        stopTimer();
      } catch (error) {
        console.error('Failed to stop timer:', error);
      }
    }
  };

  const handleProjectUpdate = () => {
    // Refetch project data
    dispatch(fetchProjectDetail(id));
  };

  const handleProjectDelete = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/projects');
    }
  };

  const totalLoggedHours = timeLogs?.reduce((sum, log) => sum + parseFloat(log.durationMinutes || 0) / 60, 0) || 0;
  const unbilledHours = timeLogs?.filter(log => !log.isBillable).reduce((sum, log) => sum + parseFloat(log.durationMinutes || 0) / 60, 0) || 0;
  const projectValue = totalLoggedHours * parseFloat(project?.hourly_rate || 0);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column: Project Info Panel */}
      <ProjectInfoPanel
        project={project}
        client={client}
        timeLogs={timeLogs}
        onProjectUpdate={handleProjectUpdate}
        onProjectDelete={handleProjectDelete}
        onEditProject={() => setShowProjectModal(true)}
      />

      {/* Right Column: Kanban Board */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onBack ? onBack() : navigate('/projects')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {client && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{client.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Timer Controls */}
                {activeTimer?.projectId === project.id ? (
                  <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700">
                      Task {activeTimer.taskId}: {formatTime(0)} {/* Would need to track time properly */}
                    </span>
                    <button
                      onClick={handleStopTimer}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Square className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No active timer</div>
                )}

                <button
                  onClick={() => setShowTaskModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Task Board</h2>
          </div>

          <FullKanbanBoard
            project={project}
            tasks={tasks}
            onStartTimer={handleStartTimer}
            onEditTask={setEditingTask}
          />
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          projectId={project.id}
          onClose={() => setShowTaskModal(false)}
          onCreate={(data) => dispatch(createProjectTask({ projectId: project.id, taskData: data }))}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          projectId={project.id}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdate={(taskId, data) => dispatch(updateProjectTask({ taskId, data }))}
        />
      )}

      {/* Project Edit Modal */}
      {showProjectModal && (
        <ProjectModal
          project={project}
          onClose={() => setShowProjectModal(false)}
          onSave={handleProjectUpdate}
          onUpdate={(data) => dispatch(updateProjectDetail({ id: project.id, data }))}
        />
      )}
    </div>
  );
};

// Full Kanban Board Component
const FullKanbanBoard = ({ project, tasks, onStartTimer, onEditTask }) => {
  const dispatch = useDispatch();
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: 'TODO', title: 'To Do', color: 'bg-gray-100' },
    { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'COMPLETED', title: 'Done', color: 'bg-green-100' }
  ];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    if (!draggedTask) return;

    try {
      await dispatch(updateProjectTask({
        taskId: draggedTask.id,
        data: { status }
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
    setDraggedTask(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(column => (
        <div
          key={column.id}
          className="bg-white rounded-lg border min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <span className="text-sm text-gray-500">
              {project.tasks?.filter(task => task.priority === column.id).length || 0} tasks
            </span>
          </div>

          <div className="p-4 space-y-3">
            {tasks?.filter(task => task.status === column.id).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                projectId={project.id}
                onStartTimer={onStartTimer}
                onEditTask={onEditTask}
                onDragStart={handleDragStart}
                onDelete={(taskId) => dispatch(deleteProjectTask(taskId))}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, projectId, onStartTimer, onEditTask, onDragStart, onDelete }) => {
  return (
    <div
      className="p-3 bg-gray-50 rounded-lg border cursor-move hover:shadow-sm transition-shadow"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-gray-900">{task.name}</h4>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onStartTimer(task.id)}
            className="p-1 hover:bg-blue-100 rounded"
            title="Start Timer"
          >
            <Play className="w-3 h-3 text-blue-500" />
          </button>
          <button
            onClick={() => onEditTask(task)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit Task"
          >
            <Edit className="w-3 h-3 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete && onDelete(task.id)}
            className="p-1 hover:bg-red-100 rounded"
            title="Delete Task"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>

      {task.estimated_hours && (
        <div className="text-xs text-gray-500">
          Est: {task.estimated_hours}h
        </div>
      )}
    </div>
  );
};

// Task Modal Component
const TaskModal = ({ projectId, task, onClose, onCreate, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    estimated_hours: task?.estimated_hours || '',
    priority: task?.priority || 'MEDIUM'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        onUpdate(task.id, formData);
      } else {
        onCreate(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{task ? 'Edit Task' : 'Add New Task'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Hours
            </label>
            <input
              type="number"
              step="0.5"
              value={formData.estimated_hours}
              onChange={(e) => setFormData({...formData, estimated_hours: e.target.value})}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTaskMutation?.isPending || updateTaskMutation?.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {createTaskMutation?.isPending || updateTaskMutation?.isPending ? 'Saving...' : (task ? 'Update' : 'Create') + ' Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Project Modal Component
const ProjectModal = ({ project, onClose, onSave, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    hourly_rate: project?.hourly_rate || '',
    budget: project?.budget || '',
    status: project?.status || 'PLANNING'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      onUpdate(formData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate ($/hour)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.hourly_rate}
              onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full p-2 border rounded-lg"
            >
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProjectMutation?.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {updateProjectMutation?.isPending ? 'Saving...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetailView;