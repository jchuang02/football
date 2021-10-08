import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "react-redux";
// import { compose, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
import reducers from "./reducers";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { loadState, saveState } from "./localStorage";
import { configureStore } from "@reduxjs/toolkit";

const persistedState = loadState();
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = configureStore({
  reducer: reducers,
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

const theme = createTheme({
  typography: {
    fontSize: 12,
  },
  components: {
    CardActionArea: {
      styleOverrides: {
        root: {
          color: "#2E3A59",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#2E3A59",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        html  {
          -webkit-font-smoothing: auto;
        },
        ::-webkit-scrollbar {
          width: 1rem;
        },
        ::-webkit-scrollbar {
          height: 1rem;
        },
        ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0);
        },
        ::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
        },
      `,
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <CssBaseline />
      <App />
    </Provider>
  </ThemeProvider>,
  document.querySelector("#root")
);
