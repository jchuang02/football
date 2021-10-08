import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, CircularProgress, Typography } from "@mui/material";
import { fetchStandings, updateStandings } from "../actions";
import Cup from "./Cup";
import League from "./League";

export default function Standings() {
  const selectedLeague = useSelector((state) => state.selectedLeague);
  const standings = useSelector((state) => state.standings[selectedLeague]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (standings === undefined) {
      dispatch(fetchStandings(selectedLeague, 2021));
    } else if (Date.now() - standings.lastUpdated >= 86400000) {
      console.log("Updating Standings...");
      dispatch(updateStandings(selectedLeague, 2021));
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
    <>
      <Typography variant="h4">Standings</Typography>
      {showStandings()}
    </>
  );
}
