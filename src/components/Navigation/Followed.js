import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeagues, updateLeagues } from "../../actions/leagues";
import {
  fetchTeams,
  updateTeams,
  selectLeague,
  selectTeam,
} from "../../actions";
import { fetchTeamLeagues, updateTeamLeagues } from "../../actions/teamLeagues";
import { navigate } from "gatsby";
import AddLeagueModal from "../Onboarding/AddLeagueModal";
import AddTeamModal from "../Onboarding/AddTeamModal";

export default function Followed() {
  const dispatch = useDispatch();
  const followedTeams = useSelector((state) => state.followed.teams);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const selectedLeague = useSelector((state) => state.selectedLeague);
  const selectedTeam = useSelector((state) => state.selectedTeam);
  const leagues = useSelector((state) => state.leagues);
  const teams = useSelector((state) => state.teams);

  useEffect(() => {
    followedTeams.forEach((team) => {
      if (!teams[team]) {
        dispatch(fetchTeams(team));
        dispatch(fetchTeamLeagues(team));
      } else if (Date.now() - teams[team].lastUpdated >= 86400000) {
        dispatch(updateTeams(team));
        dispatch(updateTeamLeagues(team));
      }
    });
  }, [dispatch, followedTeams, teams]);

  useEffect(() => {
    followedLeagues.forEach((league) => {
      if (!leagues[league]) {
        dispatch(fetchLeagues(league));
      } else if (Date.now() - leagues[league].lastUpdated >= 86400000) {
        dispatch(updateLeagues(league));
      }
    });
  }, [dispatch, followedLeagues, leagues]);

  const choiceStyle = {
    border: "2px solid #2E3A59",
    flex: "0 1 25%",
    borderRadius: "16px",
    minWidth: "64px",
    minHeight: "64px",
    maxWidth: "64px",
    maxHeight: "64px",
    textAlign: "center",
    backgroundSize: "80%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    width: "100%",
    m: 1,
    "&:hover": {
      cursor: "pointer",
      border: "4px solid #2E3A59",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {followedTeams.length > 0
        ? followedTeams.map((team) => {
            return (
              <Box
                key={team}
                onClick={() => {
                  if (selectedTeam !== team) {
                    dispatch(selectTeam(team));
                    dispatch(selectLeague(""));
                  }
                  if (window && window.location.pathname !== "/teams") {
                    navigate("/teams");
                  }
                }}
                sx={{
                  ...choiceStyle,
                  backgroundImage: teams[team]
                    ? `url(${teams[team].teamInfo.team.logo})`
                    : "",
                  border:
                    selectedTeam === team
                      ? "4px solid #2E3A59"
                      : "2px solid #2E3A59",
                }}
              ></Box>
            );
          })
        : null}
      <AddTeamModal />
      {followedLeagues.length > 0
        ? followedLeagues.map((league) => {
            return (
              <Box
                key={league}
                onClick={() => {
                  if (selectedLeague !== league) {
                    dispatch(selectLeague(league));
                    dispatch(selectTeam(""));
                  }
                  if (window && window.location.pathname !== "/competitions") {
                    navigate("/competitions");
                  }
                }}
                sx={{
                  ...choiceStyle,
                  backgroundImage: leagues[league]
                    ? `url(${leagues[league].league.league.logo})`
                    : "",
                  border:
                    selectedLeague === league
                      ? "4px solid #2E3A59"
                      : "2px solid #2E3A59",
                }}
              ></Box>
            );
          })
        : null}
      <AddLeagueModal />
    </Box>
  );
}
