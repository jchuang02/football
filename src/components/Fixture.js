import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function Fixture({ fixture }) {
  const fixtureStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60vw",
    height: "80vh",
    bgcolor: "background.paper",
    border: "2px solid #2E3A59",
    borderRadius: "16px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={fixtureStyle} key={fixture.fixture.id}>
      <Container>
        <Typography
          id="fixture-modal-title"
          variant="h2"
          align="center"
          component="h2"
        >
          {fixture.league.name}
        </Typography>
        <Typography
          id="fixture-modal-title"
          variant="body1"
          align="center"
          component="h2"
        >
          {fixture.league.country}
        </Typography>
        <Typography
          id="fixture-modal-title"
          variant="h6"
          align="center"
          component="h2"
        >
          {fixture.league.round}
        </Typography>
      </Container>

      <Box sx={{ marginTop: 8, display: "flex" }}>
        <Typography
          id="fixture-modal-title"
          variant="h4"
          align="center"
          component="h2"
        >
          {`${fixture.teams.home.name} vs ${fixture.teams.away.name}`}
        </Typography>
      </Box>
      <Box sx={{ marginTop: 8, display: "flex" }}>
        <Typography
          id="fixture-modal-title"
          variant="h4"
          align="center"
          component="h2"
        >
          {fixture.lineups ? fixture.lineups[0].team.name : ""}
        </Typography>
      </Box>
    </Box>
  );
}
