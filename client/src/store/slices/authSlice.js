import { createSlice } from '@reduxjs/toolkit';

// status: 'unknown' (not yet checked) | 'authenticated' | 'unauthenticated'
const initialState = {
  user: null,
  status: 'unknown',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    clearUser(state) {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
