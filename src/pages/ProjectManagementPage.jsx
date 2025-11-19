import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsPlus, BsGrid, BsList, BsKanban, BsClock, BsCurrencyDollar, BsCalendar, BsPeople } from 'react-icons/bs';

// Redux imports
import {
  fetchProjects,
  setFilters,
  setSorting,
  setCurrentProject,
  clearCurrentProject,
  syncProjectCreation,
  syncProjectUpdate,
  syncProjectDeletion,
  createProjectWithRelationships,
  updateProjectWithRelationships,
  completeProjectWithRelationships
} from '../modules/Projects/services/projectsSlice';
import { fetchClients } from '../modules/Clients/services/clientsSlice';
import { fetchTimeLogs } from '../store/slices/timeLogsSlice';
import { fetchInvoices } from '../store/slices/invoicesSlice';
import { calculateUnifiedAnalytics } from '../modules/Projects/services/projectsSlice';

// Component imports
import KanbanBoard from '../modules/Projects/components/KanbanBoard';
import ProjectInfoPanel from '../modules/Projects/components/ProjectInfoPanel';
import StatusBadge from '../modules/Projects/components/StatusBadge';
import DeadlineCard from '../modules/Projects/components/DeadlineCard';
import ActiveTimerComponent from '../modules/Projects/components/ActiveTimerComponent';
import FinancialMetricsPanel from '../components/FinancialMetricsPanel';
import RecentActivityFeed from '../components/RecentActivityFeed';
import UpcomingDeadlinesWidget from '../components/UpcomingDeadlinesWidget';
import QuickClientProjectEntry from '../components/QuickClientProjectEntry';

// API service for logout
import apiService from '../services/api';

const ProjectManagementPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State management
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);

  const {
    projects,
    loading,
    error,
    filters,
    sortBy,
    sortOrder,
    currentProject
  } = useSelector((state) => state.projects);

  const { clients } = useSelector((state) => state.clients);

  // Check authentication via token
  const token = localStorage.getItem('adminToken');
  const isAuthenticated = !!token;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  // Initial data fetch with interconnected relationships
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Fetching interconnected data for authenticated user...');
      const loadInitialData = async () => {
        try {
          await Promise.all([
            dispatch(fetchProjects()),
            dispatch(fetchClients()),
            dispatch(fetchTimeLogs()),
            dispatch(fetchInvoices())
          ]);
          // Calculate unified analytics after all data is loaded
          dispatch(calculateUnifiedAnalytics());
        } catch (error) {
          console.error('Failed to load initial interconnected data:', error);
        }
      };

      loadInitialData();
    }
  }, [dispatch, isAuthenticated]);

  // Event handlers
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setActiveView('project-detail');
  };

  const handleCreateProject = () => {
    setShowProjectModal(true);
  };

  const handleProjectCreated = async (projectData) => {
    try {
      // Use backend-integrated action that leverages automatic model relationships
      await dispatch(createProjectWithRelationships(projectData)).unwrap();

      // Backend automatically handles:
      // - Client project count updates
      // - Financial total calculations
      // - Project progress initialization

      // Frontend sync is handled by the action itself
      setShowProjectModal(false);
    } catch (error) {
      console.error('Failed to create project with backend relationships:', error);
    }
  };

  const handleCreateClient = () => {
    setShowClientModal(true);
  };

  const handleCloseModals = () => {
    setShowProjectModal(false);
    setShowClientModal(false);
  };

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
  const totalBudget = projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0);

  // Mock data for components that need it
  const mockTimeLogs = [];
  const mockInvoices = [];
  const mockUnbilledAmount = 0;
  const mockTotalRevenue = totalBudget;
  const mockOverdueInvoices = 0;

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

  // Render projects list
  const renderProjectsList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0015AA]"></div>
          <span className="ml-3 text-gray-600">Loading projects...</span>
        </div>
      );
    }

    if (error) {
      return (
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
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleProjectSelect(project)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#0015AA] mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600">{project.client?.name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                project.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>

            {project.description && (
              <p className="text-sm text-gray-700 mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Budget: ${project.budget}</span>
              {project.endDate && (
                <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#0015AA]">Project Manager</h1>
              <ActiveTimerComponent />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateClient}
                className="px-4 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors flex items-center"
              >
                <BsPeople className="mr-2" />
                Add Client
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-[#FBB03B] text-[#0015AA] rounded-lg hover:bg-[#E0A030] transition-colors flex items-center font-semibold"
              >
                <BsPlus className="mr-2" />
                New Project
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Switcher */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewChange('dashboard')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  activeView === 'dashboard' ? 'bg-white shadow-sm text-[#0015AA]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BsGrid className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => handleViewChange('kanban')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  activeView === 'kanban' ? 'bg-white shadow-sm text-[#0015AA]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BsKanban className="mr-2" />
                Kanban
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`px-4 py-2 rounded-md transition-colors flex items-center ${
                  activeView === 'list' ? 'bg-white shadow-sm text-[#0015AA]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BsList className="mr-2" />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Financial Metrics */}
            <FinancialMetricsPanel
              unbilledAmount={mockUnbilledAmount}
              totalRevenue={mockTotalRevenue}
              overdueInvoices={mockOverdueInvoices}
            />

            {/* Project Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-[#0015AA]">{totalProjects}</p>
                  </div>
                  <BsGrid className="h-8 w-8 text-[#0015AA]" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-blue-600">{activeProjects}</p>
                  </div>
                  <BsClock className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{completedProjects}</p>
                  </div>
                  <BsKanban className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-[#FBB03B]">${totalBudget.toFixed(2)}</p>
                  </div>
                  <BsCurrencyDollar className="h-8 w-8 text-[#FBB03B]" />
                </div>
              </div>
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <RecentActivityFeed timeLogs={mockTimeLogs} invoices={mockInvoices} />
              </div>

              {/* Upcoming Deadlines */}
              <div>
                <UpcomingDeadlinesWidget projects={projects} />
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#0015AA] mb-6">All Projects</h2>
              {renderProjectsList()}
            </div>
          </div>
        )}

        {activeView === 'kanban' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-[#0015AA] mb-6">Project Kanban Board</h2>
            <KanbanBoard projects={projects} tasks={[]} />
          </div>
        )}

        {activeView === 'list' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-[#0015AA] mb-6">Projects List View</h2>
            {renderProjectsList()}
          </div>
        )}

        {activeView === 'project-detail' && selectedProject && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <ProjectInfoPanel
                  project={selectedProject}
                  client={clients.find(c => c.id === selectedProject.client?.id)}
                  timeLogs={mockTimeLogs}
                />
              </div>
              <div className="space-y-6">
                <DeadlineCard project={selectedProject} />
                <StatusBadge status={selectedProject.status} />
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showProjectModal && (
          <QuickClientProjectEntry
            onClose={handleCloseModals}
            clients={clients}
            onSuccess={(projectData) => {
              handleProjectCreated(projectData);
            }}
          />
        )}

        {showClientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#0015AA] mb-4">Add New Client</h2>
                <p className="text-gray-600 mb-6">Client creation form would go here.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModals}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCloseModals}
                    className="px-4 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366]"
                  >
                    Create Client
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

export default ProjectManagementPage;