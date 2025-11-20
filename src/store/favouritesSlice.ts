import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FavouriteItem = { id: string | number; title: string; score?: string; image?: string };

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState: { items: [] as FavouriteItem[] },
  reducers: {
    addFavourite: (state, action: PayloadAction<FavouriteItem>) => {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    removeFavourite: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearFavourites: (state) => {
      state.items = [];
    },
  },
});

export const { addFavourite, removeFavourite, clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
