import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  token: null,
  tokenLife: null,
  isAuthenticated: false,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.tokenLife = action.payload.tokenLife;
      state.isAuthenticated = true;
    },
    clearAuthData: (state) => {
      state.userId = null;
      state.token = null;
      state.tokenLife = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthData, clearAuthData } = auth.actions;

export default auth.reducer;
