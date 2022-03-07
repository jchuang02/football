import React, { useState } from "react";
import {
  useScrollTrigger,
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, navigate } from "gatsby";
import { Home, HomeAlt } from "iconoir-react";
import theme from "./MaterialUI/Theme";
import { ProfileCircled } from "iconoir-react";
import Followed from "../components/Followed";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { resetFollowed } from "../actions/favorites";
import { selectLeague, selectTeam } from "../actions/index";
import { getAuth, signOut } from "firebase/auth";

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
  const dispatch = useDispatch();
  const auth = getAuth();
  const user = useAuth();
  const [hover, setHover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(resetFollowed());
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ElevationScroll {...props}>
      <AppBar sx={{ height: "120px", justifyContent: "center" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/">
            <IconButton
              onClick={() => {
                dispatch(selectLeague(""));
                dispatch(selectTeam(""));
              }}
              onMouseOver={() => {
                setHover(true);
              }}
              onMouseOut={() => {
                setHover(false);
              }}
              size="large"
              edge="start"
              color="primary"
              sx={{ mr: 2 }}
              aria-label="home"
            >
              {hover ? <HomeAlt strokeWidth={3} /> : <Home strokeWidth={2} />}
            </IconButton>
          </Link>
          <Followed />

          {auth.currentUser ? (
            <>
              <Button
                onClick={handleMenu}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
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
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/personalize");
                  }}
                >
                  Personalize
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleSignOut();
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link
              style={{
                fontSize: "16pt",
                fontWeight: "bold",
                textDecoration: "none",
                margin: 4,
                textAlign: "center",
                color: theme.palette.primary.main,
              }}
              activeStyle={{
                color: "#FFF",
                backgroundColor: theme.palette.primary.main,
                borderRadius: "16px",
                padding: 8,
                margin: 2,
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
