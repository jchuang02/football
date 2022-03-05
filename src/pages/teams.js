import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, LinearProgress, Typography } from "@mui/material";
import {
  fetchTeamFixtures,
  updateTeamFixtures,
  updateAllLiveFixtures,
  updateLiveTeamFixtures,
  updateLiveTeamFixturesById,
} from "../actions/fixtures";
import { updateStandings } from "../actions/standings";
import {
  fixtureInProgress,
  fixtureEnding,
  fixtureOnBreak,
  fixtureFinished,
} from "../helpers/fixtureStatusHelper";
import {
  fixturesInProgress,
  fixturesUpcoming,
  fixturesToday,
  fixturesFinished,
} from "../helpers/fixturesHelper";
import Upcoming from "../components/Matches/Upcoming";
import Recent from "../components/Matches/Recent";
import Live from "../components/Matches/Live";
import Layout from "../components/layout";
import { fetchTeamLeagues, updateTeamLeagues } from "../actions/teamLeagues";
import _ from "lodash";
import useInterval from "../hooks/useInterval";

export default function Teams() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const teams = useSelector((state) => state.teams);
  const leagues = useSelector((state) => state.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const selectedTeam = useSelector((state) => state.selectedTeam);
  const teamLeagues = useSelector((state) => state.teamLeagues);
  const fixtures = useSelector((state) => state.fixtures);
  const standings = useSelector((state) => state.standings);

  const now = new Date();

  const current = useSelector((state) => {
    if (teams && selectedTeam && teamLeagues[selectedTeam]) {
      let currentSeasons = state.teamLeagues[selectedTeam].leagueInfo.map(
        (league) => {
          return league.seasons[0].year;
        }
      );
      let currentYear = 0;
      currentSeasons.forEach((season) => {
        currentYear = Math.max(season, currentYear);
      });
      return currentYear;
    } else {
      return now.getFullYear();
    }
  });

  useEffect(() => {
    setLoading(true);
    const pageLoading = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(pageLoading);
    };
  }, []);

  //Get league information if it does not exist and update it if updated more than a day ago.
  useEffect(() => {
    if (!teamLeagues[selectedTeam]) {
      dispatch(fetchTeamLeagues(selectedTeam));
    } else if (Date.now() - teamLeagues[selectedTeam].lastUpdated >= 86400000) {
      dispatch(updateTeamLeagues(selectedTeam));
    }
  }, [dispatch, selectedTeam, teamLeagues]);

  //If no matches are present for the selected team, fetch them.
  useEffect(() => {
    const teamFixtures = Object.values(fixtures).filter((match) => {
      return (
        Number(match.teams.away.id) === selectedTeam ||
        Number(match.teams.home.id) === selectedTeam
      );
    });
    if (!teamFixtures.length && selectedTeam) {
      dispatch(fetchTeamFixtures(selectedTeam, current));
    }
  }, [dispatch, current, fixtures, selectedTeam]);

  //If live fixtures are present in fixtures, update them.
  useEffect(() => {
    const teamFixtures = Object.values(fixtures).filter((match) => {
      return (
        Number(match.teams.away.id) === selectedTeam ||
        Number(match.teams.home.id) === selectedTeam
      );
    });
    if (teamFixtures.length) {
      if (
        teamFixtures.filter((match) => {
          return (
            fixtureInProgress(match.fixture.status.short) &&
            !fixtureOnBreak(match.fixture.status.short) &&
            Date.now() - match.lastUpdated >= 60000
          );
        }).length > 0 ||
        teamFixtures.filter((match) => {
          return (
            match.fixture.timestamp * 1000 - Date.now() < 0 &&
            match.fixture.status.short === "NS" &&
            Date.now() - match.lastUpdated >= 60000
          );
        }).length > 0
      ) {
        dispatch(updateTeamFixtures(current, selectedTeam));
      }
    }
  }, []);

  //For matches starting later today
  useEffect(() => {
    let timer;
    if (
      !Object.values(fixtures).filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = fixturesToday(Object.values(fixtures)) || [];
      let startUpdateTimes = allMatchesToday.map(({ fixture }) => {
        return fixture.timestamp * 1000 - Date.now();
      });
      startUpdateTimes = [...new Set(startUpdateTimes)];
      startUpdateTimes = startUpdateTimes.filter((time) => {
        return time > 0;
      });
      //If a game is starting later, start a timer to start updating live fixtures when the game begins.
      if (
        startUpdateTimes.length > 0 &&
        !fixturesInProgress(allMatchesToday).length > 0
      ) {
        startUpdateTimes.forEach((time) => {
          console.log(
            "Setting timer for match starting later today at " + time
          );
          timer = setTimeout(() => {
            dispatch(updateAllLiveFixtures());
          }, time);
        });
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [dispatch, fixtures]);

  //For matches happening soon or now
  let delay = 60000;
  useInterval(() => {
    if (
      Object.values(fixtures) &&
      !Object.values(fixtures).filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = fixturesToday(Object.values(fixtures)) || [];
      let startUpdateTimes = allMatchesToday.map(({ fixture }) => {
        return fixture.timestamp * 1000 - Date.now();
      });
      startUpdateTimes = [...new Set(startUpdateTimes)];
      startUpdateTimes = startUpdateTimes.filter((time) => {
        return time > 0;
      });
      const continueUpdates = startUpdateTimes.filter((time) => {
        return time <= 0 && time >= -(60000 * 5);
      });
      const allMatchesOnBreak = Object.values(fixtures).filter(
        ({ fixture }) => {
          return fixture.status.short === "HT" && fixture.status.elapsed === 45;
        }
      );
      const allMatchesEnding = Object.values(fixtures).filter(({ fixture }) => {
        return fixtureEnding(fixture.status.elapsed, fixture.status.short);
      });
      const allMatchesInProgress = fixturesInProgress(Object.values(fixtures));
      if (
        (allMatchesInProgress.length > 0 || continueUpdates.length > 0) &&
        !allMatchesOnBreak.length !== allMatchesInProgress.length
      ) {
        if (
          allMatchesEnding.length > 0 &&
          allMatchesEnding.length < allMatchesInProgress.length
        ) {
          allMatchesEnding.forEach((match) => {
            dispatch(
              updateLiveTeamFixturesById(match.fixture.id, match.league.id)
            );
          });
          dispatch(updateAllLiveFixtures());
          //If all matches are ending
        } else if (
          allMatchesEnding.length > 0 &&
          allMatchesEnding.length === allMatchesInProgress.length
        ) {
          allMatchesEnding.forEach((match) => {
            dispatch(
              updateLiveTeamFixturesById(match.fixture.id, match.league.id)
            );
          });
        } else {
          dispatch(updateAllLiveFixtures());
        }
      } else if (
        allMatchesToday.length > 0 &&
        allMatchesToday.filter((match) => {
          return fixtureFinished(match.fixture.status.short);
        }).length === allMatchesToday.length
      ) {
        const allStandings = _.uniq(
          allMatchesToday
            .filter((match) => {
              return (
                followedTeams.includes(match.teams.away.id) ||
                followedTeams.includes(match.teams.home.id)
              );
            })
            .map((match) => {
              return match.league.id;
            })
        );
        console.log(allStandings);
        allStandings.forEach((standing) => {
          const now = new Date();
          const currentSeason =
            leagues[standing].leagueInfo.seasons.find((season) => {
              return season.current;
            }).year || now.getFullYear();
          if (
            standings[standing] &&
            Date.now() - standings[standing].lastUpdated >= 60000 * 60
          ) {
            dispatch(updateStandings(standing, currentSeason));
          }
        });
      }
    }
  }, delay);

  let breakDelay = 60000 * 5.1;
  //When fixtures are all on break
  useInterval(() => {
    if (
      Object.values(fixtures) &&
      !Object.values(fixtures).filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesOnBreak = Object.values(fixtures).filter(
        ({ fixture }) => {
          return fixture.status.short === "HT" && fixture.status.elapsed === 45;
        }
      );
      const allMatchesInProgress = fixturesInProgress(Object.values(fixtures));
      if (allMatchesOnBreak.length === allMatchesInProgress.length) {
        console.log("Match at halftime break. Staggering updates");
        dispatch(updateAllLiveFixtures());
      }
    }
  }, breakDelay);

  const teamFixtures = Object.values(fixtures).filter((match) => {
    return (
      Number(match.teams.away.id) === selectedTeam ||
      Number(match.teams.home.id) === selectedTeam
    );
  });

  if (teams) {
    return (
      <Layout>
        {!selectedTeam ? (
          <Typography
            variant="h2"
            sx={{ padding: "4rem", textAlign: "center" }}
          >
            Welcome to Footdash
          </Typography>
        ) : (
          ""
        )}
        {!loading ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Live
                fixtures={fixturesInProgress(teamFixtures ? teamFixtures : "")}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Recent
                fixtures={fixturesFinished(teamFixtures ? teamFixtures : "")}
              />
              <Upcoming
                fixtures={fixturesUpcoming(teamFixtures ? teamFixtures : "")}
              />
            </Box>
          </>
        ) : (
          <LinearProgress />
        )}
      </Layout>
    );
  } else {
    return <Typography>No Team Selected</Typography>;
  }
}
