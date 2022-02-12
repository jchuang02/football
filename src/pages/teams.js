import React, { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTeamFixtures,
  updateTeamFixtures,
  updateLiveTeamFixtures,
  updateLiveTeamFixturesById,
} from "../actions";
import {
  fixtureInProgress,
  fixtureEnding,
  fixtureOnBreak,
} from "../helpers/fixtureStatusHelper";
import Upcoming from "../components/Matches/Upcoming";
import Recent from "../components/Matches/Recent";
import Live from "../components/Matches/Live";
import Layout from "../components/layout";
import {
  fixturesInProgress,
  fixturesUpcoming,
  fixturesFinished,
} from "../helpers/fixturesHelper";

export default function Teams() {
  const dispatch = useDispatch();
  const teams = useSelector((state) => state.teams);
  const selectedTeam = useSelector((state) => state.selectedTeam);
  const fixtures = useSelector((state) => state.teamFixtures[selectedTeam]);

  useEffect(() => {
    if (!fixtures) {
      dispatch(fetchTeamFixtures(selectedTeam, 2021));
      //If it's been more than 24 hours since fixtures have been updated.
    } else if (Date.now() - fixtures.lastUpdated >= 86400000) {
      dispatch(updateTeamFixtures(selectedTeam, 2021));
    }
  });

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
        dispatch(updateTeamFixtures(selectedTeam, 2021));
      }
    }
    // eslint-disable-next-line
  }, [selectedTeam]);

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
            dispatch(updateLiveTeamFixtures(selectedTeam, 2021));
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
            dispatch(updateLiveTeamFixtures(selectedTeam, 2021));
          }, 60000 * 5.1);
          //Replace arbitrary value
        } else {
          timer = setTimeout(() => {
            if (
              fixturesEnding.length > 0 &&
              fixturesEnding.length < fixturesInProgress.length
            ) {
              fixturesEnding.forEach(({ fixture }) => {
                dispatch(updateLiveTeamFixturesById(fixture.id));
              });
              dispatch(updateLiveTeamFixtures(selectedTeam, 2021));
            } else if (fixturesEnding.length > 0) {
              fixturesEnding.forEach(({ fixture }) => {
                dispatch(updateLiveTeamFixturesById(fixture.id));
              });
            } else {
              dispatch(updateLiveTeamFixtures(selectedTeam, 2021));
            }
          }, 60000);
        }
        //If all fixtures have been played, update Standings after an hour.
      }
      //   else if (
      //     todaysFixtures.length > 0 &&
      //     todaysFixtures.filter(({ fixture }) => {
      //       return fixtureFinished(fixture.status.short);
      //     }).length === todaysFixtures.length &&
      //     standings &&
      //     Date.now() - standings.lastUpdated >= 60000 * 60
      //   ) {
      //     dispatch(updateStandings(selectedLeague, 2021));
      //   }
      return () => {
        clearTimeout(timer);
        clearTimeout(initializer);
      };
    }
  }, [selectedTeam, dispatch, fixtures]);

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
        {selectedTeam ? (
          <>
            <Live
              fixtures={fixturesInProgress(
                fixtures ? fixtures.fixtureInfo : ""
              )}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
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
          </>
        ) : (
          ""
        )}
      </Layout>
    );
  } else {
    return <CircularProgress />;
  }
}
