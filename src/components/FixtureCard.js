import React, { useState } from "react";
import {
  styled,
  Box,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  fixtureFinished,
  fixtureInProgress,
} from "../helpers/fixtureStatusHelper";
import { keyframes } from "@mui/styled-engine";
import LazyLoad from "react-lazyload";
import { Modal } from "@mui/material";
import Fixture from "./Fixture";

const ShowEvents = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} size="large" />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function FixtureCard({ fixture, loading }) {
  const [expanded, setExpanded] = useState(false);
  const [showFixture, setShowFixture] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const showEvents = () => {
    if (fixture.events) {
      return (
        <>
          <CardActions disableSpacing sx={{ justifyContent: "center" }}>
            <Typography
              sx={{ fontSize: "16px", fontWeight: "400", textAlign: "center" }}
            >
              Events
            </Typography>
            <ShowEvents
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              key={fixture.fixture.id}
              aria-label="show events"
              sx={{ marginLeft: "0" }}
            >
              <ExpandMoreIcon />
            </ShowEvents>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent sx={{ overflow: "scroll", maxHeight: "200px" }}>
              {fixture.events.map((event, index) => {
                return (
                  <List key={index}>
                    <ListItem
                      sx={{
                        img: {
                          height: "24px",
                          width: "24px",
                        },
                      }}
                    >
                      <ListItemText
                        primary={`${event.time.elapsed}'`}
                      ></ListItemText>
                      <ListItemText primary={event.detail}></ListItemText>
                      <img
                        src={event.team.logo}
                        alt={`${event.team.name} Logo`}
                      ></img>
                    </ListItem>
                  </List>
                );
              })}
            </CardContent>
          </Collapse>
        </>
      );
    }
  };

  const handleOnClick = (event) => {
    setShowFixture(!showFixture);
  };

  const handleClose = () => {
    setShowFixture(false);
  };

  const TeamInfo = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
  `;

  const TeamCrest = styled(Box)`
    max-width: 48px;
    max-height: 48px;
    img {
      max-width: 48px;
      max-height: 48px;
    }
    padding: 0.1rem;
  `;

  const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  `;

  const LiveIndicator = styled("div")(({ theme }) => ({
    height: "8px",
    width: "8px",
    backgroundColor: "#1BB55C",
    borderRadius: "50%",
    display: "inline-block",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
    animation: `${pulse} 2s infinite ease`,
  }));

  return (
    <Card
      key={fixture.fixture.id}
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
          {showFixture ? (
            <Modal onClose={handleClose} open={showFixture}>
              <Fixture fixture={fixture} />
            </Modal>
          ) : (
            ""
          )}
          <CardActionArea sx={{ borderRadius: "8px" }} onClick={handleOnClick}>
            <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
              {fixture.league.name}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "#707070" }}>
              {fixture.league.round}
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
                {fixture.goals.home !== null ? (
                  <Typography
                    sx={
                      fixture.teams.home.winner
                        ? { fontSize: "18pt", fontWeight: "700" }
                        : { fontSize: "18pt", fontWeight: "regular" }
                    }
                  >
                    {fixture.goals.home}
                  </Typography>
                ) : (
                  ""
                )}
                <TeamCrest>
                  <LazyLoad height={80}>
                    <img
                      src={fixture.teams.home.logo}
                      alt={`${fixture.teams.home.name} Logo`}
                    ></img>
                  </LazyLoad>
                </TeamCrest>
                <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
                  {fixture.teams.home.name}
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
                {fixture.goals.away !== null ? (
                  <Typography
                    sx={
                      fixture.teams.away.winner
                        ? { fontSize: "18pt", fontWeight: "700" }
                        : { fontSize: "18pt", fontWeight: "regular" }
                    }
                  >
                    {fixture.goals.away}
                  </Typography>
                ) : (
                  ""
                )}
                <TeamCrest>
                  <LazyLoad height={80}>
                    <img
                      src={fixture.teams.away.logo}
                      alt={`${fixture.teams.away.name} Logo`}
                    ></img>
                  </LazyLoad>
                </TeamCrest>
                <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
                  {fixture.teams.away.name}
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
                  {!fixtureFinished(fixture.fixture.status.short) &&
                  fixture.fixture.status.elapsed !== null
                    ? `${fixture.fixture.status.elapsed}'`
                    : ""}
                </Typography>
                {fixtureInProgress(fixture.fixture.status.short) ? (
                  <LiveIndicator />
                ) : (
                  ""
                )}
              </Box>

              <Typography sx={{ fontWeight: "600", fontSize: "14pt" }}>
                {fixture.fixture.status.elapsed === null
                  ? new Date(fixture.fixture.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: "true",
                    })
                  : ""}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "14px" }}>
              {fixture.fixture.date !== null
                ? new Date(fixture.fixture.timestamp * 1000).toLocaleDateString(
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
          {showEvents()}
        </CardContent>
      ) : (
        <CircularProgress sx={{ display: "flex", justifyContent: "center" }} />
      )}
    </Card>
  );
}
