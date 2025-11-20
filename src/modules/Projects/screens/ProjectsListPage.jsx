import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import apiService from '../../../services/api';
import { fetchAdminProjects } from '../../../store/slices/adminPortfolioSlice';
import { fetchTasks } from '../../../store/slices/adminPortfolioSlice';
import { useTimer } from '../../../context/TimerContext';
import ActiveTimerComponent from '../components/ActiveTimerComponent';
import WelcomeBanner from '../components/WelcomeBanner';
import FinancialMetricsPanel from '../../../components/FinancialMetricsPanel';
import KanbanBoardLite from '../components/KanbanBoardLite';
import UpcomingDeadlinesWidget from '../../../components/UpcomingDeadlinesWidget';
import RecentActivityFeed from '../../../components/RecentActivityFeed';
import QuickClientProjectEntry from '../../../components/QuickClientProjectEntry';

const ProjectsListPage = () => {
  const { startTimer } = useTimer();
  const [editingTask, setEditingTask] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      return await apiService.getProjects();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }, []);

  const fetchTasksData = useCallback(async () => {
    return await apiService.getTasks();
  }, []);

  const fetchInvoices = useCallback(async () => {
    return await apiService.getInvoices();
  }, []);

  const fetchTimeLogs = useCallback(async () => {
    return await apiService.getTimeLogs();
  }, []);
  const dispatch = useDispatch();

  // Use Redux for admin data
  const {
    projects,
    tasks,
    loading: reduxLoading,
    error: reduxError
  } = useSelector((state) => state.adminPortfolio);

  // Use React Query for additional data
  // const { data: projectsQuery, isLoading: projectsLoading, error: projectsError } = useQuery({
  //   queryKey: ['adminProjects'],
  //   queryFn: fetchProjects,
  //   retry: false
  // });

  const { data: tasksQuery, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasksData
  });

  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices
  });

  const { data: timeLogs } = useQuery({
    queryKey: ['timelogs'],
    queryFn: fetchTimeLogs
  });

  // Use Redux data if available, otherwise fall back to query data
  const displayProjects = projects || [];
  const displayTasks = (tasks?.length > 0) ? tasks : (tasksQuery || []);

  // Initialize Redux data on component mount - only once
  React.useEffect(() => {
    if (!reduxLoading && !reduxError) {
      if (projects?.length === 0 || projects === null) {
        dispatch(fetchAdminProjects());
      }
      if (tasks?.length === 0 || tasks === null) {
        dispatch(fetchTasks());
      }
    }
  }, []); // Empty dependency array to run only once on mount

  if (reduxLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (reduxError) {
    console.error('Projects redux error:', reduxError);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">Error loading projects</div>
          <div className="text-sm text-gray-600">Please check the console for details</div>
        </div>
      </div>
    );
  }

  const upcomingDeadlines = projects?.filter(p => p.endDate)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 5) || [];

  const handleStartTimer = (taskId) => {
    // Find the task to get project id
    const allTasks = displayTasks || [];
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      startTimer(taskId, task.project.id);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await apiService.updateTask(taskId, { status: 'COMPLETED' });
      // Refetch tasks
      dispatch(fetchTasks());
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header & Quick Action Zone */}
        <div className="mb-8 space-y-6">
          <WelcomeBanner />
          <ActiveTimerComponent />
        </div>

        {/* 2. Financial Metrics Panel */}
        <FinancialMetricsPanel />

        {/* 3. Immediate Work Focus - KanbanBoardLite */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-[#0015AA] to-[#003366] p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Today's Focus</h2>
              <Link to="/admin/projects" className="text-sm text-[#FBB03B] hover:text-white transition-colors">
                View All Projects →
              </Link>
            </div>
            <KanbanBoardLite
              projects={displayProjects}
              onStartTimer={handleStartTimer}
              onEditTask={handleEditTask}
              onComplete={handleCompleteTask}
            />
          </div>
        </div>

        {/* 4. Alerts and Planning */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UpcomingDeadlinesWidget projects={displayProjects} />
          <RecentActivityFeed timeLogs={timeLogs} invoices={invoices} />
          <QuickClientProjectEntry />
        </div>
      </div>
    </div>
  );
};

export default ProjectsListPage;