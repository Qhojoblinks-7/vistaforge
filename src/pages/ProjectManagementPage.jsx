import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BsPlus, BsGrid, BsList, BsKanban, BsClock, BsCurrencyDollar, BsCalendar, BsPeople, BsX } from 'react-icons/bs';
import { toast } from 'react-toastify';

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
import ProjectDetailView from '../modules/Projects/screens/ProjectDetailView';

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
  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    contactEmail: '',
    phone: '',
    address: '',
    notes: ''
  });

  const projectsState = useSelector((state) => state.projects);
  const projectsArray = Array.isArray(projectsState) ? projectsState : projectsState.projects || [];
  const loading = projectsState.loading || false;
  const error = projectsState.error || null;
  const filters = projectsState.filters || {};
  const sortBy = projectsState.sortBy || 'createdAt';
  const sortOrder = projectsState.sortOrder || 'desc';
  const currentProject = projectsState.currentProject || null;

  const { clients } = useSelector((state) => state.clients);

  // Fetch time logs and invoices with React Query
  const { data: timeLogs = [] } = useQuery({
    queryKey: ['timelogs'],
    queryFn: () => apiService.getTimeLogs()
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => apiService.getInvoices()
  });

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
    dispatch(setCurrentProject(project));
    setActiveView('project-detail');
  };

  const handleCreateProject = () => {
    setShowProjectModal(true);
  };

  const handleProjectCreated = async (projectData) => {
    try {
      // Use backend-integrated action that leverages automatic model relationships
      const newProject = await dispatch(createProjectWithRelationships(projectData)).unwrap();

      // Sync the creation in Redux state
      dispatch(syncProjectCreation(newProject));

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


  const handleCloseModals = () => {
    setShowProjectModal(false);
    setShowClientModal(false);
  };

  const handleClientFormChange = (field, value) => {
    setClientForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateClient = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createClient(clientForm)).unwrap();
      toast.success('Client created successfully');
      setShowClientModal(false);
      // Clear the form
      setClientForm({
        name: '',
        company: '',
        contactEmail: '',
        phone: '',
        address: '',
        notes: ''
      });
      // Refresh the client list
      dispatch(fetchClients());
    } catch (error) {
      toast.error('Failed to create client: ' + error.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    dispatch(setSorting({ sortBy, sortOrder }));
  };

  const handleProjectUpdate = async (projectId, projectData) => {
    try {
      await dispatch(updateProjectWithRelationships({ id: projectId, data: projectData })).unwrap();
      dispatch(syncProjectUpdate(projectData));
    } catch (error) {
      console.error('Failed to update project:', error);
    }
  };

  const handleProjectComplete = async (projectId) => {
    try {
      await dispatch(completeProjectWithRelationships(projectId)).unwrap();
      dispatch(syncProjectUpdate({ id: projectId, status: 'COMPLETED' }));
    } catch (error) {
      console.error('Failed to complete project:', error);
    }
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await dispatch(syncProjectDeletion(projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  // Calculate metrics
  const totalProjects = projectsArray.length;
  const activeProjects = projectsArray.filter(p => p.status === 'IN_PROGRESS').length;
  const completedProjects = projectsArray.filter(p => p.status === 'COMPLETED').length;
  const totalBudget = projectsArray.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0);

  // Calculate real metrics from fetched data
  const unbilledAmount = timeLogs?.filter(log => log.isBillable)
    .reduce((sum, log) => sum + parseFloat(log.durationMinutes || 0) / 60 * parseFloat(log.hourlyRate || 0), 0) || 0;

  const totalRevenue = invoices?.filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + parseFloat(inv.total || 0), 0) || 0;

  const overdueInvoices = invoices?.filter(inv =>
    inv.status === 'SENT' && new Date(inv.dueDate) < new Date()
  ).length || 0;

  const upcomingDeadlines = projectsArray?.filter(p => p.endDate)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 5) || [];

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
        {projectsArray.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleProjectSelect(project)}
          >
            <div className="flex flex-col sm:flex-row items-start justify-between mb-4 space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#0015AA] mb-1 truncate">{project.title}</h3>
                <p className="text-sm text-gray-600 truncate">{project.client?.name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 mb-4 space-y-1 sm:space-y-0">
              <span className="font-medium">Budget: ${project.budget}</span>
              {project.endDate && (
                <span className="text-xs sm:text-sm">Due: {new Date(project.endDate).toLocaleDateString()}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {project.status !== 'COMPLETED' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectComplete(project.id);
                    }}
                    className="px-3 py-2 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors min-h-[36px] font-medium"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Could open edit modal here
                    console.log('Edit project:', project.id);
                  }}
                  className="px-3 py-2 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors min-h-[36px] font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      handleProjectDelete(project.id);
                    }
                  }}
                  className="px-3 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors min-h-[36px] font-medium"
                >
                  Delete
                </button>
              </div>
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowClientModal(true)}
                className="px-4 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors flex items-center justify-center min-h-[44px]"
              >
                <BsPeople className="mr-2" />
                Add Client
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-[#FBB03B] text-[#0015AA] rounded-lg hover:bg-[#E0A030] transition-colors flex items-center justify-center font-semibold min-h-[44px]"
              >
                <BsPlus className="mr-2" />
                New Project
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors min-h-[44px]"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center space-x-1 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => handleViewChange('dashboard')}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center text-sm font-medium min-h-[44px] ${
                  activeView === 'dashboard' ? 'bg-white shadow-sm text-[#0015AA]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BsGrid className="mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => handleViewChange('kanban')}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center text-sm font-medium min-h-[44px] ${
                  activeView === 'kanban' ? 'bg-white shadow-sm text-[#0015AA]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BsKanban className="mr-2" />
                Kanban
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`px-3 sm:px-4 py-2 rounded-md transition-colors flex items-center text-sm font-medium min-h-[44px] ${
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
              unbilledAmount={unbilledAmount}
              totalRevenue={totalRevenue}
              overdueInvoices={overdueInvoices}
            />

            {/* Project Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <RecentActivityFeed timeLogs={timeLogs} invoices={invoices} />
              </div>

              {/* Upcoming Deadlines */}
              <div>
                <UpcomingDeadlinesWidget projects={projectsArray} />
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-bold text-[#0015AA]">All Projects</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  {/* Filter Controls */}
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm min-h-[40px]"
                  >
                    <option value="">All Status</option>
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  {/* Sort Controls */}
                  <select
                    value={`${sortBy}_${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('_');
                      handleSortChange(newSortBy, newSortOrder);
                    }}
                    className="px-3 py-2 border rounded-lg text-sm min-h-[40px]"
                  >
                    <option value="createdAt_desc">Newest First</option>
                    <option value="createdAt_asc">Oldest First</option>
                    <option value="title_asc">Name A-Z</option>
                    <option value="title_desc">Name Z-A</option>
                    <option value="budget_desc">Highest Budget</option>
                    <option value="budget_asc">Lowest Budget</option>
                  </select>
                </div>
              </div>
              {renderProjectsList()}
            </div>
          </div>
        )}

        {activeView === 'kanban' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-[#0015AA] mb-6">Project Kanban Board</h2>
            <KanbanBoard projects={projectsArray} tasks={[]} />
          </div>
        )}

        {activeView === 'list' && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-[#0015AA] mb-6">Projects List View</h2>
            {renderProjectsList()}
          </div>
        )}

        {activeView === 'project-detail' && selectedProject && (
          <ProjectDetailView
            projectId={selectedProject.id}
            onBack={() => {
              dispatch(clearCurrentProject());
              setSelectedProject(null);
              setActiveView('dashboard');
            }}
          />
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-[#0015AA]">Add New Client</h2>
                <button
                  onClick={() => {
                    setShowClientModal(false);
                    setClientForm({
                      name: '',
                      company: '',
                      contactEmail: '',
                      phone: '',
                      address: '',
                      notes: ''
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <BsX className="text-gray-500" size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.name}
                      onChange={(e) => handleClientFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter client name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      value={clientForm.company}
                      onChange={(e) => handleClientFormChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={clientForm.contactEmail}
                      onChange={(e) => handleClientFormChange('contactEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={clientForm.phone}
                      onChange={(e) => handleClientFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={clientForm.address}
                      onChange={(e) => handleClientFormChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={clientForm.notes}
                      onChange={(e) => handleClientFormChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0015AA] focus:border-transparent"
                      placeholder="Enter notes about the client"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowClientModal(false);
                      setClientForm({
                        name: '',
                        company: '',
                        contactEmail: '',
                        phone: '',
                        address: '',
                        notes: ''
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#0015AA] text-white rounded-lg hover:bg-[#003366] transition-colors font-semibold"
                  >
                    Create Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagementPage;