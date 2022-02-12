import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { fetchStandings, updateStandings } from "../actions";
import Cup from "./Cup";
import League from "./League";
import Selector from "../components/Selector";

export default function Standings({ selectedLeague = 0 }) {
  // const selectedLeague = useSelector((state) => state.selectedLeague);
  const standings = useSelector((state) => state.standings[selectedLeague]);
  const dispatch = useDispatch();
  const leagues = useSelector((state) => state.leagues);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  useEffect(() => {
    if (selectedLeague) {
      if (standings === undefined) {
        dispatch(fetchStandings(selectedLeague, 2021));
      } else if (Date.now() - standings.lastUpdated >= 86400000) {
        dispatch(updateStandings(selectedLeague, 2021));
      }
    }
  }, [dispatch, standings, selectedLeague]);

  const showStandings = () => {
    if (standings !== undefined) {
      if (standings.standingInfo.league.standings.length === 1) {
        return (
          <League standings={standings.standingInfo.league.standings[0]} />
        );
      } else if (standings.standingInfo.league.standings.length > 1) {
        return <Cup standings={standings.standingInfo.league.standings} />;
      } else {
        return <Typography>No Standings Available</Typography>;
      }
    } else {
      return (
        <Box sx={{ display: "flex", padding: "4rem" }}>
          <CircularProgress />
        </Box>
      );
    }
  };

  return (
    <Container sx={{ marginBottom: "4rem", marginTop: "4rem" }}>
      {showStandings()}
    </Container>
  );
}
