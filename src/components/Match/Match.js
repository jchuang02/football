import React, { useEffect } from "react";
import { Box, Divider, Fab, Container, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatch } from "../../state/actions/fixtures";
import Lineup from "./Lineup";
import LiveIndicator from "../LiveIndicator";
import { matchInProgress } from "../../helpers/matchStatusHelper";
import CloseIcon from '@mui/icons-material/Close';
import EventsTimeline from "./EventsTimeline";
import TeamCrest from "./TeamCrest";

export default function Match({ id, onClick }) {

  const match = useSelector((state) => state.fixtures[id]);
  const dispatch = useDispatch();

  console.log(match);

  useEffect(() => {
    if (!match.lineups) {
      dispatch(fetchMatch(id))
    }
  }, [])

  const matchStyle = {
    marginTop: 8,
    padding: 2,
  };

  return (
    <Box sx={matchStyle} key={match.fixture.id} >
      <Container>
        <Typography
          id="match-modal-title"
          variant="h3"
          align="center"
          component="h2"
        >
          {match.league.name}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          component="h2"
        >
          {match.league.country}
        </Typography>
        <Typography
          variant="h6"
          align="center"
          component="h2"
        >
          {match.league.round}
        </Typography>
      </Container>
      {match.lineups && match.lineups.length > 0 ?
        <Box sx={{ display: "flex", marginTop: "2rem", justifyContent: "center" }}>
          <Lineup lineup={match.lineups[0]} direction="left" />
          <Box sx={{ marginTop: 2, display: "flex", justifyContent: "center", flexFlow: "column wrap", padding: "2rem" }}>
            <Typography
              variant="h4"
              align="center"
              component="h2"
            >
              {new Date(match.fixture.date).toLocaleDateString()}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              component="h5"
            >
              {`${match.fixture.venue.city}`}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              component="h5"
            >
              {`${match.fixture.venue.name}`}
            </Typography>
            <Typography
              variant="h5"
              align="center"
              component="h5"
            >
              {`${match.fixture.referee ? match.fixture.referee : ""}`}
            </Typography>
          </Box>
          <Lineup lineup={match.lineups[1]} direction="right" />
        </Box>
        : ""
      }
      <Box sx={{ display: "flex", justifyContent: "space-evenly", marginTop: 4 }}>
        <Box sx={{ display: "flex", flexFlow: "column nowrap", flexBasis: "35%" }}>
          <Typography variant="h2" align="center">{match.goals.home}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <TeamCrest size="64px" name={match.teams.home.name} image={match.teams.home.logo} />
            <Typography variant="h4" align="center">{match.teams.home.name}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexBasis: "30%" }}>
          {matchInProgress(match.fixture.status.short) ? (
            <LiveIndicator />
          ) : (
            ""
          )}
          <Box sx={{ display: "flex", justifyContent: "center", flexFlow: "column nowrap" }}>
            <Typography variant="h5" align="center">{match.fixture.status.elapsed ? `${match.fixture.status.elapsed} Minutes` : ""}</Typography>
            <Typography variant="h5" align="center">{`${match.fixture.status.long}`}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexFlow: "column nowrap", flexBasis: "35%" }}>
          <Typography variant="h2" align="center">{match.goals.away}</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h4" align="center">{match.teams.away.name}</Typography>
            <TeamCrest size="64px" name={match.teams.away.name} image={match.teams.away.logo} />
          </Box>
        </Box>
      </Box>
      <Divider />
      <EventsTimeline events={match.events} />
      <Fab color="primary" aria-label="add" onClick={onClick} sx={{ position: "fixed", top: "90vh", left: "50%" }}>
        <CloseIcon />
      </Fab>
    </Box>
  );
}
