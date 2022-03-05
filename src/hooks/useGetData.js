import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFixtures,
  updateFixtures,
  updateAllLiveFixtures,
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
  fixturesToday,
} from "../helpers/fixturesHelper";
import _ from "lodash";
import useInterval from "./useInterval";

export default function useGetData() {
  const dispatch = useDispatch();
  const [allFixtures, setAllFixtures] = useState([]);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const leagues = useSelector((state) => state.leagues);
  const teamLeagues = useSelector((state) => state.teamLeagues);
  const fixtures = useSelector((state) => state.fixtures);
  const standings = useSelector((state) => state.standings);

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

  //get match info.
  useEffect(() => {
    if (Object.values(fixtures).length) {
    }
    followedTeams.forEach((team) => {
      const teamSpecificMatches = Object.values(fixtures).filter((match) => {
        return (
          match.teams &&
          (Number(match.teams.home.id) === team ||
            Number(match.teams.away.id) === team) &&
          !followedLeagues.includes(match.league.id)
        );
      });
      const needsUpdate = Object.values(fixtures).filter((match) => {
        return (
          match.teams &&
          (Number(match.teams.home.id) === team ||
            Number(match.teams.away.id) === team) &&
          Date.now() - match.lastUpdated >= 86400000
        );
      });
      if (teamLeagues[team]) {
        let currentSeasons = teamLeagues[team].leagueInfo.map((league) => {
          return league.seasons[0].year;
        });
        let currentYear = 0;
        currentSeasons.forEach((season) => {
          currentYear = Math.max(season, currentYear);
        });
        if (!teamSpecificMatches.length) {
          dispatch(fetchTeamFixtures(team, currentYear));
        } else if (needsUpdate.length) {
          dispatch(updateTeamFixtures(team, currentYear));
        }
      }
    });

    followedLeagues.forEach((league) => {
      const leagueSpecificMatches = Object.values(fixtures).filter((match) => {
        return (
          Number(match.league.id) === league &&
          !(
            followedTeams.includes(match.teams.home.id) ||
            followedTeams.includes(match.teams.away.id)
          )
        );
      });
      const needsUpdate = Object.values(fixtures).filter((match) => {
        return (
          Number(match.league.id) === league &&
          Date.now() - match.lastUpdated >= 86400000
        );
      });
      if (leagues[league]) {
        const now = new Date();
        let currentSeason =
          leagues[league].leagueInfo.seasons.find((season) => {
            return season.current;
          }).year || now.getFullYear();
        if (!leagueSpecificMatches.length) {
          dispatch(fetchFixtures(currentSeason, league));
          //If it's been more than 24 hours since fixtures have been updated.
        } else if (needsUpdate.length) {
          dispatch(updateFixtures(currentSeason, league));
        }
      }
    });
  }, [followedTeams, followedLeagues, leagues, teamLeagues, dispatch]);

  //If live matches are present in data when application first loads, update them.
  useEffect(() => {
    if (
      Object.values(fixtures).length &&
      fixturesInProgress(Object.values(fixtures)).length
    ) {
      followedTeams.forEach((team) => {
        if (teamLeagues[team] && Object.values(fixtures).length > 0) {
          const teamMatches = Object.values(fixtures).filter((match) => {
            return match.teams.home.id === team || match.teams.away.id === team;
          });
          const liveMatches = fixturesInProgress(teamMatches);
          let currentSeasons = teamLeagues[team].leagueInfo.map((league) => {
            return league.seasons[0].year;
          });
          let currentYear = 0;
          currentSeasons.forEach((season) => {
            currentYear = Math.max(season, currentYear);
          });
          if (
            //The match is not on break and hasn't been updated for more than a minute
            liveMatches.filter((match) => {
              return (
                !fixtureOnBreak(match.fixture.status.short) &&
                Date.now() - match.lastUpdated >= 60000
              );
            }).length > 0 ||
            //The match
            liveMatches.filter((match) => {
              return (
                match.fixture.timestamp * 1000 - Date.now() < 0 &&
                match.fixture.status.short === "NS" &&
                Date.now() - match.lastUpdated >= 60000
              );
            }).length > 0
          ) {
            dispatch(updateTeamFixtures(team, currentYear));
          }
        }
      });

      followedLeagues.forEach((league) => {
        //Check if fixtures for the specific league exist
        if (
          leagues[league] &&
          Object.values(fixtures).filter((match) => {
            return Number(match.league.id) === league;
          }).length > 0
        ) {
          const competitionMatches = Object.values(fixtures).filter((match) => {
            return Number(match.league.id) === league;
          });
          const liveMatches = fixturesInProgress(competitionMatches);
          const now = new Date();
          const currentSeason =
            leagues[league].leagueInfo.seasons.find((season) => {
              return season.current;
            }).year || now.getFullYear();
          if (
            (liveMatches.filter((match) => {
              return (
                fixtureInProgress(match.fixture.status.short) &&
                !fixtureOnBreak(match.fixture.status.short)
              );
            }).length > 0 &&
              liveMatches.filter((match) => {
                return Date.now() - match.lastUpdated >= 60000;
              }).length > 0) ||
            liveMatches.filter((match) => {
              return (
                match.fixture.timestamp * 1000 - Date.now() < 0 &&
                match.fixture.status.short === "NS" &&
                Date.now() - match.lastUpdated >= 60000
              );
            }).length > 0
          ) {
            dispatch(updateFixtures(currentSeason, league));
          }
        }
      });
    }
  }, []);

  // For matches starting later today
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
      Object.values(fixtures).length &&
      !Object.values(fixtures).filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = fixturesToday(Object.values(fixtures));
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
        allMatchesOnBreak.length !== allMatchesInProgress.length
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

  //Build a shortened fixtures array.
  useEffect(() => {
    if (Object.values(fixtures).length) {
      let tempFixtures = [];
      fixturesUpcoming(Object.values(fixtures))
        .splice(0, 10)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
      fixturesInProgress(Object.values(fixtures))
        .splice(0, 10)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });
      fixturesFinished(Object.values(fixtures))
        .splice(0, 10)
        .forEach((fixture) => {
          tempFixtures.push(fixture);
        });

      //Filters all unique fixture objects available
      const allUniqFixtures = tempFixtures.filter(
        (fixture, index) =>
          tempFixtures.findIndex(
            (obj) => obj.fixture.id === fixture.fixture.id
          ) === index
      );
      setAllFixtures(allUniqFixtures);
    }
  }, [fixtures]);

  return { allFixtures };
}
