import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateAllLiveFixtures,
  updateLiveFixturesById,
} from "../actions/fixtures";
import { updateStandings } from "../actions/standings";
import { fixtureEnding, fixtureFinished } from "../helpers/fixtureStatusHelper";
import { fixturesInProgress, fixturesToday } from "../helpers/fixturesHelper";

import _ from "lodash";
import useInterval from "../hooks/useInterval";
export default function useLiveUpdates() {
  const dispatch = useDispatch();
  const leagues = useSelector((state) => state.leagues);
  const fixtures = useSelector((state) => state.fixtures);
  const followedLeagues = useSelector((state) => state.followed.leagues);
  const standings = useSelector((state) => state.standings);

  // For matches starting later today
  useEffect(() => {
    let timer;
    if (
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
  });

  //For matches happening soon or now
  let delay = 60000;
  useInterval(() => {
    if (
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
}
