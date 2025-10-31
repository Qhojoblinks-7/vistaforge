import { configureStore } from '@reduxjs/toolkit';
import publicPortfolioReducer from './slices/publicPortfolioSlice';
import adminPortfolioReducer from './slices/adminPortfolioSlice';
import contactReducer from './slices/contactSlice';

export const store = configureStore({
  reducer: {
    publicPortfolio: publicPortfolioReducer,
    adminPortfolio: adminPortfolioReducer,
    contact: contactReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// TypeScript types (remove if not using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;