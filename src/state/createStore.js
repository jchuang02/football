/* eslint-disable import/no-anonymous-default-export */
import { applyMiddleware, compose } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import reducers from "../reducers";
import { loadState, saveState } from "../localStorage";
const persistedState = loadState();

const middlewareEnhancer = applyMiddleware(thunkMiddleware);
const composedEnhancers = compose(middlewareEnhancer);
const store = configureStore({
  reducer: reducers,
  preloadedState: persistedState,
  composedEnhancers: composedEnhancers,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default () => {
  return store;
};
