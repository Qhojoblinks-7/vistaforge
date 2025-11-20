import React, { useState, useEffect } from 'react';
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
import { fetchKanbanTasks, updateKanbanTask, selectKanbanTasks, updateTaskOptimistic, revertTaskUpdate } from '../../../store/slices/kanbanSlice';

const COLUMN_CONFIG = {
  3: { title: 'To Do', color: 'bg-gray-100 border-gray-200' },
  2: { title: 'In Progress', color: 'bg-blue-100 border-blue-200' },
  1: { title: 'Complete', color: 'bg-green-100 border-green-200' },
  0: { title: 'Blocked', color: 'bg-red-100 border-red-200' }
};

function SortableTaskCard({ task, projectId, onStartTimer, onEditTask, onComplete, onViewTask }) {
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
    </div>
  );
}

function KanbanColumn({ id, title, tasks, projectId, onStartTimer, onEditTask, onComplete, onViewTask }) {
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

const KanbanBoard = ({ projects, onStartTimer, onEditTask = () => {}, onViewTask = () => {} }) => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectKanbanTasks);
  const [activeId, setActiveId] = useState(null);

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
    else if (overColumnId === 'column-1') newStatus = 'COMPLETED';
    else if (overColumnId === 'column-0') newStatus = 'BLOCKED';
    else return; // Invalid drop target

    // Find the current task to get previous status for rollback
    const currentTask = tasks.find(task => task.id === activeTaskId);
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

  // Group tasks by priority
  const tasksByColumn = {
    3: tasks?.filter(task => task.status === 'TODO') || [],
    2: tasks?.filter(task => task.status === 'IN_PROGRESS') || [],
    1: tasks?.filter(task => task.status === 'COMPLETED') || [],
    0: tasks?.filter(task => task.status === 'BLOCKED') || []
  };

  const activeTask = activeId ? tasks?.find(task => task.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(COLUMN_CONFIG).map(([priority, config]) => (
          <KanbanColumn
            key={`column-${priority}`}
            id={parseInt(priority)}
            title={config.title}
            tasks={tasksByColumn[parseInt(priority)] || []}
            projectId={projects?.[0]?.id || null} // Use first project ID for now
            onStartTimer={onStartTimer}
            onEditTask={onEditTask}
            onComplete={handleTaskComplete}
            onViewTask={onViewTask}
          />
        ))}
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

export default KanbanBoard;