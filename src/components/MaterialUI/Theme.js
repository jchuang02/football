import { createTheme } from "@mui/material";
const colors = require("./colors.json");

const theme = createTheme({
  palette: {
    primary: {
      light: colors["color-primary-300"],
      main: colors["color-primary-500"],
      dark: colors["color-primary-700"],
    },
    info: {
      light: colors["colors-info-300"],
      main: colors["color-info-500"],
      dark: colors["color-info-700"],
    },
  },
  typography: {
    fontSize: 12,
    color: colors["color-primary-700"],
  },
  components: {
    CardActionArea: {
      styleOverrides: {
        root: {
          color: colors["color-primary-500"],
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: colors["color-primary-500"],
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
          body  {
            margin-top: 120px;
          },
          html  {
            -webkit-font-smoothing: auto;
          },
          ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0);
          },
          ::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.1);
          },
        `,
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFF",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          border: "2px solid #2E3A59",
          borderRadius: "16px",
          "&:hover": {
            border: "4px solid #2E3A59",
            borderRadius: "16px",
          },
        },
        notchedOutline: {
          border: 0,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          border: 0,
          "&:hover": {
            border: 0,
          },
        },
        input: {
          border: 0,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: "solid 2px #2E3A59",
          borderRadius: "16px",
          boxShadow: "none",
          marginTop: "1rem",
        },
      },
    },
  },
});

export default theme;
