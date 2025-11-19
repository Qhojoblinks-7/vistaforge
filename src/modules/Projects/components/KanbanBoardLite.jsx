import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/config';

const KanbanBoardLite = ({ projects }) => {
  const navigate = useNavigate();
  const [draggedTask, setDraggedTask] = useState(null);

  // Filter tasks for today's focus
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysTasks = projects
    .filter(p => p.status === 'In Progress')
    .flatMap(p => p.tasks.filter(t => {
      if (!t.due_date) return false;
      const taskDueDate = new Date(t.due_date);
      taskDueDate.setHours(0, 0, 0, 0);
      return taskDueDate.getTime() === today.getTime() && !t.is_complete;
    }))
    .slice(0, 6);

  const currentWorkTasks = projects
    .filter(p => p.status === 'In Progress')
    .flatMap(p => p.tasks.filter(t => t.priority === 2 && !t.is_complete))
    .slice(0, 6);

  const activeTasks = [...todaysTasks, ...currentWorkTasks];

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newPriority) => {
    e.preventDefault();
    if (!draggedTask) return;

    try {
      await apiClient.patch(`/projects/${draggedTask.project_id}/tasks/${draggedTask.task_id}`, {
        priority: newPriority
      });
      // The parent component will refetch data to update the UI
      window.location.reload(); // Temporary solution - should use proper state management
    } catch (error) {
      console.error('Failed to update task:', error);
    }
    setDraggedTask(null);
  };

  const handleTaskClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Today's To Do Column */}
      <div
        className="bg-gray-50 p-4 rounded-lg min-h-[300px] border-2 border-dashed border-gray-300"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 3)}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
          Today's To Do
        </h4>
        <div className="space-y-3">
          {todaysTasks.map(task => (
            <div
              key={task.task_id}
              className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-orange-400 cursor-pointer hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              onClick={() => handleTaskClick(task.project_id)}
            >
              <p className="text-sm text-gray-900 font-medium">{task.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {projects.find(p => p.id === task.project_id)?.name}
              </p>
            </div>
          ))}
          {todaysTasks.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No tasks due today</p>
          )}
        </div>
      </div>

      {/* Currently Working On Column */}
      <div
        className="bg-blue-50 p-4 rounded-lg min-h-[300px] border-2 border-dashed border-blue-300"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 2)}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Currently Working On
        </h4>
        <div className="space-y-3">
          {currentWorkTasks.map(task => (
            <div
              key={task.task_id}
              className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              onClick={() => handleTaskClick(task.project_id)}
            >
              <p className="text-sm text-gray-900 font-medium">{task.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {projects.find(p => p.id === task.project_id)?.name}
              </p>
            </div>
          ))}
          {currentWorkTasks.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">No active tasks</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoardLite;