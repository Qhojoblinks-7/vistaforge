import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cross-slice action imports for interconnected data flow
import { fetchClients } from '../../Clients/services/clientsSlice';
import { fetchTimeLogs } from '../../../store/slices/timeLogsSlice';
import { fetchInvoices } from '../../../store/slices/invoicesSlice';
import { fetchInquiries } from '../../../store/slices/inquiriesSlice';

// Backend-integrated actions that leverage automatic model relationships
export const createProjectWithRelationships = (projectData) => async (dispatch, getState) => {
  try {
    // Create project - backend will automatically handle client relationships
    const result = await dispatch(createProject(projectData)).unwrap();

    // Backend automatically updates:
    // - Client's project count via Client.total_projects property
    // - Client's financial totals via Client.update_financial_totals()
    // - Project progress via Project.update_progress_from_tasks()

    // Sync frontend state with backend changes
    await dispatch(syncProjectCreation(result));

    return result;
  } catch (error) {
    console.error('Failed to create project with relationships:', error);
    throw error;
  }
};

export const updateProjectWithRelationships = (projectId, updateData) => async (dispatch, getState) => {
  try {
    // Update project - backend handles all relationship updates
    const result = await dispatch(updateProject({ id: projectId, data: updateData })).unwrap();

    // Backend automatically updates:
    // - Client revenue if project status changes to COMPLETED
    // - Project progress from task completion
    // - Financial calculations

    // Sync frontend state
    await dispatch(syncProjectUpdate(result));

    return result;
  } catch (error) {
    console.error('Failed to update project with relationships:', error);
    throw error;
  }
};

export const completeProjectWithRelationships = (projectId) => async (dispatch, getState) => {
  try {
    // Mark project as completed - backend handles revenue updates
    const result = await dispatch(updateProject({
      id: projectId,
      data: { status: 'COMPLETED' }
    })).unwrap();

    // Backend automatically:
    // - Updates client total_revenue from paid invoices
    // - Triggers Client.update_financial_totals()
    // - Updates project completion status

    // Sync frontend state
    await dispatch(syncProjectUpdate(result));

    return result;
  } catch (error) {
    console.error('Failed to complete project with relationships:', error);
    throw error;
  }
};

// Cross-slice action creators for interconnected data flow
export const syncProjectCreation = (project) => async (dispatch, getState) => {
  // When a project is created, refresh related data across all modules
  try {
    await Promise.all([
      dispatch(fetchClients()), // Refresh clients to show updated project counts
      dispatch(fetchTimeLogs()), // Refresh time logs for new project context
      dispatch(fetchInvoices()), // Refresh invoices for new project context
      dispatch(fetchInquiries()) // Refresh inquiries for potential project conversion
    ]);
  } catch (error) {
    console.error('Failed to sync project creation:', error);
  }
};

export const syncProjectUpdate = (project) => async (dispatch, getState) => {
  // When a project is updated, refresh related data across all modules
  try {
    await Promise.all([
      dispatch(fetchClients()), // Refresh clients for updated project relationships
      dispatch(fetchTimeLogs()), // Refresh time logs for updated project data
      dispatch(fetchInvoices()), // Refresh invoices for updated project data
      dispatch(fetchInquiries()) // Refresh inquiries for updated project status
    ]);
  } catch (error) {
    console.error('Failed to sync project update:', error);
  }
};

export const syncProjectDeletion = (projectId) => async (dispatch, getState) => {
  // When a project is deleted, refresh all related data across all modules
  try {
    await Promise.all([
      dispatch(fetchClients()), // Refresh clients to remove project references
      dispatch(fetchTimeLogs()), // Refresh time logs to remove project references
      dispatch(fetchInvoices()), // Refresh invoices to remove project references
      dispatch(fetchInquiries()) // Refresh inquiries to update conversion status
    ]);
  } catch (error) {
    console.error('Failed to sync project deletion:', error);
  }
};

// Unified analytics calculation action
export const calculateUnifiedAnalytics = () => async (dispatch, getState) => {
  const state = getState();

  // Calculate cross-module analytics
  const projects = state.projects.projects || [];
  const clients = state.clients.clients || [];
  const timeLogs = state.timeLogs?.timeLogs || [];
  const invoices = state.invoices?.invoices || [];

  const analytics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'IN_PROGRESS').length,
    completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
    totalClients: clients.length,
    totalBudget: projects.reduce((sum, p) => sum + parseFloat(p.budget || 0), 0),
    totalRevenue: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + parseFloat(i.amount || 0), 0),
    unbilledHours: timeLogs.filter(t => !t.is_billed).reduce((sum, t) => sum + parseFloat(t.duration_hours || 0), 0),
    overdueInvoices: invoices.filter(i => i.status === 'OVERDUE').length,
    totalTimeLogged: timeLogs.reduce((sum, t) => sum + parseFloat(t.duration_hours || 0), 0)
  };

  // Update analytics in all relevant slices
  dispatch({ type: 'projects/setAnalytics', payload: analytics });
  dispatch({ type: 'clients/setAnalytics', payload: analytics });
  dispatch({ type: 'timeLogs/setAnalytics', payload: analytics });
  dispatch({ type: 'invoices/setAnalytics', payload: analytics });
};

// Async thunks for project operations
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}) => {
    const query = `
      query GetProjects {
        allProjects {
          id
          title
          description
          client {
            id
            name
            company
          }
          status
          budget
          startDate
          endDate
          isActive
          createdAt
          updatedAt
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, {});
    return result.allProjects || [];
  }
);

export const fetchProject = createAsyncThunk(
  'projects/fetchProject',
  async (projectId) => {
    const query = `
      query GetProject($id: ID!) {
        project(id: $id) {
          id
          title
          description
          client {
            id
            name
            company
          }
          status
          projectPhase
          budget
          hourlyRate
          startDate
          endDate
          estimatedHours
          designTools
          technologies
          priority
          progressPercentage
          isActive
          totalLoggedHours
          totalCost
          remainingHours
          isOverBudget
          daysUntilDeadline
          createdAt
          updatedAt
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, { id: projectId });
    return result.project;
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData) => {
    const mutation = `
      mutation CreateProject($input: ProjectInput!) {
        createProject(input: $input) {
          project {
            id
            title
            description
            client {
              id
              name
              company
            }
            status
            projectPhase
            budget
            hourlyRate
            startDate
            endDate
            estimatedHours
            designTools
            technologies
            priority
            progressPercentage
            isActive
            totalLoggedHours
            totalCost
            remainingHours
            isOverBudget
            daysUntilDeadline
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { input: projectData });
    return result.createProject.project;
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }) => {
    const mutation = `
      mutation UpdateProject($id: ID!, $input: ProjectInput!) {
        updateProject(id: $id, input: $input) {
          project {
            id
            title
            description
            client {
              id
              name
              company
            }
            status
            projectPhase
            budget
            hourlyRate
            startDate
            endDate
            estimatedHours
            designTools
            technologies
            priority
            progressPercentage
            isActive
            totalLoggedHours
            totalCost
            remainingHours
            isOverBudget
            daysUntilDeadline
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { id, input: data });
    return result.updateProject.project;
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId) => {
    const mutation = `
      mutation DeleteProject($id: ID!) {
        deleteProject(id: $id) {
          success
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    await apiService.request(mutation, { id: projectId });
    return projectId;
  }
);

// Project milestones
export const fetchProjectMilestones = createAsyncThunk(
  'projects/fetchProjectMilestones',
  async (projectId) => {
    const query = `
      query GetProjectMilestones($projectId: ID!) {
        projectMilestones(projectId: $projectId) {
          id
          title
          description
          dueDate
          status
          order
          isCompleted
          createdAt
          updatedAt
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, { projectId });
    return result.projectMilestones || [];
  }
);

export const createProjectMilestone = createAsyncThunk(
  'projects/createProjectMilestone',
  async ({ projectId, milestoneData }) => {
    const mutation = `
      mutation CreateProjectMilestone($projectId: ID!, $input: ProjectMilestoneInput!) {
        createProjectMilestone(projectId: $projectId, input: $input) {
          milestone {
            id
            title
            description
            dueDate
            status
            order
            isCompleted
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { projectId, input: milestoneData });
    return result.createProjectMilestone.milestone;
  }
);

// Project tasks
export const fetchProjectTasks = createAsyncThunk(
  'projects/fetchProjectTasks',
  async (projectId) => {
    const query = `
      query GetProjectTasks($projectId: ID!) {
        projectTasks(projectId: $projectId) {
          id
          title
          description
          status
          priority
          assignedTo
          estimatedHours
          order
          createdAt
          updatedAt
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, { projectId });
    return result.projectTasks || [];
  }
);

export const createProjectTask = createAsyncThunk(
  'projects/createProjectTask',
  async ({ projectId, taskData }) => {
    const mutation = `
      mutation CreateProjectTask($projectId: ID!, $input: ProjectTaskInput!) {
        createProjectTask(projectId: $projectId, input: $input) {
          task {
            id
            title
            description
            status
            priority
            assignedTo
            estimatedHours
            order
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { projectId, input: taskData });
    return result.createProjectTask.task;
  }
);

// Project notes
export const fetchProjectNotes = createAsyncThunk(
  'projects/fetchProjectNotes',
  async (projectId) => {
    const query = `
      query GetProjectNotes($projectId: ID!) {
        projectNotes(projectId: $projectId) {
          id
          noteType
          title
          content
          isInternal
          createdAt
          updatedAt
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query, { projectId });
    return result.projectNotes || [];
  }
);

export const createProjectNote = createAsyncThunk(
  'projects/createProjectNote',
  async ({ projectId, noteData }) => {
    const mutation = `
      mutation CreateProjectNote($projectId: ID!, $input: ProjectNoteInput!) {
        createProjectNote(projectId: $projectId, input: $input) {
          note {
            id
            noteType
            title
            content
            isInternal
            createdAt
            updatedAt
          }
        }
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(mutation, { projectId, input: noteData });
    return result.createProjectNote.note;
  }
);

// Project analytics
export const fetchProjectAnalytics = createAsyncThunk(
  'projects/fetchProjectAnalytics',
  async () => {
    const query = `
      query GetProjectAnalytics {
        projectAnalytics
      }
    `;

    const apiService = (await import('../../../services/api')).default;
    const result = await apiService.request(query);
    return result.projectAnalytics || {};
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  projectMilestones: [],
  projectTasks: [],
  projectNotes: [],
  projectFiles: [],
  loading: false,
  saving: false,
  error: null,
  filters: {
    status: '',
    clientId: '',
    phase: '',
    priority: '',
    isActive: true,
  },
  sortBy: 'createdAt',
  sortOrder: 'desc',
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  },
  analytics: {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalBudget: 0,
    totalValue: 0,
  }
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSorting: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload || [];
        state.pagination.total = action.payload?.length || 0;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.pageSize);
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch single project
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.saving = false;
        state.projects.unshift(action.payload);
        state.analytics.totalProjects += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.saving = false;
        state.projects = state.projects.filter(project => project.id !== action.payload);
        state.analytics.totalProjects -= 1;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })

      // Project milestones
      .addCase(fetchProjectMilestones.fulfilled, (state, action) => {
        state.projectMilestones = action.payload;
      })
      .addCase(createProjectMilestone.fulfilled, (state, action) => {
        state.projectMilestones.push(action.payload);
      })

      // Project tasks
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.projectTasks = action.payload;
      })
      .addCase(createProjectTask.fulfilled, (state, action) => {
        state.projectTasks.push(action.payload);
      })

      // Project notes
      .addCase(fetchProjectNotes.fulfilled, (state, action) => {
        state.projectNotes = action.payload;
      })
      .addCase(createProjectNote.fulfilled, (state, action) => {
        state.projectNotes.push(action.payload);
      })

      // Project analytics
      .addCase(fetchProjectAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload || initialState.analytics;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setSorting,
  clearError,
  setPagination,
  setCurrentProject,
  clearCurrentProject,
} = projectsSlice.actions;

export default projectsSlice.reducer;