import React, { useState, useEffect, useCallback } from 'react';
import { BsClock, BsPlay, BsPause, BsPlus, BsPencil, BsTrash, BsStop, BsCheckCircle, BsXCircle, BsFilter } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchTimeLogs,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
  setFilters,
  setSorting,
  clearError
} from '../store/slices/timeLogsSlice';
import { fetchPublicProjects } from '../store/slices/publicPortfolioSlice';

// Import shared components
import PageLayout from '../components/common/PageLayout';
import PageHeader from '../components/common/PageHeader';
import DataTable from '../components/common/DataTable';
import MetricCard from '../components/common/MetricCard';
import FilterPanel, { SelectFilter, DateRangeFilter } from '../components/common/FilterPanel';
import { FormModal } from '../components/common/Modal';

const TimeLogsPage = () => {
  const dispatch = useDispatch();
  const {
    timeLogs,
    currentTimer,
    loading,
    saving,
    error,
    filters,
    sortBy,
    sortOrder
  } = useSelector((state) => state.timeLogs);

  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    projectId: '',
    taskId: '',
    startTime: '',
    endTime: '',
    description: '',
    billable: true
  });
  const [editingLog, setEditingLog] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load time logs on component mount
  useEffect(() => {
    dispatch(fetchTimeLogs());
    // Also fetch projects for project selection in time logs
    dispatch(fetchPublicProjects());
  }, [dispatch]);

  // Timer interval for elapsed time display
  useEffect(() => {
    let interval;
    if (currentTimer && currentTimer.isRunning) {
      interval = setInterval(() => {
        const start = new Date(currentTimer.startTime);
        const now = new Date();
        const elapsed = Math.floor((now - start) / 1000); // seconds
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTimer]);

  // Show error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const formatElapsedTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formatDuration = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const handleStartTimer = async () => {
    // For demo, use first available client
    // In real app, show client/task selection modal
    try {
      const result = await dispatch(startTimer({
        taskName: 'Timer session',
        clientId: projectOptions[0]?.id, // Use first project as demo
        description: 'Timer session'
      })).unwrap();

      // Update current timer state for UI
      // The backend returns the created time log, we can use it to track the active timer
      toast.success('Timer started!');
    } catch (error) {
      toast.error('Failed to start timer');
    }
  };

  // Filter and sort time logs
  const getFilteredAndSortedTimeLogs = () => {
    let filtered = [...timeLogs];

    // Apply filters
    if (filters.project) {
      filtered = filtered.filter(log => log.client?.id === parseInt(filters.project));
    }
    if (filters.task) {
      filtered = filtered.filter(log => log.taskName?.includes(filters.task));
    }
    if (filters.billable !== '') {
      filtered = filtered.filter(log => log.isBillable === (filters.billable === 'true'));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'project':
          aValue = a.client?.name || '';
          bValue = b.client?.name || '';
          break;
        case 'task':
          aValue = a.taskName || '';
          bValue = b.taskName || '';
          break;
        case 'duration':
          aValue = a.durationHours || 0;
          bValue = b.durationHours || 0;
          break;
        case 'startTime':
        default:
          aValue = new Date(a.startTime);
          bValue = new Date(b.startTime);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleStopTimer = async () => {
    if (!currentTimer) {
      toast.error('No active timer to stop');
      return;
    }

    try {
      await dispatch(stopTimer(currentTimer.id)).unwrap();
      toast.success('Timer stopped successfully!');
    } catch (error) {
      toast.error('Failed to stop timer');
    }
  };

  const handleManualEntry = async () => {
    if (!manualEntry.projectId || !manualEntry.startTime || !manualEntry.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const startTime = new Date(manualEntry.startTime);
    const endTime = new Date(manualEntry.endTime);
    const duration = (endTime - startTime) / (1000 * 60 * 60); // hours

    if (duration <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await dispatch(createTimeLog({
        client_id: manualEntry.projectId, // Map projectId to client_id
        task_name: manualEntry.taskId ? `Task ${manualEntry.taskId}` : 'Manual Entry',
        start_time: manualEntry.startTime,
        end_time: manualEntry.endTime,
        is_billable: manualEntry.billable,
        description: manualEntry.description
      })).unwrap();

      setManualEntry({
        projectId: '',
        taskId: '',
        startTime: '',
        endTime: '',
        description: '',
        billable: true
      });
      setShowManualEntry(false);
      toast.success('Time log created successfully!');
    } catch (error) {
      toast.error('Failed to create time log');
    }
  };

  const handleDeleteTimeLog = async (logId) => {
    if (window.confirm('Are you sure you want to delete this time log?')) {
      try {
        await dispatch(deleteTimeLog(logId)).unwrap();
        toast.success('Time log deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete time log');
      }
    }
  };

  // Use server projects (publicPortfolio) as project options for the time logs UI
  const serverProjects = useSelector((state) => state.publicPortfolio.projects || []);
  const projectOptions = serverProjects.map(p => ({ id: p.id, title: p.title || p.name, slug: p.slug }));

  const mockTasks = [
    { id: 1, title: 'Website Redesign' },
    { id: 2, title: 'UI/UX Design' }
  ];

  const tableColumns = [
    { key: 'client', header: 'Project', sortable: true, render: (value) => value?.name || 'No Client' },
    { key: 'taskName', header: 'Task', sortable: true, render: (value) => value || 'No Task' },
    { key: 'startTime', header: 'Date', sortable: true, render: (value) => (
      <div>
        <div className="text-sm font-medium text-gray-900">
          {new Date(value).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    )},
    { key: 'durationHours', header: 'Duration', sortable: true, render: (value) => (
      <div>
        <div className="text-lg font-bold text-gray-900">{formatDuration(value || 0)}</div>
        <div className="text-xs text-gray-500">hours</div>
      </div>
    )},
    { key: 'isBillable', header: 'Billable', render: (value) => (
      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
        value ? 'bg-[#0015AA]/20 text-[#0015AA]' : 'bg-gray-100 text-gray-700'
      }`}>
        {value ? 'Billable' : 'Non-billable'}
      </span>
    )}
  ];

  const tableActions = [
    { icon: <BsPencil />, label: 'Edit', onClick: (log) => setEditingLog(log) },
    { icon: <BsTrash />, label: 'Delete', onClick: (log) => handleDeleteTimeLog(log.id), variant: 'danger' }
  ];

  const getTimerActions = () => {
    if (currentTimer && currentTimer.isRunning) {
      return [
        {
          label: `${formatElapsedTime(elapsedTime)} - Stop`,
          icon: <BsStop size={18} />,
          onClick: handleStopTimer,
          variant: 'danger',
          disabled: saving
        },
        {
          label: 'Pause',
          icon: <BsPause size={18} />,
          onClick: () => dispatch(pauseTimer()),
          variant: 'warning'
        }
      ];
    } else if (currentTimer && !currentTimer.isRunning) {
      return [
        {
          label: 'Resume Timer',
          icon: <BsPlay size={18} />,
          onClick: () => dispatch(resumeTimer()),
          variant: 'success'
        },
        {
          label: 'Reset',
          icon: <BsXCircle size={18} />,
          onClick: () => dispatch(resetTimer()),
          variant: 'secondary'
        }
      ];
    } else {
      return [
        {
          label: 'Start Timer',
          icon: <BsPlay size={18} />,
          onClick: handleStartTimer,
          variant: 'primary',
          disabled: saving
        }
      ];
    }
  };

  return (
    <PageLayout
      title="Time Logs"
      description="Track and manage your time logs for all projects"
      keywords="time logs, timer, tracking, billable hours, productivity"
    >
      {/* Analytics Dashboard */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Hours"
          value={`${getFilteredAndSortedTimeLogs().reduce((total, log) => total + (log.durationHours || 0), 0).toFixed(1)}h`}
          icon={<BsClock size={24} />}
          color="primary"
        />
        <MetricCard
          title="Billable Hours"
          value={`${getFilteredAndSortedTimeLogs().filter(log => log.isBillable).reduce((total, log) => total + (log.durationHours || 0), 0).toFixed(1)}h`}
          icon={<BsCheckCircle size={24} />}
          color="success"
        />
        <MetricCard
          title="This Week"
          value={`${getFilteredAndSortedTimeLogs()
            .filter(log => {
              const logDate = new Date(log.startTime);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return logDate >= weekAgo;
            })
            .reduce((total, log) => total + (log.durationHours || 0), 0).toFixed(1)}h`}
          icon={<BsClock size={24} />}
          color="info"
        />
        <MetricCard
          title="Avg. Daily"
          value={`${(getFilteredAndSortedTimeLogs().reduce((total, log) => total + (log.durationHours || 0), 0) / 7).toFixed(1)}h`}
          icon={<BsClock size={24} />}
          color="secondary"
        />
      </div>

      <PageHeader
        title="Time Tracking"
        description="Track your work hours and manage billable time"
        stats={[
          { label: 'total', value: timeLogs.length },
          { label: 'billable', value: timeLogs.filter(log => log.isBillable).length },
          { label: 'this week', value: timeLogs.filter(log => {
            const logDate = new Date(log.startTime);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return logDate >= weekAgo;
          }).length }
        ]}
        actions={[
          ...getTimerActions(),
          {
            label: 'Manual Entry',
            icon: <BsPlus size={18} />,
            onClick: () => setShowManualEntry(true),
            variant: 'secondary'
          },
          {
            label: 'Filters',
            icon: <BsFilter size={16} />,
            onClick: () => setShowFilters(!showFilters),
            variant: showFilters ? 'secondary' : 'default'
          }
        ]}
      />

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          isOpen={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
          onClearFilters={() => dispatch(setFilters({ project: '', task: '', billable: '' }))}
        >
          <SelectFilter
            label="Project"
            value={filters.project || ''}
            onChange={(value) => dispatch(setFilters({ ...filters, project: value }))}
            options={[
              { value: '', label: 'All Projects' },
              ...projectOptions.map(project => ({ value: project.id.toString(), label: project.title }))
            ]}
          />
          <SelectFilter
            label="Task"
            value={filters.task || ''}
            onChange={(value) => dispatch(setFilters({ ...filters, task: value }))}
            options={[
              { value: '', label: 'All Tasks' },
              ...mockTasks.map(task => ({ value: task.id.toString(), label: task.title }))
            ]}
          />
          <SelectFilter
            label="Billable"
            value={filters.billable || ''}
            onChange={(value) => dispatch(setFilters({ ...filters, billable: value }))}
            options={[
              { value: '', label: 'All' },
              { value: 'true', label: 'Billable' },
              { value: 'false', label: 'Non-billable' }
            ]}
          />
        </FilterPanel>
      )}

      {/* Time Logs Table */}
      <DataTable
        title="Time Logs"
        subtitle={`${timeLogs.length} total time logs`}
        columns={tableColumns}
        data={getFilteredAndSortedTimeLogs()}
        loading={loading}
        error={error}
        emptyMessage="No time logs found. Try adjusting your filters."
        emptyAction={{
          label: 'Start Timer',
          onClick: handleStartTimer
        }}
        actions={tableActions}
        sortable={true}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={(column) => {
          const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
          dispatch(setSorting({ sortBy: column, sortOrder: newOrder }));
        }}
      />

      {/* Manual Entry Modal */}
      <FormModal
        isOpen={showManualEntry}
        onClose={() => setShowManualEntry(false)}
        title="Manual Time Entry"
        onSubmit={handleManualEntry}
        submitLabel={saving ? 'Creating...' : 'Create Time Log'}
        loading={saving}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Project</label>
            <select
              value={manualEntry.projectId}
              onChange={(e) => setManualEntry({...manualEntry, projectId: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
            >
              <option value="">Select Project</option>
              {projectOptions.map(project => (
                <option key={project.id} value={project.id}>{project.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Task</label>
            <select
              value={manualEntry.taskId}
              onChange={(e) => setManualEntry({...manualEntry, taskId: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
            >
              <option value="">Select Task</option>
              {mockTasks.map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={manualEntry.startTime}
                onChange={(e) => setManualEntry({...manualEntry, startTime: e.target.value})}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">End Time</label>
              <input
                type="datetime-local"
                value={manualEntry.endTime}
                onChange={(e) => setManualEntry({...manualEntry, endTime: e.target.value})}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              value={manualEntry.description}
              onChange={(e) => setManualEntry({...manualEntry, description: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
              rows="3"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="billable"
              checked={manualEntry.billable}
              onChange={(e) => setManualEntry({...manualEntry, billable: e.target.checked})}
              className="h-4 w-4 text-[#0015AA] focus:ring-[#0015AA] border-gray-300 rounded"
            />
            <label htmlFor="billable" className="ml-2 text-sm font-medium text-gray-700">
              Billable time
            </label>
          </div>
        </div>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={!!editingLog}
        onClose={() => setEditingLog(null)}
        title="Edit Time Log"
        onSubmit={() => {
          // TODO: Implement update functionality
          toast.info('Edit functionality coming soon!');
          setEditingLog(null);
        }}
        submitLabel="Update Time Log"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              value={editingLog?.description || ''}
              onChange={(e) => setEditingLog({...editingLog, description: e.target.value})}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
              rows="3"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-billable"
              checked={editingLog?.billable}
              onChange={(e) => setEditingLog({...editingLog, billable: e.target.checked})}
              className="h-4 w-4 text-[#0015AA] focus:ring-[#0015AA] border-gray-300 rounded"
            />
            <label htmlFor="edit-billable" className="ml-2 text-sm font-medium text-gray-700">
              Billable time
            </label>
          </div>
        </div>
      </FormModal>
    </PageLayout>
  );
};

export default TimeLogsPage;