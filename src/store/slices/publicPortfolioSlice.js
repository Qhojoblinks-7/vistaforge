import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { sampleCaseStudies, getCaseStudyBySlug } from '../../data/sampleCaseStudies';

// Async thunks for public GraphQL calls
export const fetchPublicProjects = createAsyncThunk(
  'publicPortfolio/fetchProjects',
  async (params = {}, { rejectWithValue }) => {
    console.log('Public GraphQL call: Fetching projects with params:', params);
    try {
      // Use apiService.getPublicProjects for public access
      const result = await apiService.getPublicProjects();
      console.log('Public GraphQL response for projects:', result);
      // Ensure we always return an array
      return Array.isArray(result) ? result : [];
    } catch (error) {
      // Fallback to sample data if GraphQL fails (development)
      console.warn('GraphQL fetch failed, using sample data:', error.message);
      return sampleCaseStudies;
    }
  }
);

export const fetchPublicProjectBySlug = createAsyncThunk(
  'publicPortfolio/fetchProjectBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await apiService.getProject(slug);
      return response;
    } catch (error) {
      // Fallback to sample data
      console.warn('GraphQL fetch failed for slug, using sample data:', error.message);
      const project = getCaseStudyBySlug(slug);
      if (project) return project;
      throw error;
    }
  }
);

export const fetchFeaturedProjects = createAsyncThunk(
  'publicPortfolio/fetchFeaturedProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getFeaturedProjects();
      return response;
    } catch (error) {
      console.warn('GraphQL fetch failed, using sample data:', error.message);
      return sampleCaseStudies.slice(0, 3);
    }
  }
);

export const fetchDesignProjects = createAsyncThunk(
  'publicPortfolio/fetchDesignProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getDesignProjects();
      return response;
    } catch (error) {
      console.warn('GraphQL fetch failed, using sample data:', error.message);
      return sampleCaseStudies.filter(p => p.isDesignProject);
    }
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