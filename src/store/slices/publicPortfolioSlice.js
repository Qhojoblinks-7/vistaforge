import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Async thunks for public GraphQL calls
export const fetchPublicProjects = createAsyncThunk(
  'publicPortfolio/fetchProjects',
  async (params = {}) => {
    console.log('Public GraphQL call: Fetching projects with params:', params);
    // Use apiService.getPublicProjects for public access
    const result = await apiService.getPublicProjects();
    console.log('Public GraphQL response for projects:', result);
    // Ensure we always return an array
    return Array.isArray(result) ? result : [];
  }
);

export const fetchPublicProjectBySlug = createAsyncThunk(
  'publicPortfolio/fetchProjectBySlug',
  async (slug) => {
    const response = await apiService.getProject(slug);
    return response;
  }
);

export const fetchFeaturedProjects = createAsyncThunk(
  'publicPortfolio/fetchFeaturedProjects',
  async () => {
    const response = await apiService.getFeaturedProjects();
    return response;
  }
);

export const fetchDesignProjects = createAsyncThunk(
  'publicPortfolio/fetchDesignProjects',
  async () => {
    const response = await apiService.getDesignProjects();
    return response;
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  featuredProjects: [],
  designProjects: [],
  loading: false,
  error: null,
  filters: {
    type: '',
    industry: '',
    design: false,
  },
};

const publicPortfolioSlice = createSlice({
  name: 'publicPortfolio',
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch public projects
      .addCase(fetchPublicProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchPublicProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch project by slug
      .addCase(fetchPublicProjectBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProjectBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchPublicProjectBySlug.rejected, (state, action) => {
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
      });
  },
});

export const { setFilters, clearError, setCurrentProject } = publicPortfolioSlice.actions;
export default publicPortfolioSlice.reducer;