import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeagues, updateLeagues } from "../actions/leagues";
import { fetchTeams, updateTeams, selectLeague, selectTeam } from "../actions";
import { navigate } from "gatsby";
import AddLeagueModal from "./Onboarding/AddLeagueModal";
import AddTeamModal from "./Onboarding/AddTeamModal";

export default function Followed() {
  const dispatch = useDispatch();
  const followedTeams = useSelector((state) => state.followed.teams);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const selectedLeague = useSelector((state) => state.selectedLeague);
  const selectedTeam = useSelector((state) => state.selectedTeam);
  const leagues = useSelector((state) => state.leagues);
  const teams = useSelector((state) => state.teams);

  useEffect(() => {
    const leagueIds = Object.keys(leagues).map((league) => {
      return Number(league);
    });

    for (let i = 0; i < followedLeagues.length; i++) {
      if (!leagueIds.includes(followedLeagues[i])) {
        dispatch(fetchLeagues(followedLeagues[i]));
      }
    }

    Object.values(leagues).forEach((league) => {
      if (Date.now() - league.lastUpdated >= 86400000) {
        dispatch(updateLeagues(league.leagueInfo.league.id));
      }
    });

    const teamIds = Object.keys(teams).map((team) => {
      return Number(team);
    });

    for (let i = 0; i < followedTeams.length; i++) {
      if (!teamIds.includes(followedTeams[i])) {
        dispatch(fetchTeams(followedTeams[i]));
      }
    }

    Object.values(teams).forEach((team) => {
      if (Date.now() - team.lastUpdated >= 86400000) {
        dispatch(updateTeams(team.teamInfo.team.id));
      }
    });
  }, [followedLeagues, followedTeams, dispatch, leagues, teams]);

  const choiceStyle = {
    border: "2px solid #2E3A59",
    m: 1,
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
    "&:hover": {
      cursor: "pointer",
      border: "4px solid #2E3A59",
    },
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30vw",
            overflowX: "auto",
          }}
        >
          {leagues
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
                  >
                    {teams[team] ? "" : ""}
                  </Box>
                );
              })
            : ""}
        </Box>
        <AddTeamModal />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "30vw",
            overflowX: "auto",
          }}
        >
          {leagues
            ? followedLeagues.map((league) => {
                return (
                  <Box
                    key={league}
                    onClick={() => {
                      if (selectedLeague !== league) {
                        dispatch(selectLeague(league));
                        dispatch(selectTeam(""));
                      }
                      if (
                        window &&
                        window.location.pathname !== "/competitions"
                      ) {
                        navigate("/competitions");
                      }
                    }}
                    sx={{
                      ...choiceStyle,
                      backgroundImage: leagues[league]
                        ? `url(${leagues[league].leagueInfo.league.logo})`
                        : "",
                      border:
                        selectedLeague === league
                          ? "4px solid #2E3A59"
                          : "2px solid #2E3A59",
                    }}
                  >
                    {leagues[league] ? "" : ""}
                  </Box>
                );
              })
            : ""}
        </Box>
        <AddLeagueModal />
      </Box>
    </>
  );
}
