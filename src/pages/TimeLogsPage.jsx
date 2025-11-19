import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsClock, BsPlay, BsPause, BsPlus, BsPencil, BsTrash, BsStop, BsCheckCircle, BsXCircle } from 'react-icons/bs';
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0015AA]/5 via-transparent to-[#FBB03B]/5"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#FBB03B]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 left-16 w-48 h-48 bg-[#0015AA]/8 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-400/6 rounded-full blur-xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Helmet>
          <title>Time Logs - Freespec</title>
          <meta name="description" content="Track and manage your time logs for all projects" />
        </Helmet>

        {/* Header with CTA and Banner Background */}
        <div className="mb-8 relative">
          {/* Header Banner Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0015AA]/10 via-[#FBB03B]/5 to-[#0015AA]/10 rounded-xl"></div>
          <div className="absolute top-4 right-8 w-24 h-24 bg-[#FBB03B]/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-2 left-12 w-16 h-16 bg-[#0015AA]/15 rounded-full blur-lg"></div>

          <div className="relative z-10 flex items-center justify-between py-6 px-6">
            <div>
              <p className="text-gray-700 font-medium">Track your work hours and manage billable time</p>
            </div>
            <div className="flex gap-3">
              {currentTimer && currentTimer.isRunning ? (
                <div className="flex gap-3">
                  <div className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center font-semibold">
                    <BsStop className="mr-2" size={18} />
                    <span className="mr-3">{formatElapsedTime(elapsedTime)}</span>
                    <button
                      onClick={handleStopTimer}
                      className="hover:bg-red-700 px-3 py-1 rounded transition-colors"
                      disabled={saving}
                    >
                      Stop
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(pauseTimer())}
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5"
                  >
                    <BsPause className="mr-2" size={18} />
                    Pause
                  </button>
                </div>
              ) : currentTimer && !currentTimer.isRunning ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => dispatch(resumeTimer())}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5"
                  >
                    <BsPlay className="mr-2" size={18} />
                    Resume Timer
                  </button>
                  <button
                    onClick={() => dispatch(resetTimer())}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5"
                  >
                    <BsXCircle className="mr-2" size={18} />
                    Reset
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartTimer}
                  className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5"
                  disabled={saving}
                >
                  <BsPlay className="mr-2" size={18} />
                  Start Timer
                </button>
              )}
              <button
                onClick={() => setShowManualEntry(true)}
                className="bg-[#FBB03B] text-white px-6 py-3 rounded-lg hover:bg-[#E0A030] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center font-semibold hover:-translate-y-0.5"
              >
                <BsPlus className="mr-2" size={18} />
                Manual Entry
              </button>
            </div>
          </div>
        </div>

        {/* Time Logs Table - Primary Content with Visual Hierarchy */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-[#0015AA] to-[#003366]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recent Time Logs</h2>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <BsClock className="text-white" size={16} />
              </div>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Project:</label>
                  <select
                    value={filters.project}
                    onChange={(e) => dispatch(setFilters({ ...filters, project: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                  >
                    <option value="">All Projects</option>
                    {projectOptions.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Task:</label>
                  <select
                    value={filters.task}
                    onChange={(e) => dispatch(setFilters({ ...filters, task: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                  >
                    <option value="">All Tasks</option>
                    {mockTasks.map(task => (
                      <option key={task.id} value={task.id}>{task.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Billable:</label>
                  <select
                    value={filters.billable}
                    onChange={(e) => dispatch(setFilters({ ...filters, billable: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="true">Billable</option>
                    <option value="false">Non-billable</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(setSorting({ sortBy: e.target.value, sortOrder }))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                >
                  <option value="startTime">Date</option>
                  <option value="duration">Duration</option>
                  <option value="project">Project</option>
                  <option value="task">Task</option>
                </select>
                <button
                  onClick={() => dispatch(setSorting({ sortBy, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' }))}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => dispatch(setSorting({ sortBy: 'project', sortOrder: sortBy === 'project' && sortOrder === 'asc' ? 'desc' : 'asc' }))}
                  >
                    Project {sortBy === 'project' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => dispatch(setSorting({ sortBy: 'task', sortOrder: sortBy === 'task' && sortOrder === 'asc' ? 'desc' : 'asc' }))}
                  >
                    Task {sortBy === 'task' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => dispatch(setSorting({ sortBy: 'startTime', sortOrder: sortBy === 'startTime' && sortOrder === 'asc' ? 'desc' : 'asc' }))}
                  >
                    Date {sortBy === 'startTime' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => dispatch(setSorting({ sortBy: 'duration', sortOrder: sortBy === 'duration' && sortOrder === 'asc' ? 'desc' : 'asc' }))}
                  >
                    Duration {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Billable
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {getFilteredAndSortedTimeLogs().map((log, index) => (
                  <tr key={log.id} className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                          log.isBillable ? 'bg-[#0015AA]/20 text-[#0015AA]' : 'bg-[#FBB03B]/20 text-[#FBB03B]'
                        }`}>
                          {log.id}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{log.client?.name || 'No Client'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#0015AA]">{log.taskName || 'No Task'}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(log.startTime).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">{formatDuration(log.durationHours || 0)}</div>
                      <div className="text-xs text-gray-500">hours</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        log.isBillable
                          ? 'bg-[#0015AA]/20 text-[#0015AA]'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {log.billable ? 'Billable' : 'Non-billable'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingLog(log)}
                          className="bg-[#0015AA] text-white p-2 rounded-md hover:bg-[#003366] transition-all duration-200 flex items-center shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          title="Edit Time Log"
                        >
                          <BsPencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTimeLog(log.id)}
                          className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-all duration-200 flex items-center shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          title="Delete Time Log"
                          disabled={saving}
                        >
                          <BsTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {getFilteredAndSortedTimeLogs().length === 0 && timeLogs.length > 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
              <div className="w-20 h-20 bg-[#FBB03B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsClock className="h-10 w-10 text-[#FBB03B]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No matching time logs</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Try adjusting your filters to see more results.</p>
              <button
                onClick={() => dispatch(setFilters({ project: '', task: '', dateFrom: '', dateTo: '', billable: '' }))}
                className="bg-[#FBB03B] text-white px-6 py-3 rounded-lg hover:bg-[#E0A030] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5"
              >
                Clear Filters
              </button>
            </div>
          ) : timeLogs.length === 0 && (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
              <div className="w-20 h-20 bg-[#0015AA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsClock className="h-10 w-10 text-[#0015AA]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No time logs yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Start tracking your work hours to manage your time effectively.</p>
              <button
                onClick={handleStartTimer}
                className="bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:-translate-y-0.5"
              >
                Start Your First Timer
              </button>
            </div>
          )}
        {/* Time Logs Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BsClock className="text-blue-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getFilteredAndSortedTimeLogs().reduce((total, log) => total + (log.durationHours || 0), 0).toFixed(1)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <BsCheckCircle className="text-green-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Billable Hours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getFilteredAndSortedTimeLogs().filter(log => log.isBillable).reduce((total, log) => total + (log.durationHours || 0), 0).toFixed(1)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BsClock className="text-purple-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getFilteredAndSortedTimeLogs()
                    .filter(log => {
                      const logDate = new Date(log.startTime);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return logDate >= weekAgo;
                    })
                    .reduce((total, log) => total + (log.durationHours || 0), 0).toFixed(1)}h
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <BsClock className="text-orange-600" size={20} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Daily</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(getFilteredAndSortedTimeLogs().reduce((total, log) => total + (log.durationHours || 0), 0) / 7).toFixed(1)}h
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Manual Entry Modal */}
        {showManualEntry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Manual Time Entry</h3>
                <button
                  onClick={() => setShowManualEntry(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <BsXCircle size={24} />
                </button>
              </div>

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

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleManualEntry}
                    disabled={saving}
                    className="flex-1 bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  >
                    {saving ? 'Creating...' : 'Create Time Log'}
                  </button>
                  <button
                    onClick={() => setShowManualEntry(false)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Time Log</h3>
                <button
                  onClick={() => setEditingLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <BsXCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Description</label>
                  <textarea
                    value={editingLog.description || ''}
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
                    checked={editingLog.billable}
                    onChange={(e) => setEditingLog({...editingLog, billable: e.target.checked})}
                    className="h-4 w-4 text-[#0015AA] focus:ring-[#0015AA] border-gray-300 rounded"
                  />
                  <label htmlFor="edit-billable" className="ml-2 text-sm font-medium text-gray-700">
                    Billable time
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      // TODO: Implement update functionality
                      toast.info('Edit functionality coming soon!');
                      setEditingLog(null);
                    }}
                    className="flex-1 bg-[#0015AA] text-white px-6 py-3 rounded-lg hover:bg-[#003366] font-semibold transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Update Time Log
                  </button>
                  <button
                    onClick={() => setEditingLog(null)}
                    className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeLogsPage;