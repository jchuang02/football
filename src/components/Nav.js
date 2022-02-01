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

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Nav(props) {
  const primaryColor = "#2E3A59";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ElevationScroll {...props}>
        <AppBar sx={{ backgroundColor: "white" }}>
          <Toolbar>
            <Link to="/">
              <IconButton
                size="large"
                edge="start"
                color="primary"
                sx={{ mr: 2 }}
                aria-label="home"
              >
                <Home />
              </IconButton>
            </Link>

            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: primaryColor }}
            >
              Football Dashboard
            </Typography>
            <Link to="onboard">Login / Signup</Link>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </Box>
  );
}
