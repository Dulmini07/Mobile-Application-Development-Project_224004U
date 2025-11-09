import { configureStore, createSlice, PayloadAction, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -------------------- FAVOURITES SLICE -------------------- */

export type FavouriteItem = { id: number; title: string; score?: string; image?: string };

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState: { items: [] as FavouriteItem[] },
  reducers: {
    addFavourite: (state, action: PayloadAction<FavouriteItem>) => {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        console.log('[favourites] added', action.payload.id);
      }
    },
    removeFavourite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      console.log('[favourites] removed', action.payload);
    },
    clearFavourites: (state) => {
      state.items = [];
      console.log('[favourites] cleared');
    },
  },
});

/* -------------------- AUTH SLICE -------------------- */

type AuthUser = { id: string; name: string } | null;

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null as AuthUser, token: undefined as string | undefined },
  reducers: {
    login: (state, action: PayloadAction<{ id: string; name: string; token?: string }>) => {
      state.user = { id: action.payload.id, name: action.payload.name };
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = undefined;
    },
  },
});

/* -------------------- EXPORT ACTIONS -------------------- */

export const { addFavourite, removeFavourite, clearFavourites } = favouritesSlice.actions;
export const { login, logout } = authSlice.actions;

/* -------------------- REDUX PERSIST CONFIG -------------------- */

const rootReducer = combineReducers({
  favourites: favouritesSlice.reducer,
  auth: authSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['favourites', 'auth'], // store both slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/* -------------------- STORE SETUP -------------------- */

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

export const persistor = persistStore(store);

/* -------------------- TYPES -------------------- */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
