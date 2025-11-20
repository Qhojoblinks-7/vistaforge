import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Play, Edit, CheckSquare } from 'lucide-react';
import { fetchKanbanTasks, updateKanbanTask, selectTodaysTasks, selectCurrentWorkTasks, updateTaskOptimistic, revertTaskUpdate } from '../../../store/slices/kanbanSlice';

const COLUMN_CONFIG = {
  3: { title: 'To Do', color: 'bg-gray-100 border-gray-200' },
  2: { title: 'In Progress', color: 'bg-blue-100 border-blue-200' },
  1: { title: 'Complete', color: 'bg-green-100 border-green-200' },
  0: { title: 'Blocked', color: 'bg-red-100 border-red-200' }
};

function SortableTaskCard({ task, projectId, onStartTimer, onEditTask, onComplete, onViewTask, showProject = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onViewTask && onViewTask(task)}
      className={`p-3 bg-white rounded-lg border cursor-grab hover:shadow-sm transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm text-gray-900 flex-1">{task.title}</h4>
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartTimer(task.id);
            }}
            className="p-1 hover:bg-blue-100 rounded"
            title="Start Timer"
          >
            <Play className="w-3 h-3 text-blue-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Edit Task"
          >
            <Edit className="w-3 h-3 text-gray-500" />
          </button>
          {task.status !== 'COMPLETED' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete(task.id);
              }}
              className="p-1 hover:bg-green-100 rounded"
              title="Mark Complete"
            >
              <CheckSquare className="w-3 h-3 text-green-500" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <div className="text-xs text-gray-500 mt-1">
          {task.description}
        </div>
      )}

      {task.status === 'COMPLETED' && (
        <div className="text-xs text-green-600 font-medium mt-1">
          ✓ Completed
        </div>
      )}

      {showProject && task.project && (
        <p className="text-xs text-gray-500 mt-1">
          {task.project.title}
        </p>
      )}
    </div>
  );
}

function KanbanColumn({ id, title, tasks, projectId, onStartTimer, onEditTask, onComplete, onViewTask, isLite = false }) {
  if (isLite) {
    // Original lite styling
    const isTodo = id === 3;
    const bgColor = isTodo ? 'bg-gray-50' : 'bg-blue-50';
    const borderColor = isTodo ? 'border-gray-300' : 'border-blue-300';
    const dotColor = isTodo ? 'bg-orange-400' : 'bg-blue-500';
    const borderLeftColor = isTodo ? 'border-orange-400' : 'border-blue-500';

    return (
      <div
        id={`column-${id}`}
        className={`${bgColor} p-4 rounded-lg min-h-[300px] border-2 border-dashed ${borderColor}`}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className={`w-3 h-3 ${dotColor} rounded-full mr-2`}></span>
          {title}
        </h4>
        <div className="space-y-3">
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(task => (
              <SortableTaskCard
                key={task.id}
                task={task}
                projectId={projectId}
                onStartTimer={onStartTimer}
                onEditTask={onEditTask}
                onComplete={onComplete}
                onViewTask={() => {
                  setSelectedProject(task.project);
                  setShowProjectModal(true);
                }}
                showProject={true}
              />
            ))}
          </SortableContext>
          {tasks.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-8">
              {id === 3 ? 'No tasks due today' : 'No active tasks'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full board styling
  const config = COLUMN_CONFIG[id] || COLUMN_CONFIG[3];

  return (
    <div
      id={`column-${id}`}
      className={`flex-1 min-h-[400px] rounded-lg border-2 ${config.color}`}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="p-4 space-y-3 min-h-[300px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskCard
              key={task.id}
              task={task}
              projectId={projectId}
              onStartTimer={onStartTimer}
              onEditTask={onEditTask}
              onComplete={onComplete}
              onViewTask={onViewTask}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

const KanbanBoardLite = ({ projects, onStartTimer, onEditTask = () => {}, onViewTask = () => {} }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const todaysTasks = useSelector(selectTodaysTasks);
  const currentWorkTasks = useSelector(selectCurrentWorkTasks);
  const [activeId, setActiveId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  useEffect(() => {
    dispatch(fetchKanbanTasks());
  }, [dispatch]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTaskId = active.id;
    const overColumnId = over.id;

    // Find the task and determine new status
    let newStatus;
    if (overColumnId === 'column-3') newStatus = 'TODO';
    else if (overColumnId === 'column-2') newStatus = 'IN_PROGRESS';
    else return; // Invalid drop target

    // Find the current task to get previous status for rollback
    const allTasks = [...todaysTasks, ...currentWorkTasks];
    const currentTask = allTasks.find(task => task.id === activeTaskId);
    const previousStatus = currentTask ? currentTask.status : null;

    // Optimistic update
    dispatch(updateTaskOptimistic({ id: activeTaskId, status: newStatus }));

    try {
      await dispatch(updateKanbanTask({
        id: activeTaskId,
        data: { status: newStatus }
      }));
    } catch (error) {
      console.error('Failed to update task:', error);
      // Rollback on error
      if (previousStatus) {
        dispatch(revertTaskUpdate({ id: activeTaskId, previousStatus }));
      }
    }

    setActiveId(null);
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await dispatch(updateKanbanTask({
        id: taskId,
        data: { status: 'COMPLETED' }
      }));
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  // Group tasks by status for lite board (only TODO and IN_PROGRESS)
  const tasksByColumn = {
    3: todaysTasks || [],
    2: currentWorkTasks || []
  };

  const allTasks = [...todaysTasks, ...currentWorkTasks];
  const activeTask = activeId ? allTasks.find(task => task.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KanbanColumn
          id={3}
          title="Today's To Do"
          tasks={tasksByColumn[3] || []}
          projectId={projects?.[0]?.id || null}
          onStartTimer={onStartTimer}
          onEditTask={onEditTask}
          onComplete={handleTaskComplete}
          onViewTask={onViewTask}
          isLite={true}
        />
        <KanbanColumn
          id={2}
          title="Currently Working On"
          tasks={tasksByColumn[2] || []}
          projectId={projects?.[0]?.id || null}
          onStartTimer={onStartTimer}
          onEditTask={onEditTask}
          onComplete={handleTaskComplete}
          onViewTask={onViewTask}
          isLite={true}
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="p-3 bg-white rounded-lg border shadow-lg rotate-3 opacity-50">
            <h4 className="font-medium text-sm text-gray-900">{activeTask.title}</h4>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  // Project Details Modal
  if (showProjectModal && selectedProject) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
            <button
              onClick={() => setShowProjectModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedProject.title}</h3>
              <p className="text-sm text-gray-600">Status: {selectedProject.status}</p>
              <p className="text-sm text-gray-600">Phase: {selectedProject.projectPhase}</p>
            </div>

            {selectedProject.description && (
              <div>
                <h4 className="font-medium text-gray-900">Description</h4>
                <p className="text-sm text-gray-700">{selectedProject.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Budget</h4>
                <p className="text-sm text-gray-700">${selectedProject.budget}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Client</h4>
                <p className="text-sm text-gray-700">{selectedProject.client?.name}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(`/projects/${selectedProject.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Full Project
              </button>
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KanbanColumn
          id={3}
          title="Today's To Do"
          tasks={tasksByColumn[3] || []}
          projectId={projects?.[0]?.id || null}
          onStartTimer={onStartTimer}
          onEditTask={onEditTask}
          onComplete={handleTaskComplete}
          onViewTask={onViewTask}
          isLite={true}
        />
        <KanbanColumn
          id={2}
          title="Currently Working On"
          tasks={tasksByColumn[2] || []}
          projectId={projects?.[0]?.id || null}
          onStartTimer={onStartTimer}
          onEditTask={onEditTask}
          onComplete={handleTaskComplete}
          onViewTask={onViewTask}
          isLite={true}
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="p-3 bg-white rounded-lg border shadow-lg rotate-3 opacity-50">
            <h4 className="font-medium text-sm text-gray-900">{activeTask.title}</h4>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoardLite;