import React from "react";
import App from "../components/App";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { FirebaseAppProvider } from "reactfire";

const firebaseConfig = {
  apiKey: process.env.GATSBY_APP_FIREBASE_API_KEY,
  authDomain: "football-dashboard-488e1.firebaseapp.com",
  projectId: "football-dashboard-488e1",
  storageBucket: "football-dashboard-488e1.appspot.com",
  messagingSenderId: "321068336527",
  appId: "1:321068336527:web:7eb3ea81261fd6091637fa",
  measurementId: "G-54JD715SLD",
};

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

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <CssBaseline />
        <App />
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}
