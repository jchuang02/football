import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, LinearProgress, Typography } from "@mui/material";
import Standings from "../components/Standings";
import Layout from "../components/layout";
import {
  updateLiveFixtures,
  updateLiveFixturesById,
  fetchFixtures,
  updateFixtures,
} from "../actions/fixtures";
import { fetchStandings, updateStandings } from "../actions/standings";

import {
  fixturesInProgress,
  fixturesFinished,
  fixturesUpcoming,
} from "../helpers/fixturesHelper";
import {
  fixtureInProgress,
  fixtureFinished,
  fixtureEnding,
  fixtureOnBreak,
} from "../helpers/fixtureStatusHelper";
import Live from "../components/Matches/Live";
import Upcoming from "../components/Matches/Upcoming";
import Recent from "../components/Matches/Recent";

export default function Competitions() {
  const dispatch = useDispatch();
  const now = new Date();
  const [loading, setLoading] = useState(false);
  const leagues = useSelector((state) => state.leagues);
  const selectedLeague = useSelector((state) => state.selectedLeague);
  const fixtures = useSelector((state) => state.fixtures[selectedLeague]);
  const current = useSelector((state) => {
    if (leagues && selectedLeague) {
      let currentSeason = state.leagues[selectedLeague].leagueInfo.seasons.find(
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

  useEffect(() => {
    setLoading(true);
    const pageLoading = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(pageLoading);
    };
  }, [fixtures, standings]);

  useEffect(() => {
    if (selectedLeague) {
      if (standings === undefined) {
        dispatch(fetchStandings(selectedLeague, current));
      } else if (Date.now() - standings.lastUpdated >= 86400000) {
        dispatch(updateStandings(selectedLeague, current));
      }
    }
  }, [dispatch, standings, selectedLeague, current]);

  useEffect(() => {
    if (!fixtures) {
      if (selectedLeague) {
        dispatch(fetchFixtures(current, selectedLeague));
        //If it's been more than 24 hours since fixtures have been updated.
      } else if (fixtures && Date.now() - fixtures.lastUpdated >= 86400000) {
        dispatch(updateFixtures(current, selectedLeague));
      }
    }
  }, [dispatch, current, fixtures, selectedLeague]);

  //If live fixtures are present in fixtures, update them.
  useEffect(() => {
    if (fixtures) {
      if (
        (fixtures.fixtureInfo.filter(({ fixture }) => {
          return (
            fixtureInProgress(fixture.status.short) &&
            !fixtureOnBreak(fixture.status.short)
          );
        }).length > 0 &&
          Date.now() - fixtures.lastUpdated >= 60000) ||
        fixtures.fixtureInfo
          .filter(({ fixture }) => {
            return fixture.timestamp * 1000 - Date.now() < 0;
          })
          .filter(({ fixture }) => {
            return fixture.status.short === "NS";
          }).length > 0
      ) {
        dispatch(updateFixtures(current, selectedLeague));
      }
    }
  }, [selectedLeague, dispatch, fixtures, current]);

  //For matches starting later today
  useEffect(() => {
    if (fixtures !== undefined) {
      const fixturesInProgress = fixtures.fixtureInfo.filter(({ fixture }) => {
        return fixtureInProgress(fixture.status.short);
      });
      const fixturesEnding = fixtures.fixtureInfo.filter(({ fixture }) => {
        return fixtureEnding(fixture.status.elapsed, fixture.status.short);
      });

      //Identifies fixtures happening today.
      const todaysFixtures = fixtures.fixtureInfo.filter(({ fixture }) => {
        return fixture.timestamp * 1000 - Date.now() <= 60000 * 60 * 24;
      });
      let initializer;
      let timer;
      let startUpdateTimes = todaysFixtures.map(({ fixture }) => {
        return fixture.timestamp * 1000 - Date.now();
      });
      //Removes duplicate start times
      startUpdateTimes = [...new Set(startUpdateTimes)];
      startUpdateTimes = startUpdateTimes.filter((time) => {
        return time > 0;
      });

      const continueUpdates = startUpdateTimes.filter((time) => {
        return time <= 0 && time >= -(60000 * 5);
      });

      //If a game is starting later, start a timer to start updating live fixtures when the game begins.
      if (startUpdateTimes.length > 0 && !fixturesInProgress > 0) {
        startUpdateTimes.forEach((timeUntil) => {
          initializer = setTimeout(() => {
            dispatch(updateLiveFixtures(current, selectedLeague));
          }, timeUntil);
        });
      }

      //Updates live fixtures every minute until all live fixtures are finished.

      //Checks if any fixtures are live or starting.
      if (fixturesInProgress.length > 0 || continueUpdates.length > 0) {
        //Fixtures in the halftime break
        const fixturesBreak = fixtures.fixtureInfo.filter(({ fixture }) => {
          return fixture.status.short === "HT" && fixture.status.elapsed === 45;
        });
        if (
          fixturesBreak.length > 0 &&
          fixturesBreak.length === fixturesInProgress.length
        ) {
          timer = setTimeout(() => {
            dispatch(updateLiveFixtures(current, selectedLeague));
          }, 60000 * 5.1);
          //Replace arbitrary value
        } else {
          timer = setTimeout(() => {
            if (
              fixturesEnding.length > 0 &&
              fixturesEnding.length < fixturesInProgress.length
            ) {
              fixturesEnding.forEach(({ fixture }) => {
                dispatch(updateLiveFixturesById(fixture.id));
              });
              dispatch(updateLiveFixtures(current, selectedLeague));
            } else if (fixturesEnding.length > 0) {
              fixturesEnding.forEach(({ fixture }) => {
                dispatch(updateLiveFixturesById(fixture.id));
              });
            } else {
              dispatch(updateLiveFixtures(current, selectedLeague));
            }
          }, 60000);
        }
        //If all fixtures have been played, update Standings after an hour.
      } else if (
        todaysFixtures.length > 0 &&
        todaysFixtures.filter(({ fixture }) => {
          return fixtureFinished(fixture.status.short);
        }).length === todaysFixtures.length &&
        standings &&
        Date.now() - standings.lastUpdated >= 60000 * 60
      ) {
        dispatch(updateStandings(selectedLeague, current));
      }
      return () => {
        clearTimeout(timer);
        clearTimeout(initializer);
      };
    }
  }, [selectedLeague, dispatch, fixtures, standings, current]);

  if (leagues) {
    return (
      <Layout>
        {!selectedLeague ? (
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
                fixtures={fixturesInProgress(
                  fixtures ? fixtures.fixtureInfo : ""
                )}
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
                fixtures={fixturesFinished(
                  fixtures ? fixtures.fixtureInfo : ""
                )}
              />
              <Upcoming
                fixtures={fixturesUpcoming(
                  fixtures ? fixtures.fixtureInfo : ""
                )}
              />
            </Box>

            <Standings selectedLeague={selectedLeague} />
          </>
        ) : (
          <LinearProgress />
        )}
      </Layout>
    );
  } else {
    return <Typography>No Competitions Selected</Typography>;
  }
}
