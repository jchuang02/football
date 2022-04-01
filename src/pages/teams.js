import React, { lazy, Suspense, useEffect, useState, useMemo } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { Box, Container, CircularProgress, Typography } from "@mui/material";

//Actions
import {
  fetchTeamFixtures,
  updateTeamFixtures,
  updateAllLiveFixtures,
  updateLiveTeamFixturesById,
} from "../actions/fixtures";
import { updateStandings } from "../actions/standings";
import { fetchTeamLeagues, updateTeamLeagues } from "../actions/teamLeagues";

//Helpers
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

//Hooks
import useInterval from "../hooks/useInterval";

//Components
import Layout from "../components/layout";
const Standings = lazy(() => import("../components/Standings/Standings"));
const Live = lazy(() => import("../components/Matches/Live"));
const Upcoming = lazy(() => import("../components/Matches/Upcoming"));
const Recent = lazy(() => import("../components/Matches/Recent"));
const Selector = lazy(() => import("../components/Selector"));

const renderLoader = () => (
  <Container>
    <CircularProgress />
  </Container>
);

export default function Teams() {
  const isSSR = typeof window === "undefined";
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  const leagues = useSelector((state) => state.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const selectedTeam = useSelector((state) => state.selectedTeam);
  const fixtures = useSelector((state) => state.fixtures);
  const standings = useSelector((state) => state.standings);

  const now = new Date();
  const teamLeagues = useMemo(() => {
    if (Object.values(leagues).length) {
      return Object.values(leagues).filter((league) => {
        return league.team.includes(selectedTeam);
      });
    } else {
      return [];
    }
  }, [leagues, selectedTeam]);

  const selectorItems = useMemo(() => {
    if (teamLeagues.length) {
      return teamLeagues.map(({ league }) => {
        return {
          id: league.league.id,
          name: league.league.name,
          logo: league.league.logo,
          country: league.country.name,
          flag: league.country.flag,
        };
      });
    } else {
      return [];
    }
  }, [teamLeagues]);

  const [selected, setSelected] = useState(
    selectorItems[0] ? selectorItems[0].id : 0
  );

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

  const teamMatches = useMemo(() => {
    return Object.values(fixtures).filter((match) => {
      return (
        Number(match.teams.away.id) === selectedTeam ||
        Number(match.teams.home.id) === selectedTeam
      );
    });
  }, [fixtures, selectedTeam]);

  //Get league information if it does not exist and update it if updated more than a day ago.
  useEffect(() => {
    if (teamLeagues.length === 0 && selectedTeam) {
      dispatch(fetchTeamLeagues(selectedTeam));
    } else {
      teamLeagues.forEach((league) => {
        if (Date.now() - league.lastUpdated >= 86400000) {
          dispatch(updateTeamLeagues(selectedTeam));
        }
      });
    }
  }, [dispatch, selectedTeam, teamLeagues]);

  //If no matches are present for the selected team, fetch them.
  useEffect(() => {
    if (teamMatches.length === 0 && selectedTeam) {
      dispatch(fetchTeamFixtures(selectedTeam, current));
    } else {
      const needsUpdate = teamMatches.filter((match) => {
        return Date.now() - match.lastUpdated >= 86400000;
      });
      if (teamMatches.length) {
        const todaysMatches = fixturesToday(teamMatches).filter((match) => {
          return (
            match.fixture.status.short === "NS" &&
            match.fixture.timestamp * 1000 - Date.now() < 0
          );
        });
        if (needsUpdate.length || todaysMatches.length > 0) {
          dispatch(updateTeamFixtures(selectedTeam, current));
        }
      }
    }
  }, [dispatch, current, selectedTeam]);

  //If live fixtures are present in fixtures, update them.
  useEffect(() => {
    if (teamMatches.length) {
      if (
        teamMatches.filter((match) => {
          return (
            fixtureInProgress(match.fixture.status.short) &&
            !fixtureOnBreak(match.fixture.status.short) &&
            Date.now() - match.lastUpdated >= 60000
          );
        }).length > 0 ||
        teamMatches.filter((match) => {
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
      !teamMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = fixturesToday(teamMatches) || [];
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
  }, [dispatch, teamMatches]);

  //For matches happening soon or now
  let delay = 60000;
  useInterval(() => {
    if (
      fixturesToday(teamMatches).filter((match) => {
        return match.fixture.status.short === "NS";
      }).length &&
      !teamMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = fixturesToday(teamMatches) || [];
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
      const allMatchesOnBreak = teamMatches.filter(({ fixture }) => {
        return fixture.status.short === "HT" && fixture.status.elapsed === 45;
      });
      const allMatchesEnding = teamMatches.filter(({ fixture }) => {
        return fixtureEnding(fixture.status.elapsed, fixture.status.short);
      });
      const allMatchesInProgress = fixturesInProgress(teamMatches);
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
      fixturesToday(teamMatches).filter((match) => {
        return match.fixture.status.short === "HT";
      }).length &&
      !teamMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesOnBreak = teamMatches.filter(({ fixture }) => {
        return fixture.status.short === "HT" && fixture.status.elapsed === 45;
      });
      const allMatchesInProgress = fixturesInProgress(teamMatches);
      if (allMatchesOnBreak.length === allMatchesInProgress.length) {
        console.log("Match at halftime break. Staggering updates");
        dispatch(updateAllLiveFixtures());
      }
    }
  }, breakDelay);

  if (teams && !isSSR) {
    return (
      <Layout>
        <Suspense fallback={renderLoader()}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Live
              fixtures={fixturesInProgress(teamMatches ? teamMatches : "")}
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
              fixtures={fixturesFinished(teamMatches ? teamMatches : "")}
            />
            <Upcoming
              fixtures={fixturesUpcoming(teamMatches ? teamMatches : "")}
            />
          </Box>
          {Object.keys(leagues).length ? (
            <>
              <Selector
                selected={selected}
                setSelected={setSelected}
                items={selectorItems}
              />
              <Standings selectedLeague={selected} />
            </>
          ) : (
            ""
          )}
        </Suspense>
      </Layout>
    );
  } else {
    return <Typography>No Team Selected</Typography>;
  }
}
