import React, { useState } from "react";
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
import Followed from "../components/Followed";
import useAuth from "../hooks/useAuth";

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
  const user = useAuth();

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
                <Typography>{user}</Typography>
                <ProfileCircled
                  color={theme.palette.primary.main}
                  width={"48px"}
                  height={"48px"}
                  style={{ marginLeft: 8 }}
                />
              </Box>
            </Link>
          ) : (
            <Link
              style={{
                fontSize: "24pt",
                fontWeight: "bold",
                margin: 4,
                padding: 4,
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
