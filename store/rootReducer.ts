import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import modalReducer from './slices/modal';
import movieReducer from './slices/movie';
import subscriptionReducer from './slices/sutbscription';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

export const rootReducer = combineReducers({
  modal: modalReducer,
  movie: movieReducer,
  subscription: subscriptionReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
