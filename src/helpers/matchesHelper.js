import { matchInProgress, matchFinished } from "./matchStatusHelper";

export const separateMatches = (matches, separatedBy = 2) => {
  let separateMatches = [];

  for (let i = 0; i < matches.length; i += separatedBy) {
    const temp = matches.slice(i, i + separatedBy);
    if (temp.length) {
      separateMatches.push(temp);
    }
  }

  return separateMatches;
};

export const matchesToday = (matches) => {
  if (matches.length) {
    return matches
      .filter((match) => {
        if (match.fixture) {
          return match.fixture.timestamp * 1000 - Date.now() <= 60000 * 60 * 24;
        } else {
          return false;
        }
      })
      .sort((matchOne, matchTwo) => {
        return matchOne.fixture.timestamp - matchTwo.fixture.timestamp;
      });
  }
  return "";
};

export const matchesInProgress = (matches) => {
  if (matches.length) {
    return matches
      .filter((match) => {
        if (match.fixture) {
          return matchInProgress(match.fixture.status.short);
        } else {
          return false;
        }
      })
      .sort((matchOne, matchTwo) => {
        return matchOne.fixture.timestamp - matchTwo.fixture.timestamp;
      });
  }
  return "";
};

export const matchesFinished = (matches) => {
  if (matches.length) {
    return matches
      .filter((match) => {
        if (match.fixture) {
          return matchFinished(match.fixture.status.short);
        } else {
          return false;
        }
      })
      .sort((matchOne, matchTwo) => {
        return matchTwo.fixture.timestamp - matchOne.fixture.timestamp;
      });
  }
  return "";
};

export const matchesUpcoming = (matches) => {
  if (matches.length) {
    return matches
      .filter((match) => {
        if (match.fixture) {
          return (
            !matchInProgress(match.fixture.status.short) &&
            !matchFinished(match.fixture.status.short) &&
            match.fixture.timestamp * 1000 - Date.now() > 0
          );
        } else {
          return false;
        }
      })
      .sort((matchOne, matchTwo) => {
        return matchOne.fixture.timestamp - matchTwo.fixture.timestamp;
      });
  }
  return "";
};
