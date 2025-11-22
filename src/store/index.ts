import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer, { logout as _logout } from './authSlice';
import favouritesReducer, {
    addFavourite as _addFavourite,
    clearFavourites as _clearFavourites,
    removeFavourite as _removeFavourite,
} from './favouritesSlice';
import themeReducer from './themeSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  auth: authReducer,
  favourites: favouritesReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // persist theme so user's preference is kept
  whitelist: ['auth', 'favourites', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) =>
    gDM({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// re-export actions for convenience (keep names stable)
export const addFavourite = _addFavourite;
export const removeFavourite = _removeFavourite;
export const clearFavourites = _clearFavourites;
export const logout = _logout;
// (optionally) re-export theme action
export { setThemeMode } from './themeSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
