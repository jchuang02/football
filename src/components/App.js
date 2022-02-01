import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, CircularProgress } from "@mui/material";
import Layout from "./layout";
import { fetchLeagues, updateLeagues } from "../actions";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Link } from "gatsby";

export default function App() {
  const leagues = useSelector((state) => state.leagues);
  const dispatch = useDispatch();
  const firebaseConfig = {
    apiKey: "AIzaSyC2cuV8yTDY_KLWSF6DY7crPTWnlUrQw9U",
    authDomain: "football-dashboard-488e1.firebaseapp.com",
    projectId: "football-dashboard-488e1",
    storageBucket: "football-dashboard-488e1.appspot.com",
    messagingSenderId: "321068336527",
    appId: "1:321068336527:web:7eb3ea81261fd6091637fa",
    measurementId: "G-54JD715SLD",
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

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
          <Link to="competitions">Competitions</Link>
        ) : (
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
