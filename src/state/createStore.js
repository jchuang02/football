/* eslint-disable import/no-anonymous-default-export */
import { applyMiddleware, compose } from "redux";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";
import { loadState, saveState } from "../localStorage";
const persistedState = loadState();

const composeEnhancers = compose;
const middlewareEnhancer = applyMiddleware(thunkMiddleware);
const composedEnhancers = composeEnhancers(middlewareEnhancer);

const store = configureStore({
  reducer: reducers,
  preloadedState: persistedState,
  composedEnhancers: composedEnhancers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

store.subscribe(() => {
  saveState(store.getState());
});

export default () => {
  return store;
};
