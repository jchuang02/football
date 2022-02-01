import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import Layout from "./layout";
import { fetchLeagues, updateLeagues } from "../actions";
import { Link } from "gatsby";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

export default function App() {
  const leagues = useSelector((state) => state.leagues);
  const dispatch = useDispatch();
  const auth = getAuth();
  let email;

  if (isSignInWithEmailLink(auth, window.location.href)) {
    email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      email = window.prompt("Please provide your email for confirmation");
    }
  }

  signInWithEmailLink(auth, email, window.location.href)
    .then((result) => {
      window.localStorage.removeItem("emailForSignIn");
    })
    .catch((error) => {
      console.log(error);
    });

  useEffect(() => {
    const topFiveIds = [
      39, 61, 135, 140, 78, 2, 3, 128, 45, 46, 47, 48, 299, 243, 263, 344, 266,
      262,
    ];

    if (!Object.keys(leagues).length > 0) {
      for (let i = 0; i < topFiveIds.length; i++) {
        dispatch(fetchLeagues(topFiveIds[i]));
      }
    }
    Object.values(leagues).forEach((league) => {
      if (Date.now() - league.lastUpdated >= 86400000) {
        dispatch(updateLeagues(league.leagueInfo.league.id));
      }
    });
  }, [dispatch, leagues]);

  return (
    <Layout>
      <Container>
        {Object.keys(leagues).length > 0 ? (
          <Link to="/competitions">
            <Typography sx={{ marginTop: "10rem" }}>Competitions</Typography>
          </Link>
        ) : (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
