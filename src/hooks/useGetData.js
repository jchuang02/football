import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchFixtures,
  updateFixtures,
  updateAllLiveFixtures,
  updateLiveFixturesById,
  fetchTeamFixtures,
  updateTeamFixtures,
} from "../state/actions/fixtures";
import { fetchStandings, updateStandings } from "../state/actions/standings";
import {
  matchInProgress,
  matchOnBreak,
  matchEnding,
  matchFinished,
} from "../helpers/matchStatusHelper";
import {
  matchesUpcoming,
  matchesFinished,
  matchesInProgress,
  matchesToday,
} from "../helpers/matchesHelper";
import _ from "lodash";
import useInterval from "./useInterval";

export default function useGetData() {
  const dispatch = useDispatch();
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const followedTeams = useSelector((state) => state.followed.teams);
  const leagues = useSelector((state) => state.leagues);
  const matches = useSelector((state) => state.fixtures);
  const standings = useSelector((state) => state.standings);

  //get standings info
  useEffect(() => {
    followedLeagues.forEach((league) => {
      if (leagues[league]) {
        const now = new Date();
        const currentSeason =
          leagues[league].league.seasons.find((season) => {
            return season.current;
          }).year || now.getFullYear();
        if (!standings[league]) {
          dispatch(fetchStandings(league, currentSeason));
        } else if (Date.now() - standings[league].lastUpdated >= 86400000) {
          dispatch(updateStandings(league, currentSeason));
        }
      }
    });
    followedTeams.forEach((team) => {
      const teamLeagues = Object.values(leagues).filter((league) => {
        return league.team.includes(team);
      });
      let currentSeasons = teamLeagues.map(({ league }) => {
        return league.seasons[0].year;
      });
      let currentYear = 0;
      currentSeasons.forEach((season) => {
        currentYear = Math.max(season, currentYear);
      });
      teamLeagues.forEach(({ league }) => {
        if (!standings[league.league.id]) {
          dispatch(fetchStandings(league.league.id, currentYear));
        } else if (
          Date.now() - standings[league.league.id].lastUpdated >=
          86400000
        ) {
          dispatch(updateStandings(league.league.id, currentYear));
        }
      });
    });
  }, [followedLeagues, followedTeams, dispatch, leagues]);

  //get match info.
  useEffect(() => {
    followedTeams.forEach((team) => {
      const teamSpecificMatches = Object.values(matches).filter((match) => {
        return (
          match.teams &&
          ((Number(match.teams.home.id) === team &&
            !followedTeams.includes(match.teams.away.id)) ||
            (Number(match.teams.away.id) === team &&
              !followedTeams.includes(match.teams.home.id))) &&
          !followedLeagues.includes(Number(match.league.id))
        );
      });
      const teamLeagues = Object.values(leagues).filter((league) => {
        return league.team.includes(team);
      });
      if (teamLeagues.length > 0) {
        let currentSeasons = teamLeagues.map(({ league }) => {
          return league.seasons[0].year;
        });
        let currentYear = 0;
        currentSeasons.forEach((season) => {
          currentYear = Math.max(season, currentYear);
        });
        if (teamSpecificMatches.length === 0) {
          dispatch(fetchTeamFixtures(team, currentYear));
        } else {
          const needsUpdate = teamSpecificMatches.filter((match) => {
            return Date.now() - match.lastUpdated >= 86400000;
          });
          const todaysMatches = matchesToday(teamSpecificMatches).filter(
            (match) => {
              return (
                match.fixture.status.short === "NS" &&
                match.fixture.timestamp * 1000 - Date.now() < 0
              );
            }
          );
          if (needsUpdate.length || todaysMatches.length > 0) {
            dispatch(updateTeamFixtures(team, currentYear));
          }
        }
      }
    });

    followedLeagues.forEach((league) => {
      if (leagues[league]) {
        const leagueSpecificMatches = Object.values(matches).filter(
          (match) => {
            return (
              Number(match.league.id) === league &&
              !(
                followedTeams.includes(Number(match.teams.home.id)) ||
                followedTeams.includes(Number(match.teams.away.id))
              )
            );
          }
        );
        const now = new Date();
        let currentSeason =
          leagues[league].league.seasons.find((season) => {
            return season.current;
          }).year || now.getFullYear();
        if (leagueSpecificMatches.length === 0) {
          dispatch(fetchFixtures(currentSeason, league));
          //If it's been more than 24 hours since matches have been updated.
        } else {
          const needsUpdate = leagueSpecificMatches.filter((match) => {
            return (
              Number(match.league.id) === league &&
              Date.now() - match.lastUpdated >= 86400000
            );
          });
          const todaysMatches = matchesToday(leagueSpecificMatches).filter(
            (match) => {
              return (
                match.fixture.status.short === "NS" &&
                match.fixture.timestamp * 1000 - Date.now() < 0
              );
            }
          );
          if (needsUpdate.length || todaysMatches.length > 0) {
            dispatch(updateFixtures(currentSeason, league));
          }
        }
      }
    });
  }, [dispatch, followedTeams, followedLeagues, leagues]);

  //If live matches are present in data when application first loads, update them.
  useEffect(() => {
    const allMatches = Object.values(matches);
    const allLeagues = Object.values(leagues);
    if (allMatches.length && matchesInProgress(allMatches).length) {
      followedTeams.forEach((team) => {
        if (
          allLeagues.filter((league) => {
            return league.team === team;
          }).length > 0 &&
          allMatches.length > 0
        ) {
          const teamMatches = allMatches.filter((match) => {
            return match.teams.home.id === team || match.teams.away.id === team;
          });
          const liveMatches = matchesInProgress(teamMatches);
          const teamLeagues = allLeagues.filter((league) => {
            return league.team === team;
          });
          let currentSeasons = teamLeagues.map(({ league }) => {
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
                !matchOnBreak(match.fixture.status.short) &&
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
        //Check if matches for the specific league exist
        if (
          leagues[league] &&
          allMatches.filter((match) => {
            return Number(match.league.id) === league;
          }).length > 0
        ) {
          const competitionMatches = allMatches.filter((match) => {
            return Number(match.league.id) === league;
          });
          const liveMatches = matchesInProgress(competitionMatches);
          const now = new Date();
          const currentSeason =
            leagues[league].league.seasons.find((season) => {
              return season.current;
            }).year || now.getFullYear();
          if (
            (liveMatches.filter((match) => {
              return (
                matchInProgress(match.fixture.status.short) &&
                !matchOnBreak(match.fixture.status.short)
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
    const allMatches = Object.values(matches);
    let timer;
    if (
      !allMatches.filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = matchesToday(allMatches) || [];
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
    const allMatches = Object.values(matches);
    if (allMatches.length && matchesToday(allMatches).length) {
      const allMatchesToday = matchesToday(allMatches);
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
      const allMatchesOnBreak = allMatches.filter((match) => {
        return match.fixture.status.short === "HT" && match.fixture.status.elapsed === 45;
      });
      const allMatchesEnding = allMatches.filter((match) => {
        return matchEnding(match.fixture.status.elapsed, match.fixture.status.short);
      });
      const allMatchesInProgress = matchesInProgress(allMatches);
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
            leagues[standing].league.seasons.find((season) => {
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
    const allMatches = Object.values(matches);
    if (
      allMatches.length &&
      matchesToday(allMatches).filter((match) => {
        return match.fixture.status.short === "HT";
      }).length
    ) {
      const allMatchesOnBreak = allMatches.filter((match) => {
        return match.fixture.status.short === "HT" && match.fixture.status.elapsed === 45;
      });
      const allMatchesInProgress = matchesInProgress(allMatches);
      if (allMatchesOnBreak.length === allMatchesInProgress.length) {
        dispatch(updateAllLiveFixtures());
      }
    }
  }, breakDelay);

  //Build a shortened matches array.
  const allShownMatches = useMemo(() => {
    const allMatches = Object.values(matches);
    if (allMatches.length) {
      let firstTenMatches = [];
      matchesUpcoming(allMatches)
        .splice(0, 10)
        .forEach((match) => {
          firstTenMatches.push(match);
        });
      matchesInProgress(allMatches)
        .splice(0, 10)
        .forEach((match) => {
          firstTenMatches.push(match);
        });
      matchesFinished(allMatches)
        .splice(0, 10)
        .forEach((match) => {
          firstTenMatches.push(match);
        });

      return firstTenMatches;
    }
  }, [matches]);

  return { allShownMatches };
}
