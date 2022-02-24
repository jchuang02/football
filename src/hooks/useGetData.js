import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFixtures,
  updateFixtures,
  updateLiveFixtures,
  updateLiveFixturesById,
  updateLiveTeamFixtures,
  updateLiveTeamFixturesById,
  fetchTeamFixtures,
  updateTeamFixtures,
} from "../actions/fixtures";
import { fetchStandings, updateStandings } from "../actions/standings";
import {
  fixtureInProgress,
  fixtureOnBreak,
  fixtureEnding,
  fixtureFinished,
} from "../helpers/fixtureStatusHelper";
import {
  fixturesUpcoming,
  fixturesFinished,
  fixturesInProgress,
} from "../helpers/fixturesHelper";

export default function useGetData() {
  const dispatch = useDispatch();
  const [allFixtures, setAllFixtures] = useState([]);
  const leagues = useSelector((state) => state.leagues);
  const teamLeagues = useSelector((state) => state.teamLeagues);
  const teams = useSelector((state) => state.teams);
  const fixtures = useSelector((state) => state.fixtures);
  const teamFixtures = useSelector((state) => state.teamFixtures);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const standings = useSelector((state) => state.standings);

  //Rebuilds all fixtures whenever team fixtures or league fixtures change.
  useEffect(() => {
    const theTeamFixtures = Object.values(teamFixtures).map((team) => {
      return team.fixtureInfo;
    });
    const leagueFixtures = Object.values(fixtures).map((league) => {
      return league.fixtureInfo;
    });
    let tempFixtures = [];
    for (let i = 0; i < theTeamFixtures.length; i++) {
      fixturesUpcoming(theTeamFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
      fixturesInProgress(theTeamFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
      fixturesFinished(theTeamFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
    }

    for (let i = 0; i < leagueFixtures.length; i++) {
      fixturesUpcoming(leagueFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
      fixturesInProgress(leagueFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
      fixturesFinished(leagueFixtures[i])
        .splice(0, 5)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
    }

    //Filters all unique fixture objects available
    const allUniqFixtures = tempFixtures.filter(
      (fixture, index) =>
        tempFixtures.findIndex(
          (obj) => obj.fixture.id === fixture.fixture.id
        ) === index
    );
    setAllFixtures(allUniqFixtures);
  }, [teamFixtures, fixtures]);

  //get standings info
  useEffect(() => {
    followedLeagues.forEach((league) => {
      if (leagues[league]) {
        const now = new Date();
        const currentSeason =
          leagues[league].leagueInfo.seasons.find((season) => {
            return season.current;
          }).year || now.getFullYear();
        if (!standings[league]) {
          dispatch(fetchStandings(league, currentSeason));
        } else if (Date.now() - standings[league].lastUpdated >= 86400000) {
          dispatch(updateStandings(league, currentSeason));
        }
      }
    });
  }, [followedLeagues, dispatch, leagues, standings]);

  //get team fixture info.
  useEffect(() => {
    followedTeams.forEach((team) => {
      if (teamLeagues[team]) {
        let currentSeasons = teamLeagues[team].leagueInfo.map((league) => {
          return league.seasons[0].year;
        });
        let currentYear = 0;
        currentSeasons.forEach((season) => {
          currentYear = Math.max(season, currentYear);
        });
        if (!teamFixtures[team]) {
          dispatch(fetchTeamFixtures(team, currentYear));
        } else if (Date.now() - teamFixtures[team].lastUpdated >= 86400000) {
          dispatch(updateTeamFixtures(team, currentYear));
        }
      }
    });
  }, [followedTeams, dispatch, teamFixtures, teamLeagues]);

  //get league fixtures info.
  useEffect(() => {
    followedLeagues.forEach((league) => {
      if (leagues[league]) {
        const now = new Date();
        let currentSeason =
          leagues[league].leagueInfo.seasons.find((season) => {
            return season.current;
          }).year || now.getFullYear();
        if (!fixtures[league]) {
          dispatch(fetchFixtures(currentSeason, league));
          //If it's been more than 24 hours since fixtures have been updated.
        } else if (Date.now() - fixtures[league].lastUpdated >= 86400000) {
          dispatch(updateFixtures(currentSeason, league));
        }
      }
    });
  }, [followedLeagues, dispatch, fixtures, leagues]);

  //If live team fixtures are present, update them.
  useEffect(() => {
    followedTeams.forEach((team) => {
      if (teamLeagues[team] && teamFixtures[team]) {
        let currentSeasons = teamLeagues[team].leagueInfo.map((league) => {
          return league.seasons[0].year;
        });
        let currentYear = 0;
        currentSeasons.forEach((season) => {
          currentYear = Math.max(season, currentYear);
        });
        if (
          (teamFixtures[team].fixtureInfo.filter(({ fixture }) => {
            return (
              fixtureInProgress(fixture.status.short) &&
              !fixtureOnBreak(fixture.status.short)
            );
          }).length > 0 &&
            Date.now() - teamFixtures[team].lastUpdated >= 60000) ||
          teamFixtures[team].fixtureInfo
            .filter(({ fixture }) => {
              return fixture.timestamp * 1000 - Date.now() < 0;
            })
            .filter(({ fixture }) => {
              return fixture.status.short === "NS";
            }).length > 0
        ) {
          dispatch(updateTeamFixtures(team, currentYear));
        }
      }
    });
  }, [dispatch, teamFixtures, teamLeagues, standings, followedTeams]);

  //If live league fixtures are present, update them.
  useEffect(() => {
    followedLeagues.forEach((league) => {
      if (leagues[league] && fixtures[league]) {
        const now = new Date();
        const currentSeason =
          leagues[league].leagueInfo.seasons.find((season) => {
            return season.current;
          }).year || now.getFullYear();
        if (
          (fixtures[league].fixtureInfo.filter(({ fixture }) => {
            return (
              fixtureInProgress(fixture.status.short) &&
              !fixtureOnBreak(fixture.status.short)
            );
          }).length > 0 &&
            Date.now() - fixtures[league].lastUpdated >= 60000) ||
          fixtures[league].fixtureInfo
            .filter(({ fixture }) => {
              return fixture.timestamp * 1000 - Date.now() < 0;
            })
            .filter(({ fixture }) => {
              return fixture.status.short === "NS";
            }).length > 0
        ) {
          dispatch(updateFixtures(currentSeason, league));
        }
      }
    });
  }, [dispatch, fixtures, leagues, standings, followedLeagues]);

  //For team fixtures starting later today
  useEffect(() => {
    Object.keys(teams).forEach((team) => {
      if (teamLeagues[team] && teamFixtures[team]) {
        let currentSeasons = teamLeagues[team].leagueInfo.map((league) => {
          return league.seasons[0].year;
        });
        let currentYear = 0;
        currentSeasons.forEach((season) => {
          currentYear = Math.max(season, currentYear);
        });
        const fixturesInProgress = teamFixtures[team].fixtureInfo.filter(
          ({ fixture }) => {
            return fixtureInProgress(fixture.status.short);
          }
        );
        const fixturesEnding = teamFixtures[team].fixtureInfo.filter(
          ({ fixture }) => {
            return fixtureEnding(fixture.status.elapsed, fixture.status.short);
          }
        );

        //Identifies team fixtures happening today.
        const todaysFixtures = teamFixtures[team].fixtureInfo.filter(
          ({ fixture }) => {
            return fixture.timestamp * 1000 - Date.now() <= 60000 * 60 * 24;
          }
        );
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

        //If a team fixture is starting later, start a timer to start updating live fixtures when the game begins.
        if (startUpdateTimes.length > 0 && !fixturesInProgress > 0) {
          startUpdateTimes.forEach((timeUntil) => {
            initializer = setTimeout(() => {
              dispatch(updateLiveTeamFixtures(team, currentYear));
            }, timeUntil);
          });
        }

        //Updates live team fixtures every minute until all live fixtures are finished.

        //Checks if any team fixtures are live or starting.
        if (fixturesInProgress.length > 0 || continueUpdates.length > 0) {
          //Fixtures in the halftime break
          const fixturesBreak = teamFixtures[team].fixtureInfo.filter(
            ({ fixture }) => {
              return (
                fixture.status.short === "HT" && fixture.status.elapsed === 45
              );
            }
          );
          if (
            fixturesBreak.length > 0 &&
            fixturesBreak.length === fixturesInProgress.length
          ) {
            timer = setTimeout(() => {
              dispatch(updateLiveTeamFixtures(team, currentYear));
            }, 60000 * 5.1);
            //TODO:Replace arbitrary value
          } else {
            timer = setTimeout(() => {
              if (
                fixturesEnding.length > 0 &&
                fixturesEnding.length < fixturesInProgress.length
              ) {
                fixturesEnding.forEach(({ fixture }) => {
                  dispatch(updateLiveTeamFixturesById(fixture.id, team));
                });
                dispatch(updateLiveTeamFixtures(team, currentYear));
              } else if (fixturesEnding.length > 0) {
                fixturesEnding.forEach(({ fixture }) => {
                  dispatch(updateLiveTeamFixturesById(fixture.id, team));
                });
              } else {
                dispatch(updateLiveTeamFixtures(team, currentYear));
              }
            }, 60000);
          }
        }
        return () => {
          clearTimeout(timer);
          clearTimeout(initializer);
        };
      }
    });
  }, [dispatch, teamFixtures, teamLeagues, standings, teams]);

  // For league fixtures starting later today
  useEffect(() => {
    Object.keys(leagues).forEach((league) => {
      if (leagues[league] && fixtures[league]) {
        const now = new Date();
        const currentSeason =
          leagues[league].leagueInfo.seasons.find((season) => {
            return season.current;
          }).year || now.getFullYear();
        const fixturesInProgress = fixtures[league].fixtureInfo.filter(
          ({ fixture }) => {
            return fixtureInProgress(fixture.status.short);
          }
        );
        const fixturesEnding = fixtures[league].fixtureInfo.filter(
          ({ fixture }) => {
            return fixtureEnding(fixture.status.elapsed, fixture.status.short);
          }
        );

        //Identifies fixtures happening today and starts a timer to update when those fixtures begin.
        const todaysFixtures = fixtures[league].fixtureInfo.filter(
          ({ fixture }) => {
            return fixture.timestamp * 1000 - Date.now() <= 60000 * 60 * 24;
          }
        );
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
              dispatch(updateLiveFixtures(currentSeason, league));
            }, timeUntil);
          });
        }

        //Checks if any fixtures are live or starting.
        if (fixturesInProgress.length > 0 || continueUpdates.length > 0) {
          //Fixtures in the halftime break
          const fixturesBreak = fixtures[league].fixtureInfo.filter(
            ({ fixture }) => {
              return (
                fixture.status.short === "HT" && fixture.status.elapsed === 45
              );
            }
          );
          //If all fixtures are at halftime break, update every ~5 minutes
          if (
            fixturesBreak.length > 0 &&
            fixturesBreak.length === fixturesInProgress.length
          ) {
            timer = setTimeout(() => {
              dispatch(updateLiveFixtures(currentSeason, league));
            }, 60000 * 5.1);
            //TODO:Replace arbitrary value
          } else {
            timer = setTimeout(() => {
              if (
                fixturesEnding.length > 0 &&
                fixturesEnding.length < fixturesInProgress.length
              ) {
                fixturesEnding.forEach(({ fixture }) => {
                  dispatch(updateLiveFixturesById(fixture.id, league));
                });
                dispatch(updateLiveFixtures(currentSeason, league));
              } else if (
                fixturesEnding.length > 0 &&
                fixturesEnding.length === fixturesInProgress.length
              ) {
                fixturesEnding.forEach(({ fixture }) => {
                  dispatch(updateLiveFixturesById(fixture.id, league));
                });
              } else {
                dispatch(updateLiveFixtures(currentSeason, league));
              }
            }, 60000);
          }
          //If all fixtures have been played, update Standings after an hour.
        } else if (
          todaysFixtures.length > 0 &&
          todaysFixtures.filter(({ fixture }) => {
            return fixtureFinished(fixture.status.short);
          }).length === todaysFixtures.length &&
          standings[league] &&
          Date.now() - standings[league].lastUpdated >= 60000 * 60
        ) {
          dispatch(updateStandings(league, currentSeason));
        }
        return () => {
          clearTimeout(timer);
          clearTimeout(initializer);
        };
      }
    });
  }, [dispatch, fixtures, leagues, standings]);

  return { allFixtures };
}
