import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsPlus } from 'react-icons/bs';
import {
  fetchProjects,
  fetchTasks,
  fetchMilestones,
  setActiveView,
  setSelectedProject,
  setDrawerOpen
} from '../store/slices/portfolioSlice';
// Import API service for logout
import apiService from '../services/api';

// Import view components (to be created)
import ListView from '../components/views/ListView';
import BoardView from '../components/views/BoardView';
import TaskView from '../components/views/TaskView';
import ViewSwitcher from '../components/ViewSwitcher';
import ProjectDetailDrawer from '../components/ProjectDetailDrawer';

const ProjectManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    projects,
    tasks,
    milestones,
    loading,
    error,
    activeView,
    selectedProject,
    isDrawerOpen
  } = useSelector((state) => state.portfolio);

  // Check authentication via token
  const token = localStorage.getItem('adminToken');
  const isAuthenticated = !!token;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Fetching data for authenticated user...');
      dispatch(fetchProjects());
      dispatch(fetchTasks());
      dispatch(fetchMilestones());
    }
  }, [dispatch, isAuthenticated]);

  // Handle view switching
  const handleViewChange = (view) => {
    dispatch(setActiveView(view));
  };

  // Handle project selection for drawer
  const handleProjectSelect = (project) => {
    dispatch(setSelectedProject(project));
    dispatch(setDrawerOpen(true));
  };

  // Handle drawer close
  const handleDrawerClose = () => {
    dispatch(setDrawerOpen(false));
    dispatch(setSelectedProject(null));
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await apiService.logout();
      localStorage.removeItem('adminToken');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate even if logout fails
      navigate('/');
    }
  };

  // Render active view component
  const renderActiveView = () => {
    const viewProps = {
      projects,
      tasks,
      milestones,
      onProjectSelect: handleProjectSelect,
      loading,
      error
    };

    switch (activeView) {
      case 'board':
        return <BoardView {...viewProps} />;
      case 'tasks':
        return <TaskView {...viewProps} />;
      case 'list':
      default:
        return <ListView {...viewProps} />;
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isDrawerOpen ? 'overflow-hidden' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0015AA]">Project Management</h1>
            <button
              onClick={handleLogout}
              className="sm:hidden px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Welcome back, Blinks!
            </span>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <ViewSwitcher activeView={activeView} onViewChange={handleViewChange} />
              <button
                onClick={() => {
                  dispatch(setSelectedProject(null)); // Reset selected project for creation
                  dispatch(setDrawerOpen(true));
                }}
                className="flex items-center justify-center px-4 py-2 bg-[#FBB03B] text-[#0015AA] font-medium rounded-lg hover:bg-[#E0A030] transition-colors"
              >
                <BsPlus className="mr-2" />
                {activeView === 'task' ? 'Add Task' : 'Add Project'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${isDrawerOpen ? 'lg:mr-96' : ''} ${isDrawerOpen ? 'overflow-hidden' : ''}`}>
        <div className="p-6">
          <div className={`max-w-7xl mx-auto ${isDrawerOpen ? 'lg:max-w-5xl' : ''}`}>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
                <span className="ml-3 text-gray-600">Loading projects...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error loading projects</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && renderActiveView()}
          </div>
        </div>
      </main>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleDrawerClose}
        />
      )}

      {/* Project Detail Drawer */}
      {isDrawerOpen && (
        <ProjectDetailDrawer
          project={selectedProject}
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          tasks={tasks.filter(task => task.project === selectedProject?.id)}
          milestones={milestones.filter(milestone => milestone.project === selectedProject?.id)}
        />
      )}
    </div>
  );
};

export default ProjectManagementPage;