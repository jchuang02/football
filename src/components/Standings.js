import React from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import Cup from "./Cup";
import League from "./League";

export default function Standings({ selectedLeague = 0 }) {
  const standings = useSelector((state) => state.standings[selectedLeague]);

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
