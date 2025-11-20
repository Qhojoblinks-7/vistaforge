import { configureStore } from '@reduxjs/toolkit';
import publicPortfolioReducer from './slices/publicPortfolioSlice';
import adminPortfolioReducer from './slices/adminPortfolioSlice';
import contactReducer from './slices/contactSlice';
import inquiriesReducer from './slices/inquiriesSlice';
import settingsReducer from './slices/settingsSlice';
import timeLogsReducer from './slices/timeLogsSlice';
import invoicesReducer from '../modules/Invoices/services/invoicesSlice';
import clientsReducer from '../modules/Clients/services/clientsSlice';
import projectsReducer from '../modules/Projects/services/projectsSlice';
import financialMetricsReducer from './slices/financialMetricsSlice';
import kanbanReducer from './slices/kanbanSlice';
import projectDetailReducer from './slices/projectDetailSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    publicPortfolio: publicPortfolioReducer,
    adminPortfolio: adminPortfolioReducer,
    contact: contactReducer,
    inquiries: inquiriesReducer,
    settings: settingsReducer,
    timeLogs: timeLogsReducer,
    invoices: invoicesReducer,
    clients: clientsReducer,
    projects: projectsReducer,
    financialMetrics: financialMetricsReducer,
    kanban: kanbanReducer,
    projectDetail: projectDetailReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
