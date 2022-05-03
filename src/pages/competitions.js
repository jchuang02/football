import React, { lazy, Suspense, useEffect, useMemo } from "react";
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
  matchesInProgress,
  matchesFinished,
  matchesUpcoming,
  matchesToday,
} from "../helpers/matchesHelper";
import {
  matchInProgress,
  matchFinished,
  matchEnding,
  matchOnBreak,
} from "../helpers/matchStatusHelper";
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
  const matches = useSelector((state) => state.fixtures);
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
    return Object.values(matches).filter((match) => {
      return (
        Number(match.league.id) === selectedLeague &&
        match.fixture.timestamp * 1000 - Date.now() < 30 * 86400000 &&
        match.fixture.timestamp * 1000 - Date.now() > -30 * 86400000
      );
    });
  }, [matches, selectedLeague]);

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
      const todaysMatches = matchesToday(competitionMatches).filter(
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

  //If live matches are present in matches, update them.
  useEffect(() => {
    if (competitionMatches.length) {
      if (
        competitionMatches.filter((match) => {
          return (
            matchInProgress(match.fixture.status.short) &&
            !matchOnBreak(match.fixture.status.short) &&
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
      const allMatchesToday = matchesToday(competitionMatches) || [];
      let startUpdateTimes = allMatchesToday.map((match) => {
        return match.fixture.timestamp * 1000 - Date.now();
      });
      startUpdateTimes = [...new Set(startUpdateTimes)];
      startUpdateTimes = startUpdateTimes.filter((time) => {
        return time > 0;
      });
      //If a game is starting later, start a timer to start updating live matches when the game begins.
      if (
        startUpdateTimes.length > 0 &&
        !matchesInProgress(allMatchesToday).length > 0
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
  }, [dispatch, matches]);

  //For matches happening soon or now
  let delay = 60000;
  useInterval(() => {
    if (
      matchesToday(competitionMatches).filter((match) => {
        return match.fixture.status.short === "NS";
      }).length &&
      !competitionMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = matchesToday(competitionMatches);
      let startUpdateTimes = allMatchesToday.map((match) => {
        return match.fixture.timestamp * 1000 - Date.now();
      });
      startUpdateTimes = [...new Set(startUpdateTimes)];
      startUpdateTimes = startUpdateTimes.filter((time) => {
        return time > 0;
      });
      const continueUpdates = startUpdateTimes.filter((time) => {
        return time <= 0 && time >= -(60000 * 5);
      });
      const allMatchesOnBreak = competitionMatches.filter((match) => {
        return match.fixture.status.short === "HT" && match.fixture.status.elapsed === 45;
      });
      const allMatchesEnding = competitionMatches.filter((match) => {
        return matchEnding(match.fixture.status.elapsed, match.fixture.status.short);
      });
      const allMatchesInProgress = matchesInProgress(competitionMatches);
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
          return matchFinished(match.fixture.status.short);
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
  //When matches are all on break
  useInterval(() => {
    if (
      matchesToday(competitionMatches).filter((match) => {
        return match.fixture.status.short === "HT";
      }).length &&
      !competitionMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesOnBreak = competitionMatches.filter((match) => {
        return match.fixture.status.short === "HT" && match.fixture.status.elapsed === 45;
      });
      const allMatchesInProgress = matchesInProgress(competitionMatches);
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
              matches={matchesInProgress(
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
              matches={matchesFinished(
                competitionMatches ? competitionMatches : ""
              )}
            />
            <Upcoming
              matches={matchesUpcoming(
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
