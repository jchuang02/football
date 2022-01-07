import {
  Box,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFixtures,
  updateFixtures,
  updateLiveFixtures,
  updateLiveFixturesById,
  updateStandings,
} from "../actions";
import FixtureCard from "./FixtureCard";
import {
  fixtureEnding,
  fixtureFinished,
  fixtureInProgress,
  fixtureOnBreak,
} from "../helpers/fixtureHelper";
// import WindowFocusHandler from "./WindowFocusHandler";

export default function Fixtures() {
  const selectedLeague = useSelector((state) => state.selectedLeague);
  const fixtures = useSelector((state) => state.fixtures[selectedLeague]);
  const standings = useSelector((state) => state.standings[selectedLeague]);

  const dispatch = useDispatch();
  const twoWeeksAgo = new Date(Date.parse(new Date()) - 604800000 * 2)
    .toISOString()
    .substring(0, 10);
  const twoWeeksLater = new Date(Date.parse(new Date()) + 604800000 * 2)
    .toISOString()
    .substring(0, 10);

  useEffect(() => {
    //If no fixtures exist, fetch fixtures.
    if (fixtures === undefined) {
      
      dispatch(fetchFixtures(2021, selectedLeague, twoWeeksAgo, twoWeeksLater));
      //If it's been more than 24 hours since it has been updated.
    } else if (Date.now() - fixtures.lastUpdated >= 86400000) {
      dispatch(
        updateFixtures(2021, selectedLeague, twoWeeksAgo, twoWeeksLater)
      );
      //IF there are live fixtures stored and it has been more than 1 minute since a live update
    } else if (
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
      
      dispatch(
        updateFixtures(2021, selectedLeague, twoWeeksAgo, twoWeeksLater)
      );
    }
    // eslint-disable-next-line
  }, [selectedLeague]);

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
            
            dispatch(updateLiveFixtures(2021, selectedLeague));
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
            dispatch(updateLiveFixtures(2021, selectedLeague));
            
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
              dispatch(updateLiveFixtures(2021, selectedLeague));
              
            } else if (fixturesEnding.length > 0) {
              fixturesEnding.forEach(({ fixture }) => {
                
                dispatch(updateLiveFixturesById(fixture.id));
              });
            } else {
              dispatch(updateLiveFixtures(2021, selectedLeague));
              
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
        dispatch(updateStandings(selectedLeague, 2021));
      }
      return () => {
        
        clearTimeout(timer);
        clearTimeout(initializer);
      };
    }
  }, [
    selectedLeague,
    twoWeeksAgo,
    twoWeeksLater,
    dispatch,
    fixtures,
    standings
  ]);

  const showFixtures = () => {
    if (fixtures !== undefined) {
      const fixturesInProgress = fixtures.fixtureInfo.filter(({ fixture }) => {
        return fixtureInProgress(fixture.status.short);
      });
      const fixturesFinished = fixtures.fixtureInfo.filter(({ fixture }) => {
        return fixtureFinished(fixture.status.short);
      });
      return (
        <>
        {/* <WindowFocusHandler /> */}
          <Container
            sx={!fixturesInProgress.length > 0 ? { display: "none" } : {}}
          >
            <Typography variant="h5">Live Matches</Typography>
            <Container
              sx={{
                display: "flex",
                textAlign: "center",
                overflowX: "auto",
              }}
            >
              {fixturesInProgress.map((fixture) => {
                return (
                  <FixtureCard fixture={fixture} key={fixture.fixture.id} />
                );
              })}
            </Container>
          </Container>
          <Container>
            <Typography variant="h5">Upcoming Matches</Typography>
            <Container
              sx={{
                display: "flex",
                textAlign: "center",
                overflowX: "auto",
              }}
            >
              {fixtures.fixtureInfo.filter((fixture) => {
                return (
                  !fixtureInProgress(fixture.fixture.status.short) &&
                  !fixtureFinished(fixture.fixture.status.short)
                );
              }).length > 0 ? (
                fixtures.fixtureInfo
                  .filter((fixture) => {
                    return (
                      !fixtureInProgress(fixture.fixture.status.short) &&
                      !fixtureFinished(fixture.fixture.status.short) &&
                      fixture.fixture.timestamp * 1000 - Date.now() > 0
                    );
                  })
                  .sort((fixtureOne, fixtureTwo) => {
                    return (
                      fixtureOne.fixture.timestamp -
                      fixtureTwo.fixture.timestamp
                    );
                  })
                  .map((fixture) => {
                    return (
                      <FixtureCard fixture={fixture} key={fixture.fixture.id} />
                    );
                  })
              ) : (
                <Typography>No Upcoming Matches</Typography>
              )}
            </Container>
                <Typography variant="h5">Previous Matches</Typography>
                <Container
                  sx={{
                    display: "flex",
                    textAlign: "center",
                    overflowX: "auto",
                  }}
                >
                  {fixturesFinished.length > 0 ? (
                    fixturesFinished
                      .sort((fixtureOne, fixtureTwo) => {
                        return (
                          fixtureTwo.fixture.timestamp -
                          fixtureOne.fixture.timestamp
                        );
                      })
                      .map((fixture) => {
                        return (
                          <FixtureCard
                            fixture={fixture}
                            key={fixture.fixture.id}
                          />
                        );
                      })
                  ) : (
                    <Typography>No previous matches available</Typography>
                  )}
                </Container>
              {/* </AccordionDetails>
            </Accordion> */}
          </Container>
        </>
      );
    } else {
      return (
        <Box sx={{ display: "flex", padding: "4rem" }}>
          <CircularProgress />
        </Box>
      );
    }
  };
  return showFixtures();
}
