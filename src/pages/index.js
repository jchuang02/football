import React from "react";
import App from "../components/App";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";


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
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
