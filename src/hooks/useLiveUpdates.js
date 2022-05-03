import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAllLiveMatches,
  updateLiveMatchesById,
} from "../actions/matches";
import { updateStandings } from "../actions/standings";
import { matchEnding, matchFinished } from "../helpers/matchStatusHelper";
import { matchesInProgress, matchesToday } from "../helpers/matchesHelper";

import _ from "lodash";
import useInterval from "../hooks/useInterval";
export default function useLiveUpdates() {
  const dispatch = useDispatch();
  const leagues = useSelector((state) => state.leagues);
  const matches = useSelector((state) => state.fixtures);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const standings = useSelector((state) => state.standings);

  // For matches starting later today
  useEffect(() => {
    let timer;
    if (
      !Object.values(matches).filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = matchesToday(Object.values(matches));
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
            dispatch(updateAllLiveMatches());
          }, time);
        });
      }
    }
    return () => {
      clearTimeout(timer);
    };
  });

  //For matches happening soon or now
  let delay = 60000;
  useInterval(() => {
    if (
      !Object.values(matches).filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesToday = matchesToday(Object.values(matches));
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
      const allMatchesOnBreak = Object.values(matches).filter(
        ({ match }) => {
          return match.status.short === "HT" && match.status.elapsed === 45;
        }
      );
      const allMatchesEnding = Object.values(matches).filter(({ match }) => {
        return matchEnding(match.status.elapsed, match.status.short);
      });
      const allMatchesInProgress = matchesInProgress(Object.values(matches));
      if (
        (allMatchesInProgress.length > 0 || continueUpdates.length > 0) &&
        !allMatchesOnBreak.length !== allMatchesInProgress.length
      ) {
        if (
          allMatchesEnding.length > 0 &&
          allMatchesEnding.length < allMatchesInProgress.length
        ) {
          allMatchesEnding.forEach((match) => {
            dispatch(updateLiveMatchesById(match.fixture.id, match.league.id));
          });
          dispatch(updateAllLiveMatches());
          //If all matches are ending
        } else if (
          allMatchesEnding.length > 0 &&
          allMatchesEnding.length === allMatchesInProgress.length
        ) {
          allMatchesEnding.forEach((match) => {
            dispatch(updateLiveMatchesById(match.fixture.id, match.league.id));
          });
        } else {
          dispatch(updateAllLiveMatches());
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
  //When matches are all on break
  useInterval(() => {
    if (
      !Object.values(matches).filter((match) => {
        return match.loading;
      }).length > 0
    ) {
      const allMatchesOnBreak = Object.values(matches).filter(
        ({ match }) => {
          return match.status.short === "HT" && match.status.elapsed === 45;
        }
      );
      const allMatchesInProgress = matchesInProgress(Object.values(matches));
      if (allMatchesOnBreak.length === allMatchesInProgress.length) {
        console.log("Match at halftime break. Staggering updates");
        dispatch(updateAllLiveMatches());
      }
    }
  }, breakDelay);
}
