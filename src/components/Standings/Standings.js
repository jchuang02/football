import React from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import Cup from "./Cup";
import League from "./League";

export default function Standings({ selectedLeague }) {
  const standings = useSelector((state) => state.standings[selectedLeague]);
  const showStandings = () => {
    if (standings) {
      if (standings.standingInfo.league.standings.length === 1) {
        return (
          <League standings={standings.standingInfo.league.standings[0]} />
        );
      } else if (standings.standingInfo.league.standings.length > 1) {
        return <Cup standings={standings.standingInfo.league.standings} />;
      } else {
        return (
          <Typography variant="h4" align="center">
            No Standings Available
          </Typography>
        );
      }
    } else if (selectedLeague === 0) {
      return "";
    } else {
      return (
        <Box sx={{ display: "flex", padding: "4rem" }}>
          <CircularProgress />
        </Box>
      );
    }
  };

  return <Container sx={{ marginBottom: "4rem" }}>{showStandings()}</Container>;
}
