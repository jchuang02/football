/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { Provider } from "react-redux";
import createStore from "./src/state/createStore";
import { initializeApp } from "firebase/app";
import theme from "./src/components/MaterialUI/Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

const firebaseConfig = {
  apiKey: process.env.GATSBY_APP_FIREBASE_API_KEY,
  authDomain: "football-dashboard-488e1.firebaseapp.com",
  projectId: "football-dashboard-488e1",
  storageBucket: "football-dashboard-488e1.appspot.com",
  messagingSenderId: "321068336527",
  appId: "1:321068336527:web:7eb3ea81261fd6091637fa",
  measurementId: "G-54JD715SLD",
};

initializeApp(firebaseConfig);
export default ({ element }) => {
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  const store = createStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>{element}</Provider>
    </ThemeProvider>
  );
};
