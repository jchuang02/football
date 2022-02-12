import React from "react";
import {
  useScrollTrigger,
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "gatsby";
import { Home } from "iconoir-react";
import theme from "./MaterialUI/Theme";
import { ProfileCircled } from "iconoir-react";
import { getAuth } from "firebase/auth";
import Followed from "../components/Followed";

function ElevationScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Nav(props) {
  const auth = getAuth();
  const user = auth.currentUser;
  return (
    <ElevationScroll {...props}>
      <AppBar>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/">
            <IconButton
              size="large"
              edge="start"
              color="primary"
              sx={{ mr: 2 }}
              aria-label="home"
            >
              <Home strokeWidth={2} />
            </IconButton>
          </Link>
          <Followed />

          {user ? (
            <Link to="/account">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography>{user.email}</Typography>
                <ProfileCircled
                  color={theme.palette.primary.main}
                  width={"48px"}
                  height={"48px"}
                  style={{ marginLeft: "1rem" }}
                />
              </Box>
            </Link>
          ) : (
            <Link
              style={{
                fontSize: "24pt",
                fontWeight: "bold",
                margin: "1rem",
                padding: "1rem",
                textDecoration: "none",
                color: theme.palette.primary.main,
              }}
              activeStyle={{
                color: "#FFF",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "16px",
              }}
              to="/onboard"
            >
              Login / Signup
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </ElevationScroll>
  );
}
