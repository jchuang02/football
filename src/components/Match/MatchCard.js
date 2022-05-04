import React, { useState } from "react";
import {
  styled,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  Divider,
  Typography,
  Grow,
  CircularProgress,
} from "@mui/material";
import {
  matchFinished,
  matchInProgress,
} from "../../helpers/matchStatusHelper";
import Match from "./Match";
import LiveIndicator from "../LiveIndicator";
import Events from "./Events";
import TeamCrest from "./TeamCrest";

export default function MatchCard({ match, loading }) {
  const [showMatch, setShowMatch] = useState(false);

  const handleOnClick = (event) => {
    setShowMatch(!showMatch);
  };

  const handleClose = () => {
    setShowMatch(false);
  };

  const TeamInfo = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  `;

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Grow ref={ref} {...props} />;
  });

  return (
    <Card
      key={match.fixture.id}
      sx={{
        width: "25vw",
        height: "40vh",
        boxShadow: "none",
        border: "2px solid #2E3A59",
        m: 1,
        borderRadius: "16px",
      }}
    >
      {!loading ? (
        <CardContent>
          {showMatch ? (
            <Dialog fullScreen onClose={handleClose} open={showMatch}>
              <Match id={match.fixture.id} onClick={handleOnClick} sx={{ backgroundColor: "transparent" }} />
            </Dialog>
          ) : (
            ""
          )}
          <CardActionArea sx={{ borderRadius: "8px" }} onClick={handleOnClick}>
            <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
              {match.league.name}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#707070" }}>
              {match.league.round}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "start",
                paddingTop: "1rem",
                paddingBottom: "1rem",
              }}
            >
              <TeamInfo>
                {match.goals.home !== null ? (
                  <Typography
                    sx={
                      match.teams.home.winner
                        ? { fontSize: "18pt", fontWeight: "700" }
                        : { fontSize: "18pt", fontWeight: "regular" }
                    }
                  >
                    {match.goals.home}
                  </Typography>
                ) : (
                  ""
                )}
                <TeamCrest size="48px" name={match.teams.home.name} image={match.teams.home.logo} />
                <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
                  {match.teams.home.name}
                </Typography>
              </TeamInfo>
              <Typography
                sx={{
                  alignSelf: "center",
                  fontSize: "18pt",
                  fontWeight: "500",
                }}
              >
                vs.
              </Typography>
              <TeamInfo>
                {match.goals.away !== null ? (
                  <Typography
                    sx={
                      match.teams.away.winner
                        ? { fontSize: "18pt", fontWeight: "700" }
                        : { fontSize: "18pt", fontWeight: "regular" }
                    }
                  >
                    {match.goals.away}
                  </Typography>
                ) : (
                  ""
                )}
                <TeamCrest size="48px" name={match.teams.away.name} image={match.teams.away.logo} />
                <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
                  {match.teams.away.name}
                </Typography>
              </TeamInfo>
            </Box>
            <Divider variant="middle" />
            <Box sx={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography>
                  {!matchFinished(match.fixture.status.short) &&
                    match.fixture.status.elapsed !== null
                    ? `${match.fixture.status.elapsed}'`
                    : ""}
                </Typography>
                {matchInProgress(match.fixture.status.short) ? (
                  <LiveIndicator />
                ) : (
                  ""
                )}
              </Box>

              <Typography sx={{ fontWeight: "600", fontSize: "14pt" }}>
                {match.fixture.status.elapsed === null
                  ? new Date(match.fixture.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  : ""}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "14px" }}>
              {match.fixture.date !== null
                ? new Date(match.fixture.timestamp * 1000).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
                : ""}
            </Typography>
          </CardActionArea>
          <Events match={match} />
        </CardContent>
      ) : (
        <CircularProgress sx={{ display: "flex", justifyContent: "center" }} />
      )}
    </Card>
  );
}
