import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, LinearProgress, Typography } from "@mui/material";
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
import {
  fixturesInProgress,
  fixturesUpcoming,
  fixturesFinished,
} from "../helpers/fixturesHelper";
import Upcoming from "../components/Matches/Upcoming";
import Recent from "../components/Matches/Recent";
import Live from "../components/Matches/Live";
import Layout from "../components/layout";
import { fetchTeamLeagues, updateTeamLeagues } from "../actions/teamLeagues";

export default function Teams() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const teams = useSelector((state) => state.teams);
  const selectedTeam = useSelector((state) => state.selectedTeam);
  const teamLeagues = useSelector((state) => state.teamLeagues);
  const teamFixtures = useSelector((state) => state.teamFixtures[selectedTeam]);
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
  }, [teamFixtures]);

  useEffect(() => {
    if (!teamLeagues[selectedTeam]) {
      dispatch(fetchTeamLeagues(selectedTeam));
    } else if (Date.now() - teamLeagues[selectedTeam].lastUpdated >= 86400000) {
      dispatch(updateTeamLeagues(selectedTeam));
    }
  }, [dispatch, selectedTeam, teamLeagues]);

  useEffect(() => {
    if (!teamFixtures && selectedTeam) {
      dispatch(fetchTeamFixtures(selectedTeam, current));
      //If it's been more than 24 hours since fixtures have been updated.
    } else if (teamFixtures && Date.now() - teamFixtures.lastUpdated >= 86400000) {
      dispatch(updateTeamFixtures(selectedTeam, current));
    }
  }, [dispatch, current, teamFixtures, selectedTeam]);

  //If live fixtures are present in fixtures, update them.
  useEffect(() => {
    if (teamFixtures) {
      if (
        (teamFixtures.fixtureInfo.filter(({ fixture }) => {
          return (
            fixtureInProgress(fixture.status.short) &&
            !fixtureOnBreak(fixture.status.short)
          );
        }).length > 0 &&
          Date.now() - teamFixtures.lastUpdated >= 60000) ||
        teamFixtures.fixtureInfo
          .filter(({ fixture }) => {
            return fixture.timestamp * 1000 - Date.now() < 0;
          })
          .filter(({ fixture }) => {
            return fixture.status.short === "NS";
          }).length > 0
      ) {
        dispatch(updateTeamFixtures(selectedTeam, current));
      }
    }
  }, [selectedTeam, teamFixtures, dispatch, current]);

  //For matches starting later today
  useEffect(() => {
    if (teamFixtures !== undefined) {
      const fixturesInProgress = teamFixtures.fixtureInfo.filter(
        ({ fixture }) => {
          return fixtureInProgress(fixture.status.short);
        }
      );
      const fixturesEnding = teamFixtures.fixtureInfo.filter(({ fixture }) => {
        return fixtureEnding(fixture.status.elapsed, fixture.status.short);
      });

      //Identifies fixtures happening today.
      const todaysFixtures = teamFixtures.fixtureInfo.filter(({ fixture }) => {
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
            dispatch(updateLiveTeamFixtures(selectedTeam, current));
          }, timeUntil);
        });
      }

      //Updates live fixtures every minute until all live fixtures are finished.

      //Checks if any fixtures are live or starting.
      if (fixturesInProgress.length > 0 || continueUpdates.length > 0) {
        //Fixtures in the halftime break
        const fixturesBreak = teamFixtures.fixtureInfo.filter(({ fixture }) => {
          return fixture.status.short === "HT" && fixture.status.elapsed === 45;
        });
        if (
          fixturesBreak.length > 0 &&
          fixturesBreak.length === fixturesInProgress.length
        ) {
          timer = setTimeout(() => {
            dispatch(updateLiveTeamFixtures(selectedTeam, current));
          }, 60000 * 5.1);
          //Replace arbitrary value
        } else {
          timer = setTimeout(() => {
            if (
              fixturesEnding.length > 0 &&
              fixturesEnding.length < fixturesInProgress.length
            ) {
              fixturesEnding.forEach(({ fixture }) => {
                dispatch(updateLiveTeamFixturesById(fixture.id, selectedTeam));
              });
              dispatch(updateLiveTeamFixtures(selectedTeam, current));
            } else if (fixturesEnding.length > 0) {
              fixturesEnding.forEach(({ fixture }) => {
                dispatch(updateLiveTeamFixturesById(fixture.id, selectedTeam));
              });
            } else {
              dispatch(updateLiveTeamFixtures(selectedTeam, current));
            }
          }, 60000);
        }
      }
      return () => {
        clearTimeout(timer);
        clearTimeout(initializer);
      };
    }
  }, [selectedTeam, dispatch, teamFixtures, current]);

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
                fixtures={fixturesInProgress(
                  teamFixtures ? teamFixtures.fixtureInfo : ""
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
                  teamFixtures ? teamFixtures.fixtureInfo : ""
                )}
              />
              <Upcoming
                fixtures={fixturesUpcoming(
                  teamFixtures ? teamFixtures.fixtureInfo : ""
                )}
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
