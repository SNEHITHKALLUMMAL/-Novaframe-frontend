import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice.js';
import authReducer from './slices/authSlice.js';

// Feature slices grow as each phase needs them (generationSlice in Phase 9, etc).
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
  },
});
