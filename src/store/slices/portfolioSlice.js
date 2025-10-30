import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Task async thunks
export const fetchTasks = createAsyncThunk(
  'portfolio/fetchTasks',
  async (projectId = null) => {
    const response = await apiService.getTasks(projectId);
    return response;
  }
);

export const createTask = createAsyncThunk(
  'portfolio/createTask',
  async (taskData) => {
    const response = await apiService.createTask(taskData);
    return response;
  }
);

export const updateTask = createAsyncThunk(
  'portfolio/updateTask',
  async ({ id, data }) => {
    const response = await apiService.updateTask(id, data);
    return response;
  }
);

export const deleteTask = createAsyncThunk(
  'portfolio/deleteTask',
  async (taskId) => {
    await apiService.deleteTask(taskId);
    return taskId;
  }
);

// Milestone async thunks
export const fetchMilestones = createAsyncThunk(
  'portfolio/fetchMilestones',
  async (projectId = null) => {
    const response = await apiService.getMilestones(projectId);
    return response;
  }
);

export const createMilestone = createAsyncThunk(
  'portfolio/createMilestone',
  async (milestoneData) => {
    const response = await apiService.createMilestone(milestoneData);
    return response;
  }
);

export const updateMilestone = createAsyncThunk(
  'portfolio/updateMilestone',
  async ({ id, data }) => {
    const response = await apiService.updateMilestone(id, data);
    return response;
  }
);

export const deleteMilestone = createAsyncThunk(
  'portfolio/deleteMilestone',
  async (milestoneId) => {
    await apiService.deleteMilestone(milestoneId);
    return milestoneId;
  }
);

// Async thunks for GraphQL calls
export const fetchProjects = createAsyncThunk(
  'portfolio/fetchProjects',
  async (params = {}) => {
    console.log('GraphQL call: Fetching projects with params:', params);
    const response = await apiService.getProjects(params);
    console.log('GraphQL response for projects:', response);
    return response;
  }
);

export const fetchProjectBySlug = createAsyncThunk(
  'portfolio/fetchProjectBySlug',
  async (slug) => {
    const response = await apiService.getProject(slug);
    return response;
  }
);

export const fetchFeaturedProjects = createAsyncThunk(
  'portfolio/fetchFeaturedProjects',
  async () => {
    const response = await apiService.getFeaturedProjects();
    return response;
  }
);

export const fetchDesignProjects = createAsyncThunk(
  'portfolio/fetchDesignProjects',
  async () => {
    const response = await apiService.getDesignProjects();
    return response;
  }
);

export const createProject = createAsyncThunk(
  'portfolio/createProject',
  async (projectData) => {
    const response = await apiService.createProject(projectData);
    return response;
  }
);

export const updateProject = createAsyncThunk(
  'portfolio/updateProject',
  async ({ id, data }) => {
    const response = await apiService.updateProject(id, data);
    return response;
  }
);

export const deleteProject = createAsyncThunk(
  'portfolio/deleteProject',
  async (projectId) => {
    await apiService.deleteProject(projectId);
    return projectId;
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  featuredProjects: [],
  designProjects: [],
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

const portfolioSlice = createSlice({
  name: 'portfolio',
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
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch project by slug
      .addCase(fetchProjectBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.currentProject = null;
      })

      // Fetch featured projects
      .addCase(fetchFeaturedProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProjects = action.payload;
      })
      .addCase(fetchFeaturedProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch design projects
      .addCase(fetchDesignProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesignProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.designProjects = action.payload;
      })
      .addCase(fetchDesignProjects.rejected, (state, action) => {
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

export const { setFilters, clearError, setCurrentProject, setActiveView, setSelectedProject, setDrawerOpen } = portfolioSlice.actions;
export default portfolioSlice.reducer;