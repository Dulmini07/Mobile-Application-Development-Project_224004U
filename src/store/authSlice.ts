import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  user: any | null;
  token: string | null;
};

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: any; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.image = action.payload;
      }
    },
  },
});

export const { setAuth, logout, updateProfileImage } = authSlice.actions;
export default authSlice.reducer;
