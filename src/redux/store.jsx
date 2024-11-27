import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import baccheckerReducer from "./baccheckerSlice";
import { baccheckerApi } from "./apiSlice";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["bacchecker"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  bacchecker: baccheckerReducer,
  [baccheckerApi.reducerPath]: baccheckerApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baccheckerApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
