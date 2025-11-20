import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for kanban operations
export const fetchKanbanTasks = createAsyncThunk(
  'kanban/fetchTasks',
  async () => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.getTasks();
  }
);

export const updateKanbanTask = createAsyncThunk(
  'kanban/updateTask',
  async ({ id, data }) => {
    const apiService = (await import('../../services/api')).default;
    return await apiService.updateTask(id, data);
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTaskOptimistic: (state, action) => {
      const { id, status } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.status = status;
      }
    },
    revertTaskUpdate: (state, action) => {
      const { id, previousStatus } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.status = previousStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchKanbanTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKanbanTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload || [];
      })
      .addCase(fetchKanbanTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update task
      .addCase(updateKanbanTask.pending, (state) => {
        state.error = null;
      })
      .addCase(updateKanbanTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateKanbanTask.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearError, updateTaskOptimistic, revertTaskUpdate } = kanbanSlice.actions;

// Selectors
export const selectKanbanTasks = (state) => state.kanban.tasks;
export const selectTodaysTasks = (state) =>
  state.kanban.tasks.filter(t => t.status === 'TODO').slice(0, 6);
export const selectCurrentWorkTasks = (state) =>
  state.kanban.tasks.filter(t => t.status === 'IN_PROGRESS').slice(0, 6);

export default kanbanSlice.reducer;