import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  useMediaQuery,
  Box,
  Container,
  CircularProgress,
  Typography,
} from "@mui/material";

import Layout from "../components/layout";
import {
  updateAllLiveFixtures,
  updateLiveFixturesById,
  fetchFixtures,
  updateFixtures,
} from "../state/actions/fixtures";
import { fetchStandings, updateStandings } from "../state/actions/standings";

import {
  fixturesInProgress,
  fixturesFinished,
  fixturesUpcoming,
  fixturesToday,
} from "../helpers/fixturesHelper";
import {
  fixtureInProgress,
  fixtureFinished,
  fixtureEnding,
  fixtureOnBreak,
} from "../helpers/fixtureStatusHelper";
import useInterval from "../hooks/useInterval";
const Standings = lazy(() => import("../components/Standings/Standings"));
const Live = lazy(() => import("../components/Matches/Live"));
const Upcoming = lazy(() => import("../components/Matches/Upcoming"));
const Recent = lazy(() => import("../components/Matches/Recent"));

const renderLoader = () => (
  <Container>
    <CircularProgress />
  </Container>
);

export default function Competitions() {
  const desktop = useMediaQuery("(min-width: 1600px");

  const dispatch = useDispatch();
  const now = new Date();
  const leagues = useSelector((state) => state.leagues);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const selectedLeague = useSelector((state) => state.selectedLeague);
  const fixtures = useSelector((state) => state.fixtures);
  const current = useSelector((state) => {
    if (leagues && selectedLeague) {
      let currentSeason = state.leagues[selectedLeague].league.seasons.find(
        (season) => {
          return season.current;
        }
      );
      return currentSeason.year;
    } else {
      return now.getFullYear();
    }
  });
  const standings = useSelector((state) => state.standings[selectedLeague]);
  const competitionMatches = useMemo(() => {
    return Object.values(fixtures).filter((match) => {
      return (
        Number(match.league.id) === selectedLeague &&
        match.fixture.timestamp * 1000 - Date.now() < 30 * 86400000 &&
        match.fixture.timestamp * 1000 - Date.now() > -30 * 86400000
      );
    });
  }, [fixtures, selectedLeague]);

  const needsUpdates = useMemo(() => {
    return competitionMatches.filter((match) => {
      return (
        Number(match.league.id) === selectedLeague &&
        Date.now() - match.lastUpdated >= 86400000
      );
    });
  }, [competitionMatches, selectedLeague]);

  //Get league information if it does not exist and update it if updated more than a day ago.
  useEffect(() => {
    if (selectedLeague) {
      if (standings === undefined) {
        dispatch(fetchStandings(selectedLeague, current));
      } else if (Date.now() - standings.lastUpdated >= 86400000) {
        dispatch(updateStandings(selectedLeague, current));
      }
    }
  }, []);

  //If no matches present for the selected competition, fetch them.
  useEffect(() => {
    if (!competitionMatches.length && selectedLeague) {
      dispatch(fetchFixtures(current, selectedLeague));
    } else {
      const todaysMatches = fixturesToday(competitionMatches).filter(
        (match) => {
          return (
            match.fixture.status.short === "NS" &&
            match.fixture.timestamp * 1000 - Date.now() < 0
          );
        }
      );
      if (needsUpdates.length || todaysMatches.length > 0) {
        dispatch(updateFixtures(current, selectedLeague));
      }
    }
  }, []);

  //If live matches are present in fixtures, update them.
  useEffect(() => {
    if (competitionMatches.length) {
      if (
        competitionMatches.filter((match) => {
          return (
            fixtureInProgress(match.fixture.status.short) &&
            !fixtureOnBreak(match.fixture.status.short) &&
            Date.now() - match.lastUpdated >= 60000
          );
        }).length > 0 ||
        competitionMatches.filter((match) => {
          return (
            match.fixture.timestamp * 1000 - Date.now() < 0 &&
            match.fixture.status.short === "NS" &&
            Date.now() - match.lastUpdated >= 60000
          );
        }).length > 0
      ) {
        dispatch(updateFixtures(current, selectedLeague));
      }
    }
  }, []);

  // For matches starting later today
  useEffect(() => {
    let timer;
    if (
      !competitionMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = fixturesToday(competitionMatches) || [];
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
      fixturesToday(competitionMatches).filter((match) => {
        return match.fixture.status.short === "NS";
      }).length &&
      !competitionMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = fixturesToday(competitionMatches);
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
      const allMatchesOnBreak = competitionMatches.filter(({ fixture }) => {
        return fixture.status.short === "HT" && fixture.status.elapsed === 45;
      });
      const allMatchesEnding = competitionMatches.filter(({ fixture }) => {
        return fixtureEnding(fixture.status.elapsed, fixture.status.short);
      });
      const allMatchesInProgress = fixturesInProgress(competitionMatches);
      if (
        (allMatchesInProgress.length > 0 || continueUpdates.length > 0) &&
        !allMatchesOnBreak.length !== allMatchesInProgress.length
      ) {
        if (
          allMatchesEnding.length > 0 &&
          allMatchesEnding.length < allMatchesInProgress.length
        ) {
          allMatchesEnding.forEach((match) => {
            dispatch(updateLiveFixturesById(match.fixture.id, match.league.id));
          });
          dispatch(updateAllLiveFixtures());
          //If all matches are ending
        } else if (
          allMatchesEnding.length > 0 &&
          allMatchesEnding.length === allMatchesInProgress.length
        ) {
          allMatchesEnding.forEach((match) => {
            dispatch(updateLiveFixturesById(match.fixture.id, match.league.id));
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
              return followedLeagues.includes(match.league.id);
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
      fixturesToday(competitionMatches).filter((match) => {
        return match.fixture.status.short === "HT";
      }).length &&
      !competitionMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesOnBreak = competitionMatches.filter(({ fixture }) => {
        return fixture.status.short === "HT" && fixture.status.elapsed === 45;
      });
      const allMatchesInProgress = fixturesInProgress(competitionMatches);
      if (allMatchesOnBreak.length === allMatchesInProgress.length) {
        dispatch(updateAllLiveFixtures());
      }
    }
  }, breakDelay);

  if (leagues) {
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
              fixtures={fixturesInProgress(
                competitionMatches ? competitionMatches : ""
              )}
            />
          </Box>

          <Box
            sx={
              desktop
                ? {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }
                : {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                  }
            }
          >
            <Recent
              fixtures={fixturesFinished(
                competitionMatches ? competitionMatches : ""
              )}
            />
            <Upcoming
              fixtures={fixturesUpcoming(
                competitionMatches ? competitionMatches : ""
              )}
            />
          </Box>

          <Standings selectedLeague={selectedLeague} />
        </Suspense>
      </Layout>
    );
  } else {
    return <Typography>No Competitions Selected</Typography>;
  }
}
