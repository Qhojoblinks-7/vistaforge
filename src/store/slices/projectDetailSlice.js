import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for project detail operations
export const fetchProjectDetail = createAsyncThunk(
  'projectDetail/fetchProject',
  async (projectId) => {
    const apiService = (await import('../../services/api')).default;
    const result = await apiService.request(`
      query GetProject($id: ID!) {
        project(id: $id) {
          id
          title
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
          client {
            id
            name
            company
            contactEmail
          }
        }
      }
    `, { id: projectId });
    return result.project;
  }
);

export const updateProjectDetail = createAsyncThunk(
  'projectDetail/updateProject',
  async ({ id, data }) => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.updateProject(id, data);
  }
);

export const createProjectTask = createAsyncThunk(
  'projectDetail/createTask',
  async ({ projectId, taskData }) => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.createTask({ ...taskData, projectId });
  }
);

export const updateProjectTask = createAsyncThunk(
  'projectDetail/updateTask',
  async ({ taskId, data }) => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.updateTask(taskId, data);
  }
);

export const deleteProjectTask = createAsyncThunk(
  'projectDetail/deleteTask',
  async (taskId) => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.deleteTask(taskId);
  }
);

const initialState = {
  project: null,
  tasks: [],
  timeLogs: [],
  loading: false,
  error: null,
};

const projectDetailSlice = createSlice({
  name: 'projectDetail',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProject: (state) => {
      state.project = null;
      state.tasks = [];
      state.timeLogs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch project
      .addCase(fetchProjectDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(fetchProjectDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update project
      .addCase(updateProjectDetail.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProjectDetail.fulfilled, (state, action) => {
        state.project = action.payload;
      })
      .addCase(updateProjectDetail.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Create task
      .addCase(createProjectTask.pending, (state) => {
        state.error = null;
      })
      .addCase(createProjectTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(createProjectTask.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Update task
      .addCase(updateProjectTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProjectTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateProjectTask.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete task
      .addCase(deleteProjectTask.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProjectTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.meta.arg);
      })
      .addCase(deleteProjectTask.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearError, clearProject } = projectDetailSlice.actions;

// Selectors
export const selectProjectDetail = (state) => state.projectDetail.project;
export const selectProjectTasks = (state) => state.projectDetail.tasks;
export const selectProjectTimeLogs = (state) => state.projectDetail.timeLogs;
export const selectProjectDetailLoading = (state) => state.projectDetail.loading;
export const selectProjectDetailError = (state) => state.projectDetail.error;

export default projectDetailSlice.reducer;