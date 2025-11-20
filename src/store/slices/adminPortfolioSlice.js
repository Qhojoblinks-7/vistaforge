import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Task async thunks
export const fetchTasks = createAsyncThunk(
  'adminPortfolio/fetchTasks',
  async (projectId = null) => {
    const response = await apiService.getTasks(projectId);
    return response;
  }
);

export const createTask = createAsyncThunk(
  'adminPortfolio/createTask',
  async (taskData) => {
    const response = await apiService.createTask(taskData);
    return response;
  }
);

export const updateTask = createAsyncThunk(
  'adminPortfolio/updateTask',
  async ({ id, data }) => {
    const response = await apiService.updateTask(id, data);
    return response;
  }
);

export const deleteTask = createAsyncThunk(
  'adminPortfolio/deleteTask',
  async (taskId) => {
    await apiService.deleteTask(taskId);
    return taskId;
  }
);

// Milestone async thunks
export const fetchMilestones = createAsyncThunk(
  'adminPortfolio/fetchMilestones',
  async (projectId = null) => {
    console.log('Admin Portfolio Slice: Fetching milestones with projectId:', projectId);
    const response = await apiService.getMilestones(projectId);
    console.log('Admin Portfolio Slice: Milestones response:', response);
    return response;
  }
);

export const createMilestone = createAsyncThunk(
  'adminPortfolio/createMilestone',
  async (milestoneData) => {
    const response = await apiService.createMilestone(milestoneData);
    return response;
  }
);

export const updateMilestone = createAsyncThunk(
  'adminPortfolio/updateMilestone',
  async ({ id, data }) => {
    const response = await apiService.updateMilestone(id, data);
    return response;
  }
);

export const deleteMilestone = createAsyncThunk(
  'adminPortfolio/deleteMilestone',
  async (milestoneId) => {
    await apiService.deleteMilestone(milestoneId);
    return milestoneId;
  }
);

// Admin-only project async thunks
export const fetchAdminProjects = createAsyncThunk(
  'adminPortfolio/fetchProjects',
  async (params = {}) => {
    console.log('Admin GraphQL call: Fetching projects with params:', params);

    const token = localStorage.getItem('adminToken');
    console.log('Admin Portfolio Slice - Token present:', !!token);
    console.log('Admin Portfolio Slice - Token value:', token ? token.substring(0, 20) + '...' : 'null');

    if (!token) {
      console.error('Admin Portfolio Slice - No authentication token found');
      throw new Error('Authentication required for admin operations');
    }

    // For admin access, directly use the admin query
    const query = `
      query GetAllManagementProjects {
        allManagementProjects {
          id
          title
          name
          slug
          intro
          description
          status
          projectPhase
          budget
          startDate
          endDate
          isActive
          designTools
          createdAt
          updatedAt
        }
      }
    `;

    console.log('Admin Portfolio Slice - Making request with query:', query.substring(0, 50) + '...');

    const result = await apiService.request(query);
    console.log('Admin GraphQL response for projects:', result);
    return result.allManagementProjects;
  }
);

export const createProject = createAsyncThunk(
  'adminPortfolio/createProject',
  async (projectData) => {
    const response = await apiService.createProject(projectData);
    return response;
  }
);

export const updateProject = createAsyncThunk(
  'adminPortfolio/updateProject',
  async ({ id, data }) => {
    const response = await apiService.updateProject(id, data);
    return response;
  }
);

export const deleteProject = createAsyncThunk(
  'adminPortfolio/deleteProject',
  async (projectId) => {
    await apiService.deleteProject(projectId);
    return projectId;
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  tasks: [],
  milestones: [],
  loading: false,
  error: null,
  filters: {
    type: '',
    industry: '',
    design: false,
  },
  activeView: 'list', // 'list', 'board', 'tasks'
  selectedProject: null,
  isDrawerOpen: false,
};

const adminPortfolioSlice = createSlice({
  name: 'adminPortfolio',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch admin projects
      .addCase(fetchAdminProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchAdminProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearError, setCurrentProject, setActiveView, setSelectedProject, setDrawerOpen } = adminPortfolioSlice.actions;
export default adminPortfolioSlice.reducer;