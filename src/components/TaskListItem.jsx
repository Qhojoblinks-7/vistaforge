import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsCircle, BsClock, BsCheckCircleFill, BsLock } from 'react-icons/bs';
import apiService from '../services/api';

const TaskListItem = ({
  task,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  showProjectName = false,
  compact = false
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <BsCheckCircleFill className="w-3 h-3" />;
      case 'in_progress':
        return <BsClock className="w-3 h-3" />;
      case 'blocked':
        return <BsLock className="w-3 h-3" />;
      default:
        return <BsCircle className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-blue-100 text-[#0015AA]';
      case 'blocked':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-400';
    }
  };

  const handleStatusClick = async (e) => {
    e.stopPropagation();
    const newStatus = task.status === 'complete' ? 'to_do' : 'complete';

    try {
      await apiService.updateTask(task.id, { status: newStatus });
      onStatusChange?.(task.id, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500';
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 && task.status !== 'complete') return 'text-red-600'; // Overdue
    if (diffDays <= 1 && task.status !== 'complete') return 'text-orange-600'; // Due today/tomorrow
    return 'text-gray-500'; // Future or completed
  };

  return (
    <div className={`flex items-center py-2 px-1 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md transform hover:scale-[1.01] ${compact ? 'py-1' : ''}`}>
      {/* 1. Completion - Checkbox */}
      <div className="w-5 flex justify-center">
        <input
          type="checkbox"
          checked={task.status === 'complete'}
          onChange={handleStatusClick}
          className="w-4 h-4 text-[#0015AA] bg-gray-100 border-gray-300 rounded focus:ring-[#0015AA] focus:ring-2 cursor-pointer"
        />
      </div>

      {/* 2. Task Name & Date */}
      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className={`font-medium truncate ${
            task.status === 'complete'
              ? 'text-gray-500 line-through'
              : 'text-gray-800'
          } ${compact ? 'text-sm' : ''}`}>
            {task.title}
          </h4>
          {task.priority && (
            <span className={`text-xs ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
          )}
        </div>

        {task.description && !compact && (
          <p className="text-sm text-gray-600 mt-1 truncate">
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {task.due_date && (
          <div className="flex items-center space-x-4 mt-1">
            <span className={`text-xs ${getDueDateColor(task.due_date)}`}>
              Due: {new Date(task.due_date).toLocaleDateString()}
            </span>
            {showProjectName && task.project_name && (
              <span className="text-xs text-gray-500">
                {task.project_name}
              </span>
            )}
            {task.assigned_to && (
              <span className="text-xs text-gray-500">
                Assigned to: {task.assigned_to}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. Status Badge */}
      <div className="w-20 flex justify-center">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status === 'to_do' ? 'To Do' : task.status.replace('_', ' ')}
        </span>
      </div>

      {/* 4. Actions */}
      <div className="w-10 flex justify-end">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this task?')) {
              try {
                await apiService.deleteTask(task.id);
                onDeleteClick?.(task);
              } catch (error) {
                console.error('Failed to delete task:', error);
              }
            }
          }}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete Task"
        >
          <FaTrash className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default TaskListItem;