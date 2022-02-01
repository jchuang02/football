import React from "react";
import { useSelector } from "react-redux";
import App from "../components/App";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { deleteEmail } from "../actions";

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
  const dispatch = useDispatch();
  const email = useSelector((state) => state.email);
  const auth = getAuth();

  if (isSignInWithEmailLink(auth, window.location.href)) {
    if (email.length > 0) {
      console.log(`Your email is : ${email}`);
    }
  }

  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      dispatch(deleteEmail());
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}
