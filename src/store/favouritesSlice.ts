import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Match {
  id: number;
  title: string;
  score: string;
  image: string;
}

interface FavouritesState {
  items: Match[];
}

const initialState: FavouritesState = {
  items: [],
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Match>) => {
      const exists = state.items.find((m) => m.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addFavourite, removeFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;
